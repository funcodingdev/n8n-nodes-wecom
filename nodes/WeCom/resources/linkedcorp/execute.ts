import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl, weComApiRequest } from '../../shared/transport';

const splitList = (value: unknown): string[] => [...new Set(
	String(value ?? '').split(/[,|\n]/).map((entry) => entry.trim()).filter(Boolean),
)];

const asObject = (value: unknown): IDataObject | undefined =>
	value && typeof value === 'object' && !Array.isArray(value) ? value as IDataObject : undefined;

const asObjectArray = (value: unknown): IDataObject[] =>
	Array.isArray(value)
		? value.filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry)) as IDataObject[]
		: [];

export async function executeLinkedcorp(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const credentials = await this.getCredentials('weComApi') as { agentId?: string };
	const defaultAgentId = String(credentials.agentId ?? '').trim();

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		const fail = (message: string): never => {
			throw new NodeOperationError(this.getNode(), message, { itemIndex });
		};
		const requiredText = (value: unknown, label: string, maximum?: number): string => {
			const text = String(value ?? '').trim();
			if (!text) fail(`${label}不能为空`);
			if (maximum && Buffer.byteLength(text, 'utf8') > maximum) {
				fail(`${label}不能超过 ${maximum} 字节`);
			}
			return text;
		};
		const optionalText = (value: unknown): string | undefined => {
			const text = String(value ?? '').trim();
			return text || undefined;
		};
		const integerInRange = (
			value: unknown,
			label: string,
			minimum: number,
			maximum = Number.MAX_SAFE_INTEGER,
		): number => {
			const number = Number(value);
			if (!Number.isInteger(number) || number < minimum || number > maximum) {
				fail(`${label}必须是 ${minimum}～${maximum} 之间的整数`);
			}
			return number;
		};
		const parseJson = (value: unknown, label: string, expectArray = false): unknown => {
			try {
				const parsed = typeof value === 'string' ? JSON.parse(value) as unknown : value;
				if (expectArray ? !Array.isArray(parsed) : !asObject(parsed)) {
					fail(`${label}必须是${expectArray ? '数组' : '对象'}`);
				}
				return parsed;
			} catch (error) {
				if (error instanceof NodeOperationError) throw error;
				return fail(`${label}不是有效 JSON：${(error as Error).message}`);
			}
		};
		const validateRuleInfo = (ruleInfo: IDataObject): IDataObject => {
			const owner = asObject(ruleInfo.owner_corp_range) ?? {};
			const member = asObject(ruleInfo.member_corp_range) ?? {};
			const ownerDepartments = splitList(owner.departmentids);
			const ownerUsers = splitList(owner.userids);
			const memberGroups = splitList(member.groupids);
			const memberCorps = splitList(member.corpids);
			if (!ownerDepartments.length && !ownerUsers.length) {
				fail('上游部门 ID 与上游成员 ID 至少填写一项');
			}
			if (!memberGroups.length && !memberCorps.length) {
				fail('下游分组 ID 与下游企业 CorpID 至少填写一项');
			}
			const normalizedOwner: IDataObject = {};
			const normalizedMember: IDataObject = {};
			if (ownerDepartments.length) normalizedOwner.departmentids = ownerDepartments;
			if (ownerUsers.length) normalizedOwner.userids = ownerUsers;
			if (memberGroups.length) normalizedMember.groupids = memberGroups;
			if (memberCorps.length) normalizedMember.corpids = memberCorps;
			return { owner_corp_range: normalizedOwner, member_corp_range: normalizedMember };
		};
		const getRuleInfo = (): IDataObject => {
			const mode = this.getNodeParameter('rule_info_input_mode', itemIndex, 'form') as string;
			if (mode === 'json') {
				return validateRuleInfo(parseJson(
					this.getNodeParameter('rule_info_json', itemIndex, '{}'),
					'规则详情 JSON',
				) as IDataObject);
			}
			return validateRuleInfo({
				owner_corp_range: {
					departmentids: splitList(this.getNodeParameter('owner_departmentids', itemIndex, '')),
					userids: splitList(this.getNodeParameter('owner_userids', itemIndex, '')),
				},
				member_corp_range: {
					groupids: splitList(this.getNodeParameter('member_groupids', itemIndex, '')),
					corpids: splitList(this.getNodeParameter('member_corpids', itemIndex, '')),
				},
			});
		};
		const validateContactList = (contacts: IDataObject[]): IDataObject[] => {
			if (!contacts.length) fail('上下游企业列表至少包含 1 家企业');
			if (contacts.length > 1000) fail('单次最多导入 1000 家企业');
			let totalContacts = 0;
			return contacts.map((company, companyIndex) => {
				const corpName = requiredText(company.corp_name, `第 ${companyIndex + 1} 家企业名称`);
				if (Array.from(corpName).length > 32 || !/^[\p{Script=Han}A-Za-z0-9 _\-()（）]+$/u.test(corpName)) {
					fail(`第 ${companyIndex + 1} 家企业名称必须为 1～32 个字符，且仅支持中文、字母、数字及空格、-_()（）`);
				}
				const customId = optionalText(company.custom_id);
				if (customId && (Buffer.byteLength(customId, 'utf8') > 64 || !/^[A-Za-z0-9]+$/.test(customId))) {
					fail(`第 ${companyIndex + 1} 家企业自定义 ID 最长 64 字节且仅支持字母和数字`);
				}
				const contactContainer = asObject(company.contact_info_list);
				const contactList = asObjectArray(contactContainer?.contacts ?? company.contact_info_list);
				if (!contactList.length) fail(`第 ${companyIndex + 1} 家企业至少包含 1 位联系人`);
				if (contactList.length > 200) fail(`第 ${companyIndex + 1} 家企业最多导入 200 位联系人`);
				totalContacts += contactList.length;
				if (totalContacts > 2000) fail('单次最多导入 2000 位联系人');
				if (contactList.filter((contact) => Number(contact.identity_type ?? 1) === 2).length > 5) {
					fail(`第 ${companyIndex + 1} 家企业最多填写 5 位负责人`);
				}
				const normalizedContacts = contactList.map((contact, contactIndex) => {
					const prefix = `第 ${companyIndex + 1} 家企业第 ${contactIndex + 1} 位联系人`;
					const name = requiredText(contact.name, `${prefix}姓名`);
					if (Array.from(name).length > 32) fail(`${prefix}姓名不能超过 32 个字符`);
					const identityType = Number(contact.identity_type ?? 1);
					if (![1, 2].includes(identityType)) fail(`${prefix}身份只能是成员或负责人`);
					const mobile = requiredText(contact.mobile, `${prefix}手机号`);
					if (!/^\+?\d{5,20}$/.test(mobile)) fail(`${prefix}手机号格式无效`);
					const userCustomId = optionalText(contact.user_custom_id);
					if (userCustomId) {
						const maximum = '18446744073709551614';
						if (
							!/^[1-9]\d*$/.test(userCustomId) ||
							[11, 13].includes(userCustomId.length) ||
							userCustomId.length > maximum.length ||
							(userCustomId.length === maximum.length && userCustomId > maximum)
						) fail(`${prefix}自定义 ID 必须是 1～2^64-2 的整数，不得有前导 0，且不得为 11 或 13 位`);
					}
					const normalized: IDataObject = { name, identity_type: identityType, mobile };
					if (userCustomId) normalized.user_custom_id = userCustomId;
					return normalized;
				});
				const normalized: IDataObject = { corp_name: corpName, contact_info_list: normalizedContacts };
				const groupPath = optionalText(company.group_path);
				if (groupPath) normalized.group_path = groupPath;
				if (customId) normalized.custom_id = customId;
				return normalized;
			});
		};

		try {
			let response!: IDataObject;
			if (operation === 'getAppShareInfo') {
				const agentid = requiredText(
					optionalText(this.getNodeParameter('agentid', itemIndex, '')) ?? defaultAgentId,
					'上级/上游应用 AgentID',
				);
				const body: IDataObject = {
					agentid,
					business_type: integerInRange(this.getNodeParameter('business_type', itemIndex, 1), '业务类型', 0, 1),
					limit: integerInRange(this.getNodeParameter('limit', itemIndex, 100), '分页大小', 0, 100),
				};
				const corpid = optionalText(this.getNodeParameter('corpid', itemIndex, ''));
				const cursor = optionalText(this.getNodeParameter('cursor', itemIndex, ''));
				if (corpid) body.corpid = corpid;
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/list_app_share_info', body);
			} else if (operation === 'getLinkedCorpToken' || operation === 'getMiniProgramSession') {
				const tokenResponse = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/corp/gettoken',
					{
						corpid: requiredText(this.getNodeParameter('corpid', itemIndex), '下级/下游企业 CorpID'),
						agentid: requiredText(this.getNodeParameter('agentid', itemIndex), '下级/下游应用 AgentID'),
						business_type: integerInRange(
							this.getNodeParameter('business_type', itemIndex, operation === 'getMiniProgramSession' ? 1 : 0),
							'业务类型',
							0,
							1,
						),
					},
				);
				if (operation === 'getLinkedCorpToken') {
					response = tokenResponse;
				} else {
					const accessToken = requiredText(tokenResponse.access_token, '下级/下游企业 access_token');
					const userid = requiredText(this.getNodeParameter('userid', itemIndex), '加密用户 ID', 64);
					const sessionKey = requiredText(this.getNodeParameter('session_key', itemIndex), '会话密钥', 64);
					response = await this.helpers.httpRequest({
						method: 'POST',
						url: `${await getWeComBaseUrl.call(this)}/cgi-bin/miniprogram/transfer_session`,
						qs: { access_token: accessToken },
						body: { userid, session_key: sessionKey },
						json: true,
					}) as IDataObject;
					if (Number(response.errcode ?? 0) !== 0) {
						fail(`转换小程序 Session 失败：${String(response.errmsg ?? '未知错误')}（错误码 ${String(response.errcode)}）`);
					}
				}
			} else if (operation === 'getLinkedCustomer') {
				const body: IDataObject = {
					unionid: requiredText(this.getNodeParameter('unionid', itemIndex), 'UnionID'),
					openid: requiredText(this.getNodeParameter('openid', itemIndex), 'OpenID'),
				};
				for (const field of ['corpid', 'mass_call_ticket'] as const) {
					const value = optionalText(this.getNodeParameter(field, itemIndex, ''));
					if (value) body[field] = value;
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/unionid_to_external_userid', body);
			} else if (operation === 'getChainInfo') {
				const queryType = this.getNodeParameter('chain_query_type', itemIndex, 'chains') as string;
				if (queryType === 'chains') {
					response = await weComApiRequest.call(this, 'GET', '/cgi-bin/corpgroup/corp/get_chain_list');
				} else {
					const body: IDataObject = {
						chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
						need_pending: this.getNodeParameter('need_pending', itemIndex, false) as boolean,
						limit: integerInRange(this.getNodeParameter('limit', itemIndex, 100), '分页大小', 0),
					};
					const groupid = integerInRange(this.getNodeParameter('groupid', itemIndex, 0), '分组 ID', 0);
					const cursor = optionalText(this.getNodeParameter('cursor', itemIndex, ''));
					if (groupid > 0) body.groupid = groupid;
					if (cursor) body.cursor = cursor;
					response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/get_chain_corpinfo_list', body);
				}
			} else if (operation === 'batchImportChainContact') {
				const mode = this.getNodeParameter('contact_input_mode', itemIndex, 'form') as string;
				const contacts = mode === 'json'
					? parseJson(this.getNodeParameter('contact_list_json', itemIndex, '[]'), '联系人列表 JSON', true) as IDataObject[]
					: asObjectArray((this.getNodeParameter('contact_list', itemIndex, {}) as IDataObject).companies);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/import_chain_contact', {
					chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
					contact_list: validateContactList(contacts),
				});
			} else if (operation === 'getChainAsyncResult') {
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/corpgroup/getresult', {}, {
					jobid: requiredText(this.getNodeParameter('jobid', itemIndex), 'Job ID', 64),
				});
			} else if (operation === 'removeChainCorp') {
				const body: IDataObject = {
					chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
				};
				const type = this.getNodeParameter('remove_corp_type', itemIndex, 'joined') as string;
				if (type === 'joined') body.corpid = requiredText(this.getNodeParameter('corpid', itemIndex), '企业 CorpID');
				else body.pending_corpid = requiredText(this.getNodeParameter('pending_corpid', itemIndex), '待加入企业 CorpID');
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/remove_corp', body);
			} else if (operation === 'getCustomUserId') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/get_chain_user_custom_id', {
					chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
					corpid: requiredText(this.getNodeParameter('corpid', itemIndex), '已加入企业 CorpID'),
					userid: requiredText(this.getNodeParameter('userid', itemIndex), '成员 UserID'),
				});
			} else if (operation === 'getSubCorpChainList') {
				const corpid = optionalText(this.getNodeParameter('corpid', itemIndex, ''));
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/get_corp_shared_chain_list', corpid ? { corpid } : {});
			} else if (operation === 'getChainRuleList') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/rule/list_ids', {
					chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
				});
			} else if (operation === 'deleteChainRule' || operation === 'getChainRuleDetail') {
				const body = {
					chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
					rule_id: integerInRange(this.getNodeParameter('rule_id', itemIndex), '规则 ID', 1),
				};
				response = await weComApiRequest.call(
					this,
					'POST',
					operation === 'deleteChainRule'
						? '/cgi-bin/corpgroup/rule/delete_rule'
						: '/cgi-bin/corpgroup/rule/get_rule_info',
					body,
				);
			} else if (operation === 'addChainRule' || operation === 'updateChainRule') {
				const body: IDataObject = {
					chain_id: requiredText(this.getNodeParameter('chain_id', itemIndex), '上下游 ID'),
					rule_info: getRuleInfo(),
				};
				if (operation === 'updateChainRule') {
					body.rule_id = integerInRange(this.getNodeParameter('rule_id', itemIndex), '规则 ID', 1);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					operation === 'addChainRule'
						? '/cgi-bin/corpgroup/rule/add_rule'
						: '/cgi-bin/corpgroup/rule/modify_rule',
					body,
				);
			} else if (operation === 'corpGetChainCorpinfo') {
				const body: IDataObject = {
					chain_id: requiredText(this.getNodeParameter('lc_chain_id', itemIndex), '上下游 ID'),
				};
				const type = this.getNodeParameter('lc_corp_type', itemIndex, 'joined') as string;
				if (type === 'joined') body.corpid = requiredText(this.getNodeParameter('lc_corpid', itemIndex), '企业 CorpID');
				else body.pending_corpid = requiredText(this.getNodeParameter('lc_pending_corpid', itemIndex), '待加入企业 CorpID');
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/get_chain_corpinfo', body);
			} else if (operation === 'corpGetChainGroup') {
				const body: IDataObject = {
					chain_id: requiredText(this.getNodeParameter('lc_chain_id', itemIndex), '上下游 ID'),
				};
				const groupid = integerInRange(this.getNodeParameter('lc_groupid', itemIndex, 0), '分组 ID', 0);
				if (groupid > 0) body.groupid = groupid;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/get_chain_group', body);
			} else if (operation === 'unionidToPendingId') {
				const type = this.getNodeParameter('pending_conversion_type', itemIndex, 'unionid') as string;
				if (type === 'unionid') {
					response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/unionid_to_pending_id', {
						unionid: requiredText(this.getNodeParameter('lc_unionid', itemIndex), 'UnionID'),
						openid: requiredText(this.getNodeParameter('lc_openid', itemIndex), 'OpenID'),
					});
				} else {
					const externalUserids = splitList(this.getNodeParameter('lc_external_userids', itemIndex));
					if (!externalUserids.length || externalUserids.length > 100) fail('External UserID 列表必须包含 1～100 个 ID');
					const body: IDataObject = { external_userid: externalUserids };
					const chatId = optionalText(this.getNodeParameter('lc_chat_id', itemIndex, ''));
					if (chatId) body.chat_id = chatId;
					response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/batch/external_userid_to_pending_id', body);
				}
			} else {
				fail(`不支持的企业互联操作：${operation}`);
			}

			returnData.push({ json: response, pairedItem: { item: itemIndex } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: itemIndex },
				});
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
		}
	}

	return returnData;
}
