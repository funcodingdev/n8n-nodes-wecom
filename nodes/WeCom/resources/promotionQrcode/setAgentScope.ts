import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import {
	parseIdList,
	parseTextList,
	parseUserIdJsonList,
	requirePositiveInteger,
	requireText,
} from './utils';

/**
 * 设置授权应用可见范围
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90583
 *
 * 用途：
 * - 设置授权应用的可见范围（成员、部门、标签）
 *
 * 注意事项：
 * - 调用该接口前提是开启通讯录迁移，收到授权成功通知后可调用
 * - 企业注册初始化安装应用后，应用默认可见范围为根部门
 * - 该接口只能使用注册完成回调事件或者查询注册状态返回的access_token
 * - 调用设置通讯录同步完成后或者access_token超过30分钟失效（即解除通讯录锁定状态）则不能继续调用该接口
 * - 若未填某个字段，则清空可见范围中对应的列表
 *
 * @returns 设置结果（包含无效的成员、部门、标签列表）
 */
export async function setAgentScope(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const accessToken = requireText(
		this,
		this.getNodeParameter('accessToken', index),
		'Access Token',
		index,
		2048,
	);
	const agentid = requirePositiveInteger(
		this,
		(this.getNodeParameter('agentid', index, 0) || this.getNodeParameter('agentid_selected', index, '')),
		'授权方应用 ID',
		index,
	);
	const allowUser = parseTextList(
		this,
		[
			this.getNodeParameter('allowUser', index, ''),
			this.getNodeParameter('allowUser_selected', index, []),
			...parseUserIdJsonList(
				this,
				this.getNodeParameter('allowUserJson', index, '[]'),
				'成员列表 JSON',
				index,
			),
		],
		'成员列表',
		index,
	);
	const allowParty = parseIdList(
		this,
		[
			this.getNodeParameter('allowParty', index, ''),
			this.getNodeParameter('allowParty_selected', index, []),
			...parseUserIdJsonList(
				this,
				this.getNodeParameter('allowPartyJson', index, '[]'),
				'部门列表 JSON',
				index,
			),
		],
		'部门 ID 列表',
		index,
	);
	const allowTag = parseIdList(
		this,
		[
			this.getNodeParameter('allowTag', index, ''),
			this.getNodeParameter('allowTag_selected', index, []),
			...parseUserIdJsonList(
				this,
				this.getNodeParameter('allowTagJson', index, '[]'),
				'标签列表 JSON',
				index,
			),
		],
		'标签 ID 列表',
		index,
	);

	const body: IDataObject = {
		agentid,
	};


	if (allowUser.length) body.allow_user = allowUser;
	if (allowParty.length) body.allow_party = allowParty;
	if (allowTag.length) body.allow_tag = allowTag;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/agent/set_scope`,
		qs: {
			access_token: accessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`设置授权应用可见范围失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`设置授权应用可见范围失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
