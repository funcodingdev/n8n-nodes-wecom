import type { IExecuteFunctions, IDataObject, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';
import { weComApiRequest, getWeComBaseUrl } from '../../shared/transport';
import {
	fail,
	optionalText,
	parseJsonArray,
	requireByteText,
	requireCharacterText,
	requireDate,
	requireDepartmentIds,
	requireInteger,
	requireObjectArray,
	requireSchoolContactId,
	requireSchoolUserId,
	requireSchoolUserIdList,
	requireText,
} from './utils';

const STANDARD_GRADES = new Set([
	0, 1, 2, 3, 4, 5, 31, 32, 33, 34, 35, 36, 37, 38, 39, 61, 62, 63, 64, 91, 92, 93,
	94, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132,
]);

const ADMIN_TYPES_BY_DEPARTMENT = new Map<number, number[]>([
	[1, [3, 4]],
	[2, [2]],
	[3, [5]],
	[4, [1]],
]);

const hasOwn = (value: Record<string, unknown>, property: string): boolean =>
	Object.prototype.hasOwnProperty.call(value, property);

function getBatchEntries(
	context: IExecuteFunctions,
	itemIndex: number,
	modeParameter: string,
	collectionParameter: string,
	collectionKey: string,
	jsonParameter: string,
	label: string,
): { entries: Record<string, unknown>[]; inputMode: 'form' | 'json' } {
	const inputMode = String(context.getNodeParameter(modeParameter, itemIndex, 'form'));
	let rawEntries: unknown;
	if (inputMode === 'form') {
		const collection = context.getNodeParameter(collectionParameter, itemIndex, {}) as IDataObject;
		rawEntries = collection[collectionKey];
	} else if (inputMode === 'json') {
		rawEntries = parseJsonArray(
			context,
			context.getNodeParameter(jsonParameter, itemIndex, '[]'),
			label,
			itemIndex,
		);
	} else {
		fail(context, `${label}输入方式不受支持`, itemIndex);
	}
	return {
		entries: requireObjectArray(context, rawEntries, label, itemIndex, 100),
		inputMode,
	};
}

function requireInvitationFlag(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): boolean {
	if (typeof value !== 'boolean') fail(context, `${label}必须是布尔值`, itemIndex);
	return value;
}

function buildChildren(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject[] {
	const normalizedValue =
		value && typeof value === 'object' && !Array.isArray(value)
			? (value as Record<string, unknown>).children
			: value;
	const entries = requireObjectArray(context, normalizedValue, label, itemIndex, 10);
	const seen = new Set<string>();
	return entries.map((entry, index) => {
		const prefix = `${label}第 ${index + 1} 项`;
		const studentUserid = requireSchoolContactId(
			context,
			entry.student_userid,
			`${prefix}的学生 UserID`,
			itemIndex,
		);
		const identity = studentUserid.toLowerCase();
		if (seen.has(identity)) fail(context, `${label}中存在重复学生`, itemIndex);
		seen.add(identity);
		return {
			student_userid: studentUserid,
			relation: requireByteText(context, entry.relation, `${prefix}的关系`, itemIndex, 32),
		};
	});
}

function buildStudentForCreate(
	context: IExecuteFunctions,
	entry: Record<string, unknown>,
	label: string,
	itemIndex: number,
): IDataObject {
	const student: IDataObject = {
		student_userid: requireSchoolUserId(
			context,
			entry.student_userid,
			`${label}的学生 UserID`,
			itemIndex,
		),
		name: requireCharacterText(context, entry.name, `${label}的学生姓名`, itemIndex, 32),
		department: requireDepartmentIds(context, entry.department, `${label}的班级 ID 列表`, itemIndex),
	};
	const mobile = optionalText(context, entry.mobile, `${label}的学生手机号`, itemIndex);
	if (mobile !== undefined) student.mobile = mobile;
	if (hasOwn(entry, 'to_invite')) {
		student.to_invite = requireInvitationFlag(
			context,
			entry.to_invite,
			`${label}的发起邀请`,
			itemIndex,
		);
	}
	return student;
}

function buildStudentForUpdate(
	context: IExecuteFunctions,
	entry: Record<string, unknown>,
	label: string,
	itemIndex: number,
	inputMode: 'form' | 'json',
): IDataObject {
	const student: IDataObject = {
		student_userid: requireSchoolUserId(
			context,
			entry.student_userid,
			`${label}的学生 UserID`,
			itemIndex,
		),
	};
	const shouldInclude = (field: string, flag: string) =>
		inputMode === 'json' ? hasOwn(entry, field) : entry[flag] === true;
	let updateCount = 0;

	if (shouldInclude('new_student_userid', 'update_new_student_userid')) {
		student.new_student_userid = requireSchoolUserId(
			context,
			entry.new_student_userid,
			`${label}的新学生 UserID`,
			itemIndex,
		);
		updateCount++;
	}
	if (shouldInclude('name', 'update_name')) {
		student.name = requireCharacterText(context, entry.name, `${label}的学生姓名`, itemIndex, 32);
		updateCount++;
	}
	if (shouldInclude('department', 'update_department')) {
		student.department = requireDepartmentIds(
			context,
			entry.department,
			`${label}的班级 ID 列表`,
			itemIndex,
		);
		updateCount++;
	}
	if (shouldInclude('mobile', 'update_mobile')) {
		student.mobile = requireText(context, entry.mobile, `${label}的学生手机号`, itemIndex);
		updateCount++;
	}
	if (updateCount === 0) fail(context, `${label}至少需要选择或提供一个更新字段`, itemIndex);
	return student;
}

function buildParentForCreate(
	context: IExecuteFunctions,
	entry: Record<string, unknown>,
	label: string,
	itemIndex: number,
): IDataObject {
	const parent: IDataObject = {
		parent_userid: requireSchoolUserId(
			context,
			entry.parent_userid,
			`${label}的家长 UserID`,
			itemIndex,
		),
		mobile: requireText(context, entry.mobile, `${label}的家长手机号`, itemIndex),
		children: buildChildren(context, entry.children, `${label}的孩子列表`, itemIndex),
	};
	if (hasOwn(entry, 'to_invite')) {
		parent.to_invite = requireInvitationFlag(
			context,
			entry.to_invite,
			`${label}的发起邀请`,
			itemIndex,
		);
	}
	return parent;
}

function buildParentForUpdate(
	context: IExecuteFunctions,
	entry: Record<string, unknown>,
	label: string,
	itemIndex: number,
	inputMode: 'form' | 'json',
): IDataObject {
	const parent: IDataObject = {
		parent_userid: requireSchoolUserId(
			context,
			entry.parent_userid,
			`${label}的家长 UserID`,
			itemIndex,
		),
	};
	const shouldInclude = (field: string, flag: string) =>
		inputMode === 'json' ? hasOwn(entry, field) : entry[flag] === true;
	let updateCount = 0;

	if (shouldInclude('new_parent_userid', 'update_new_parent_userid')) {
		parent.new_parent_userid = requireSchoolUserId(
			context,
			entry.new_parent_userid,
			`${label}的新家长 UserID`,
			itemIndex,
		);
		updateCount++;
	}
	if (shouldInclude('mobile', 'update_mobile')) {
		parent.mobile = requireText(context, entry.mobile, `${label}的家长手机号`, itemIndex);
		updateCount++;
	}
	if (shouldInclude('children', 'update_children')) {
		parent.children = buildChildren(context, entry.children, `${label}的孩子列表`, itemIndex);
		updateCount++;
	}
	if (updateCount === 0) fail(context, `${label}至少需要选择或提供一个更新字段`, itemIndex);
	return parent;
}

function ensureUniqueIds(
	context: IExecuteFunctions,
	entries: IDataObject[],
	property: 'student_userid' | 'parent_userid',
	label: string,
	itemIndex: number,
): void {
	const seen = new Set<string>();
	for (const entry of entries) {
		const identity = String(entry[property]).toLowerCase();
		if (seen.has(identity)) fail(context, `${label}中存在重复 UserID`, itemIndex);
		seen.add(identity);
	}
}

function validateDepartmentName(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	allowEmpty = false,
): string | undefined {
	const name = String(value ?? '').trim();
	if (!name) {
		if (allowEmpty) return undefined;
		fail(context, `${label}不能为空`, itemIndex);
	}
	if (Array.from(name).length > 32) fail(context, `${label}不能超过 32 个字符`, itemIndex);
	for (const character of ['-', ':', '*', '?', '"', '<', '>', '/', '，']) {
		if (name.includes(character)) fail(context, `${label}不能包含字符 ${character}`, itemIndex);
	}
	return name;
}

function requireStandardGrade(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	const grade = requireInteger(context, value, label, itemIndex, 0, 132);
	if (!STANDARD_GRADES.has(grade)) fail(context, `${label}不是官方支持的标准年级代码`, itemIndex);
	return grade;
}

function buildDepartmentAdmins(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	mode: 'create' | 'update',
	departmentType?: number,
): IDataObject[] {
	const collection = value as IDataObject | undefined;
	const rawAdmins = collection?.admins;
	if (rawAdmins === undefined && mode === 'create') return [];
	if (!Array.isArray(rawAdmins) || rawAdmins.length === 0) {
		fail(context, `${label}至少需要 1 项`, itemIndex);
	}

	const seen = new Set<string>();
	return rawAdmins.map((rawAdmin, index) => {
		if (!rawAdmin || typeof rawAdmin !== 'object' || Array.isArray(rawAdmin)) {
			fail(context, `${label}第 ${index + 1} 项必须是对象`, itemIndex);
		}
		const admin = rawAdmin as IDataObject;
		const prefix = `${label}第 ${index + 1} 项`;
		const userid = requireSchoolContactId(context, admin.userid, `${prefix}的成员 UserID`, itemIndex);
		const output: IDataObject = { userid };
		let identity: string;

		if (mode === 'update') {
			const op = requireInteger(context, admin.op, `${prefix}的操作`, itemIndex, 0, 1);
			output.op = op;
			if (op === 1) {
				identity = `${op}\u0000${userid.toLowerCase()}`;
			} else {
				const type = requireInteger(context, admin.type, `${prefix}的管理员类型`, itemIndex, 1, 5);
				output.type = type;
				identity = `${op}\u0000${userid.toLowerCase()}\u0000${type}`;
				const subject = optionalText(context, admin.subject, `${prefix}的科目`, itemIndex, 15);
				if (subject !== undefined) {
					if (![3, 4].includes(type)) {
						fail(context, `${prefix}仅班主任或任课老师可以设置科目`, itemIndex);
					}
					output.subject = subject;
				}
			}
		} else {
			const type = requireInteger(context, admin.type, `${prefix}的管理员类型`, itemIndex, 1, 5);
			if (!ADMIN_TYPES_BY_DEPARTMENT.get(departmentType ?? 0)?.includes(type)) {
				fail(context, `${prefix}的管理员类型与部门类型不匹配`, itemIndex);
			}
			output.type = type;
			identity = `${userid.toLowerCase()}\u0000${type}`;
			const subject = optionalText(context, admin.subject, `${prefix}的科目`, itemIndex, 15);
			if (subject !== undefined) {
				if (![3, 4].includes(type)) {
					fail(context, `${prefix}仅班主任或任课老师可以设置科目`, itemIndex);
				}
				output.subject = subject;
			}
		}
		if (seen.has(identity)) fail(context, `${label}中存在重复管理员配置`, itemIndex);
		seen.add(identity);
		return output;
	});
}

function requireUnixSeconds(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	const text = requireText(context, value, label, itemIndex);
	const milliseconds = Date.parse(text);
	if (!Number.isFinite(milliseconds)) fail(context, `${label}必须是有效的日期时间`, itemIndex);
	const seconds = Math.floor(milliseconds / 1000);
	if (seconds < 0 || seconds > 4294967295) {
		fail(context, `${label}必须在 Unix 秒可表示的范围内`, itemIndex);
	}
	return seconds;
}

export async function executeSchool(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
			case 'getHealthReportStat': {
					const date = requireDate(this, this.getNodeParameter('date', i), '统计日期', i, 30);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_health_report_stat',
						{ date },
					);
					break;
				}
				case 'getHealthReportJobIds': {
					const offset = requireInteger(
						this,
						this.getNodeParameter('offset', i, 0),
						'分页起始位置',
						i,
						0,
						4294967295,
					);
					const limit = requireInteger(
						this,
						this.getNodeParameter('limit', i, 100),
						'返回数量',
						i,
						1,
						100,
					);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_report_jobids',
						{ offset, limit },
					);
					break;
				}
				case 'getHealthReportJobInfo': {
					const jobid = requireText(this, this.getNodeParameter('jobid', i), '任务 ID', i);
					const date = requireDate(this, this.getNodeParameter('date', i), '任务日期', i, 14);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_report_job_info',
						{ jobid, date },
					);
					break;
				}
				case 'getHealthReportAnswer': {
					const jobid = requireText(this, this.getNodeParameter('jobid', i), '任务 ID', i);
					const date = requireDate(this, this.getNodeParameter('date', i), '上报日期', i, 14);
					const offset = requireInteger(
						this,
						this.getNodeParameter('offset', i, 0),
						'分页起始位置',
						i,
						0,
						4294967295,
					);
					const limit = requireInteger(
						this,
						this.getNodeParameter('limit', i, 100),
						'返回数量',
						i,
						1,
						100,
					);

					const body: IDataObject = {
						jobid,
						date,
					};

					body.offset = offset;
					body.limit = limit;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_report_answer',
						body,
					);
					break;
				}
				case 'getUserLivingId': {
					const userid = requireText(this, this.getNodeParameter('userid', i), '老师 UserID', i);
					const cursor = optionalText(
						this,
						this.getNodeParameter('cursor', i, ''),
						'分页游标',
						i,
					);
					const limit = requireInteger(
						this,
						this.getNodeParameter('limit', i, 100),
						'返回数量',
						i,
						1,
						100,
					);

					const body: IDataObject = { userid, limit };
					if (cursor) body.cursor = cursor;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/get_user_all_livingid',
						body,
					);
					break;
				}
				case 'getLivingInfo': {
					const livingid = requireText(this, this.getNodeParameter('livingid', i), '直播 ID', i);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/living/get_living_info',
						{},
						{ livingid },
					);
					break;
				}
				case 'getLivingWatchStat': {
					const livingid = requireText(this, this.getNodeParameter('livingid', i), '直播 ID', i);
					const next_key = optionalText(
						this,
						this.getNodeParameter('next_key', i, ''),
						'分页游标',
						i,
					);

					const body: IDataObject = { livingid };
					if (next_key) {
						body.next_key = next_key;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/living/get_watch_stat',
						body,
					);
					break;
				}
				case 'getLivingUnwatchStat': {
					const livingid = requireText(this, this.getNodeParameter('livingid', i), '直播 ID', i);
					const next_key = optionalText(
						this,
						this.getNodeParameter('next_key', i, ''),
						'分页游标',
						i,
					);

					const body: IDataObject = { livingid };
					if (next_key) {
						body.next_key = next_key;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/living/get_unwatch_stat',
						body,
					);
					break;
				}
				case 'deleteLivingReplayData': {
					const livingid = requireText(this, this.getNodeParameter('livingid', i), '直播 ID', i);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/delete_replay_data',
						{ livingid },
					);
					break;
				}
				case 'getLivingWatchStatV2': {
					const livingid = requireText(this, this.getNodeParameter('livingid', i), '直播 ID', i);
					const next_cursor = optionalText(
						this,
						this.getNodeParameter('next_cursor', i, ''),
						'分页游标',
						i,
					);

					const body: IDataObject = { livingid };
					if (next_cursor) body.next_cursor = next_cursor;

					// V2 官方路径
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/living/get_watch_stat_v2',
						body,
					);
					break;
				}
				case 'getLivingUnwatchStatV2': {
					const livingid = requireText(this, this.getNodeParameter('livingid', i), '直播 ID', i);
					const next_cursor = optionalText(
						this,
						this.getNodeParameter('next_cursor', i, ''),
						'分页游标',
						i,
					);

					const body: IDataObject = { livingid };
					if (next_cursor) body.next_cursor = next_cursor;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/living/get_unwatch_stat_v2',
						body,
					);
					break;
				}
				case 'getTradeResult': {
					const payment_id = requireText(
						this,
						this.getNodeParameter('payment_id', i),
						'收款项目 ID',
						i,
					);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/get_payment_result',
						{ payment_id },
					);
					break;
				}
				case 'getTradeDetail': {
					const payment_id = requireText(
						this,
						this.getNodeParameter('payment_id', i),
						'收款项目 ID',
						i,
					);
					const trade_no = requireText(
						this,
						this.getNodeParameter('trade_no', i),
						'订单号',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/get_trade',
						{ payment_id, trade_no },
					);
					break;
				}
				case 'getAllowScope': {
					const agentid = requireInteger(
						this,
						this.getNodeParameter('agentid', i),
						'应用 AgentID',
						i,
						1,
						4294967295,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/agent/get_allow_scope',
						{},
						{ agentid },
					);
					break;
				}
				case 'getUserInfo3rd': {
					const suiteAccessToken = requireText(
						this,
						this.getNodeParameter('suiteAccessToken', i),
						'Suite Access Token',
						i,
					);
					const code = requireByteText(
						this,
						this.getNodeParameter('code', i),
						'授权 Code',
						i,
						512,
					);
					const options: IHttpRequestOptions = {
						method: 'GET' as const,
						url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/auth/getuserinfo3rd`,
						qs: {
							suite_access_token: suiteAccessToken,
							code,
						},
						json: true,
					};
					responseData = await this.helpers.httpRequest(options);
					if (responseData.errcode !== undefined && responseData.errcode !== 0) {
						fail(
							this,
							`获取第三方访问用户身份失败: ${String(responseData.errmsg ?? '未知错误')} (错误码: ${String(responseData.errcode)})`,
							i,
						);
					}
					break;
				}
				case 'createStudent': {
					const body = buildStudentForCreate(
						this,
						{
							student_userid: this.getNodeParameter('student_userid', i),
							name: this.getNodeParameter('name', i),
							department: this.getNodeParameter('department', i),
							mobile: this.getNodeParameter('mobile', i, ''),
							to_invite: this.getNodeParameter('to_invite', i, true),
						},
						'学生',
						i,
					);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/create_student',
						body,
					);
					break;
				}
				case 'deleteStudent': {
					const userid = requireSchoolContactId(
						this,
						this.getNodeParameter('userid', i),
						'学生 UserID',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/user/delete_student',
						{},
						{ userid },
					);
					break;
				}
				case 'updateStudent': {
					const body = buildStudentForUpdate(
						this,
						{
							student_userid: this.getNodeParameter('student_userid', i),
							update_new_student_userid: this.getNodeParameter(
								'update_new_student_userid',
								i,
								false,
							),
							new_student_userid: this.getNodeParameter('new_student_userid', i, ''),
							update_name: this.getNodeParameter('update_name', i, false),
							name: this.getNodeParameter('name', i, ''),
							update_department: this.getNodeParameter('update_department', i, false),
							department: this.getNodeParameter('department', i, ''),
							update_mobile: this.getNodeParameter('update_mobile', i, false),
							mobile: this.getNodeParameter('mobile', i, ''),
						},
						'学生',
						i,
						'form',
					);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/update_student',
						body,
					);
					break;
				}
				case 'batchCreateStudent': {
					const { entries } = getBatchEntries(
						this,
						i,
						'studentInputMode',
						'studentsCollection',
						'students',
						'studentsJson',
						'学生列表',
					);
					const formattedStudents = entries.map((entry, index) =>
						buildStudentForCreate(this, entry, `学生列表第 ${index + 1} 项`, i),
					);
					ensureUniqueIds(this, formattedStudents, 'student_userid', '学生列表', i);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_create_student',
						{ students: formattedStudents },
					);
					break;
				}
				case 'batchDeleteStudent': {
					const useridlist = requireSchoolUserIdList(
						this,
						this.getNodeParameter('userid_list', i),
						'学生 UserID 列表',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_delete_student',
						{ useridlist },
					);
					break;
				}
				case 'batchUpdateStudent': {
					const { entries, inputMode } = getBatchEntries(
						this,
						i,
						'studentInputMode',
						'studentsCollection',
						'students',
						'studentsJson',
						'学生列表',
					);
					const formattedStudents = entries.map((entry, index) =>
						buildStudentForUpdate(
							this,
							entry,
							`学生列表第 ${index + 1} 项`,
							i,
							inputMode,
						),
					);
					ensureUniqueIds(this, formattedStudents, 'student_userid', '学生列表', i);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_update_student',
						{ students: formattedStudents },
					);
					break;
				}
				case 'createParent': {
					const childrenCollection = this.getNodeParameter('childrenCollection', i, {}) as IDataObject;
					const body = buildParentForCreate(
						this,
						{
							parent_userid: this.getNodeParameter('parent_userid', i),
							mobile: this.getNodeParameter('mobile', i),
							children: childrenCollection.children,
							to_invite: this.getNodeParameter('to_invite', i, true),
						},
						'家长',
						i,
					);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/create_parent',
						body,
					);
					break;
				}
				case 'deleteParent': {
					const userid = requireSchoolContactId(
						this,
						this.getNodeParameter('userid', i),
						'家长 UserID',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/user/delete_parent',
						{},
						{ userid },
					);
					break;
				}
				case 'updateParent': {
					const childrenCollection = this.getNodeParameter('childrenCollection', i, {}) as IDataObject;
					const body = buildParentForUpdate(
						this,
						{
							parent_userid: this.getNodeParameter('parent_userid', i),
							update_new_parent_userid: this.getNodeParameter(
								'update_new_parent_userid',
								i,
								false,
							),
							new_parent_userid: this.getNodeParameter('new_parent_userid', i, ''),
							update_mobile: this.getNodeParameter('update_mobile', i, false),
							mobile: this.getNodeParameter('mobile', i, ''),
							update_children: this.getNodeParameter('update_children', i, false),
							children: childrenCollection.children,
						},
						'家长',
						i,
						'form',
					);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/update_parent',
						body,
					);
					break;
				}
				case 'batchCreateParent': {
					const { entries } = getBatchEntries(
						this,
						i,
						'parentInputMode',
						'parentsCollection',
						'parents',
						'parentsJson',
						'家长列表',
					);
					const formattedParents = entries.map((entry, index) =>
						buildParentForCreate(this, entry, `家长列表第 ${index + 1} 项`, i),
					);
					ensureUniqueIds(this, formattedParents, 'parent_userid', '家长列表', i);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_create_parent',
						{ parents: formattedParents },
					);
					break;
				}
				case 'batchDeleteParent': {
					const useridlist = requireSchoolUserIdList(
						this,
						this.getNodeParameter('userid_list', i),
						'家长 UserID 列表',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_delete_parent',
						{ useridlist },
					);
					break;
				}
				case 'batchUpdateParent': {
					const { entries, inputMode } = getBatchEntries(
						this,
						i,
						'parentInputMode',
						'parentsCollection',
						'parents',
						'parentsJson',
						'家长列表',
					);
					const formattedParents = entries.map((entry, index) =>
						buildParentForUpdate(
							this,
							entry,
							`家长列表第 ${index + 1} 项`,
							i,
							inputMode,
						),
					);
					ensureUniqueIds(this, formattedParents, 'parent_userid', '家长列表', i);

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_update_parent',
						{ parents: formattedParents },
					);
					break;
				}
				case 'getSchoolUser': {
					const userid = requireSchoolContactId(
						this,
						this.getNodeParameter('userid', i),
						'UserID',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/user/get',
						{},
						{ userid },
					);
					break;
				}
				case 'departmentCreate': {
					const departmentType = requireInteger(
						this,
						this.getNodeParameter('school_department_type', i, 1),
						'部门类型',
						i,
						1,
						4,
					);
					const includeStandardGrade =
						this.getNodeParameter('include_standard_grade', i, false) === true;
					if (includeStandardGrade && departmentType !== 2) {
						fail(this, '只有年级部门可以设置标准年级', i);
					}
					const body: IDataObject = {
						parentid: requireInteger(
							this,
							this.getNodeParameter('school_parentid', i),
							'父部门 ID',
							i,
							1,
							4294967295,
						),
						type: departmentType,
					};
					const name = validateDepartmentName(
						this,
						this.getNodeParameter('school_department_name', i, ''),
						'部门名称',
						i,
						includeStandardGrade,
					);
					if (name !== undefined) body.name = name;
					if (this.getNodeParameter('specify_department_id', i, false) === true) {
						body.id = requireInteger(
							this,
							this.getNodeParameter('school_department_id', i),
							'部门 ID',
							i,
							2,
							4294967295,
						);
					}
					if (includeStandardGrade) {
						body.standard_grade = requireStandardGrade(
							this,
							this.getNodeParameter('standard_grade', i),
							'标准年级',
							i,
						);
					}
					if (this.getNodeParameter('include_register_year', i, false) === true) {
						if (departmentType !== 2) fail(this, '只有年级部门可以设置入学年份', i);
						body.register_year = requireInteger(
							this,
							this.getNodeParameter('register_year', i),
							'入学年份',
							i,
							1970,
							2100,
						);
					}
					if (this.getNodeParameter('include_department_order', i, false) === true) {
						body.order = requireInteger(
							this,
							this.getNodeParameter('school_department_order', i),
							'排序次序',
							i,
							0,
							4294967295,
						);
					}
					const admins = buildDepartmentAdmins(
						this,
						this.getNodeParameter('departmentAdminsCollection', i, {}),
						'部门管理员',
						i,
						'create',
						departmentType,
					);
					if (admins.length > 0) body.department_admins = admins;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/department/create',
						body,
					);
					break;
				}
				case 'departmentDelete': {
					const id = requireInteger(
						this,
						this.getNodeParameter('school_department_id', i),
						'部门 ID',
						i,
						1,
						4294967295,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/department/delete',
						{},
						{ id },
					);
					break;
				}
				case 'departmentList': {
					const query: IDataObject = {};
					if (this.getNodeParameter('filter_department', i, false) === true) {
						query.id = requireInteger(
							this,
							this.getNodeParameter('school_department_id', i),
							'部门 ID',
							i,
							1,
							4294967295,
						);
					}
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/department/list',
						{},
						query,
					);
					break;
				}
				case 'departmentUpdate': {
					const body: IDataObject = {
						id: requireInteger(
							this,
							this.getNodeParameter('school_department_id', i),
							'部门 ID',
							i,
							1,
							4294967295,
						),
					};
					let updateCount = 0;
					if (this.getNodeParameter('update_department_name', i, false) === true) {
						body.name = validateDepartmentName(
							this,
							this.getNodeParameter('school_department_name', i),
							'部门名称',
							i,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_department_parent', i, false) === true) {
						body.parentid = requireInteger(
							this,
							this.getNodeParameter('school_parentid', i),
							'父部门 ID',
							i,
							1,
							4294967295,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_department_id', i, false) === true) {
						body.new_id = requireInteger(
							this,
							this.getNodeParameter('school_new_id', i),
							'新部门 ID',
							i,
							1,
							4294967295,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_register_year', i, false) === true) {
						body.register_year = requireInteger(
							this,
							this.getNodeParameter('register_year', i),
							'入学年份',
							i,
							1970,
							2100,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_standard_grade', i, false) === true) {
						body.standard_grade = requireStandardGrade(
							this,
							this.getNodeParameter('standard_grade', i),
							'标准年级',
							i,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_department_order', i, false) === true) {
						body.order = requireInteger(
							this,
							this.getNodeParameter('school_department_order', i),
							'排序次序',
							i,
							0,
							4294967295,
						);
						updateCount++;
					}
					if (this.getNodeParameter('update_department_admins', i, false) === true) {
						body.department_admins = buildDepartmentAdmins(
							this,
							this.getNodeParameter('departmentAdminsCollection', i, {}),
							'部门管理员变更',
							i,
							'update',
						);
						updateCount++;
					}
					if (updateCount === 0) fail(this, '至少需要选择一个部门更新字段', i);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/department/update',
						body,
					);
					break;
				}
				case 'getChatCreateMode': {
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/get_chat_create_mode',
					);
					break;
				}
				case 'getuserinfo': {
					const code = requireByteText(
						this,
						this.getNodeParameter('school_code', i),
						'OAuth Code',
						i,
						512,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/getuserinfo',
						{},
						{ code },
					);
					break;
				}
				case 'livingGetLivingInfo': {
					const livingid = requireText(
						this,
						this.getNodeParameter('school_livingid', i),
						'直播 ID',
						i,
					);
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/living/get_living_info',
						{},
						{ livingid },
					);
					break;
				}
				case 'livingGetUnwatchStat':
				case 'livingGetWatchStat': {
					const body: IDataObject = {
						livingid: requireText(
							this,
							this.getNodeParameter('school_livingid', i),
							'直播 ID',
							i,
						),
					};
					const nextKey = optionalText(
						this,
						this.getNodeParameter('school_next_key', i, ''),
						'分页 Next Key',
						i,
					);
					if (nextKey !== undefined) body.next_key = nextKey;
					const statistic = operation === 'livingGetWatchStat' ? 'watch' : 'unwatch';
					responseData = await weComApiRequest.call(
						this,
						'POST',
						`/cgi-bin/school/living/get_${statistic}_stat`,
						body,
					);
					break;
				}
				case 'setArchSyncMode': {
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/set_arch_sync_mode',
						{
							arch_sync_mode: requireInteger(
								this,
								this.getNodeParameter('arch_sync_mode', i),
								'通讯录同步模式',
								i,
								1,
								3,
							),
						},
					);
					break;
				}
				case 'setChatCreateMode': {
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/set_chat_create_mode',
						{
							create_mode: requireInteger(
								this,
								this.getNodeParameter('create_mode', i),
								'班级群创建方式',
								i,
								0,
								1,
							),
						},
					);
					break;
				}
				case 'setUpgradeInfo': {
					const body: IDataObject = {};
					if (this.getNodeParameter('set_upgrade_time', i, false) === true) {
						body.upgrade_time = requireUnixSeconds(
							this,
							this.getNodeParameter('upgrade_time', i),
							'自动升年级日期',
							i,
						);
					}
					if (this.getNodeParameter('set_upgrade_switch', i, false) === true) {
						body.upgrade_switch = requireInteger(
							this,
							this.getNodeParameter('upgrade_switch', i),
							'自动升年级开关',
							i,
							0,
							1,
						);
					}
					if (Object.keys(body).length === 0) fail(this, '至少需要设置升年级日期或开关', i);
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/set_upgrade_info',
						body,
					);
					break;
				}
				case 'userList':
				case 'userListParent': {
					const departmentId = requireInteger(
						this,
						this.getNodeParameter('school_department_id', i),
						'部门 ID',
						i,
						1,
						4294967295,
					);
					const path =
						operation === 'userList'
							? '/cgi-bin/school/user/list'
							: '/cgi-bin/school/user/list_parent';
					responseData = await weComApiRequest.call(
						this,
						'GET',
						path,
						{},
						{ department_id: departmentId },
					);
					break;
				}
				default:
					fail(this, `不支持的家校操作: ${operation}`, i);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
