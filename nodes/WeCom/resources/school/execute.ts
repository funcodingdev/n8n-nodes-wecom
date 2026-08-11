import type { IExecuteFunctions, IDataObject, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';
import { weComApiRequest, getWeComBaseUrl } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { schoolExtraHttpOpsById } from './extraHttpOps';

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
					const date = this.getNodeParameter('date', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_health_report_stat',
						{ date },
					);
					break;
				}
				case 'getHealthReportJobIds': {
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const body: IDataObject = {};
					if (offset) {
						body.offset = offset;
					}
					if (limit) {
						body.limit = limit;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_report_jobids',
						body,
					);
					break;
				}
				case 'getHealthReportJobInfo': {
					const jobid = this.getNodeParameter('jobid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_report_job_info',
						{ jobid },
					);
					break;
				}
				case 'getHealthReportAnswer': {
					const jobid = this.getNodeParameter('jobid', i) as string;
					const date = this.getNodeParameter('date', i) as string;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const body: IDataObject = {
						jobid,
						date,
					};

					if (offset) {
						body.offset = offset;
					}
					if (limit) {
						body.limit = limit;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/health/get_report_answer',
						body,
					);
					break;
				}
				case 'getUserLivingId': {
					const userid = this.getNodeParameter('userid', i) as string;
					const begin_time = this.getNodeParameter('begin_time', i, 0) as number;
					const end_time = this.getNodeParameter('end_time', i, 0) as number;
					const next_key = this.getNodeParameter('next_key', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const body: IDataObject = { userid };
					if (begin_time) {
						body.begin_time = begin_time;
					}
					if (end_time) {
						body.end_time = end_time;
					}
					if (next_key) {
						body.next_key = next_key;
					}
					if (limit) {
						body.limit = limit;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/get_user_livingid',
						body,
					);
					break;
				}
				case 'getLivingInfo': {
					const livingid = this.getNodeParameter('livingid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/get_living_info',
						{ livingid },
					);
					break;
				}
				case 'getLivingWatchStat': {
					const livingid = this.getNodeParameter('livingid', i) as string;
					const next_key = this.getNodeParameter('next_key', i, '') as string;

					const body: IDataObject = { livingid };
					if (next_key) {
						body.next_key = next_key;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/get_watch_stat',
						body,
					);
					break;
				}
				case 'getLivingUnwatchStat': {
					const livingid = this.getNodeParameter('livingid', i) as string;
					const next_key = this.getNodeParameter('next_key', i, '') as string;

					const body: IDataObject = { livingid };
					if (next_key) {
						body.next_key = next_key;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/get_unwatch_stat',
						body,
					);
					break;
				}
				case 'deleteLivingReplayData': {
					const livingid = this.getNodeParameter('livingid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/living/delete_replay_data',
						{ livingid },
					);
					break;
				}
				case 'getLivingWatchStatV2': {
					const livingid = this.getNodeParameter('livingid', i) as string;
					const next_key = this.getNodeParameter('next_key', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const body: IDataObject = { livingid };
					if (next_key) {
						body.next_key = next_key;
					}
					if (limit) {
						body.limit = limit;
					}

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
					const livingid = this.getNodeParameter('livingid', i) as string;
					const next_key = this.getNodeParameter('next_key', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const body: IDataObject = { livingid };
					if (next_key) {
						body.next_key = next_key;
					}
					if (limit) {
						body.limit = limit;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/living/get_unwatch_stat_v2',
						body,
					);
					break;
				}
				case 'getTradeResult': {
					// 官方：/cgi-bin/school/get_payment_result
					const payment_id = this.getNodeParameter('payment_id', i) as string;
					const next_key = this.getNodeParameter('next_key', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const body: IDataObject = { payment_id };
					if (next_key) {
						body.next_key = next_key;
					}
					if (limit) {
						body.limit = limit;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/get_payment_result',
						body,
					);
					break;
				}
				case 'getTradeDetail': {
					// 官方：/cgi-bin/school/get_trade
					const payment_id = this.getNodeParameter('payment_id', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/get_trade',
						{ payment_id },
					);
					break;
				}
				case 'getAllowScope': {
					const agentid = this.getNodeParameter('agentid', i) as number;
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
					const suiteAccessToken = this.getNodeParameter('suiteAccessToken', i) as string;
					const code = this.getNodeParameter('code', i) as string;
					const options: IHttpRequestOptions = {
						method: 'GET' as const,
						url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/school/getuserinfo3rd`,
						qs: {
							suite_access_token: suiteAccessToken,
							code,
						},
						json: true,
					};
					responseData = await this.helpers.httpRequest(options);
					break;
				}
				case 'createStudent': {
					const student_userid = this.getNodeParameter('student_userid', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const department = this.getNodeParameter('department', i) as string;
					const mobile = this.getNodeParameter('mobile', i, '') as string;
					const to_invite = this.getNodeParameter('to_invite', i, true) as boolean;

					const body: IDataObject = {
						student_userid,
						name,
						department: department.split(',').map((id) => parseInt(id.trim(), 10)),
					};
					if (mobile) body.mobile = mobile;
					if (to_invite !== undefined) body.to_invite = to_invite;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/create_student',
						body,
					);
					break;
				}
				case 'deleteStudent': {
					const userid = this.getNodeParameter('userid', i) as string;
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
					const student_userid = this.getNodeParameter('student_userid', i) as string;
					const name = this.getNodeParameter('name', i, '') as string;
					const department = this.getNodeParameter('department', i, '') as string;
					const mobile = this.getNodeParameter('mobile', i, '') as string;
					const new_student_userid = this.getNodeParameter('new_student_userid', i, '') as string;

					const body: IDataObject = { student_userid };
					if (name) body.name = name;
					if (department) body.department = department.split(',').map((id) => parseInt(id.trim(), 10));
					if (mobile) body.mobile = mobile;
					if (new_student_userid) body.new_student_userid = new_student_userid;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/update_student',
						body,
					);
					break;
				}
				case 'batchCreateStudent': {
					const studentsCollection = this.getNodeParameter('studentsCollection', i, {}) as IDataObject;
					const students = studentsCollection.students as IDataObject[] | undefined;

					if (!students || students.length === 0) {
						throw new Error('学生列表不能为空');
					}

					const formattedStudents = students.map((s) => {
						const student: IDataObject = {
							student_userid: s.student_userid,
							name: s.name,
							department: (s.department as string).split(',').map((id) => parseInt(id.trim(), 10)),
						};
						if (s.mobile) student.mobile = s.mobile;
						if (s.to_invite !== undefined) student.to_invite = s.to_invite;
						return student;
					});

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_create_student',
						{ students: formattedStudents },
					);
					break;
				}
				case 'batchDeleteStudent': {
					const userid_list = this.getNodeParameter('userid_list', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_delete_student',
						{ userid_list: userid_list.split(',').map((id) => id.trim()) },
					);
					break;
				}
				case 'batchUpdateStudent': {
					const studentsCollection = this.getNodeParameter('studentsCollection', i, {}) as IDataObject;
					const students = studentsCollection.students as IDataObject[] | undefined;

					if (!students || students.length === 0) {
						throw new Error('学生列表不能为空');
					}

					const formattedStudents = students.map((s) => {
						const student: IDataObject = {
							student_userid: s.student_userid,
						};
						if (s.name) student.name = s.name;
						if (s.department) student.department = (s.department as string).split(',').map((id) => parseInt(id.trim(), 10));
						if (s.mobile) student.mobile = s.mobile;
						if (s.new_student_userid) student.new_student_userid = s.new_student_userid;
						return student;
					});

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_update_student',
						{ students: formattedStudents },
					);
					break;
				}
				case 'createParent': {
					const parent_userid = this.getNodeParameter('parent_userid', i) as string;
					const mobile = this.getNodeParameter('mobile', i) as string;
					const childrenCollection = this.getNodeParameter('childrenCollection', i, {}) as IDataObject;
					const children = childrenCollection.children as IDataObject[] | undefined;
					const to_invite = this.getNodeParameter('to_invite', i, true) as boolean;

					if (!children || children.length === 0) {
						throw new Error('孩子列表不能为空');
					}

					const body: IDataObject = {
						parent_userid,
						mobile,
						children: children.map((c) => ({
							student_userid: c.student_userid,
							relation: c.relation,
						})),
					};
					if (to_invite !== undefined) body.to_invite = to_invite;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/create_parent',
						body,
					);
					break;
				}
				case 'deleteParent': {
					const userid = this.getNodeParameter('userid', i) as string;
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
					const parent_userid = this.getNodeParameter('parent_userid', i) as string;
					const mobile = this.getNodeParameter('mobile', i, '') as string;
					const new_parent_userid = this.getNodeParameter('new_parent_userid', i, '') as string;
					const childrenCollection = this.getNodeParameter('childrenCollection', i, {}) as IDataObject;
					const children = childrenCollection.children as IDataObject[] | undefined;

					const body: IDataObject = { parent_userid };
					if (mobile) body.mobile = mobile;
					if (new_parent_userid) body.new_parent_userid = new_parent_userid;
					if (children && children.length > 0) {
						body.children = children.map((c) => ({
							student_userid: c.student_userid,
							relation: c.relation,
						}));
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/update_parent',
						body,
					);
					break;
				}
				case 'batchCreateParent': {
					const parentsCollection = this.getNodeParameter('parentsCollection', i, {}) as IDataObject;
					const parents = parentsCollection.parents as IDataObject[] | undefined;

					if (!parents || parents.length === 0) {
						throw new Error('家长列表不能为空');
					}

					const parseChildren = (p: IDataObject): IDataObject[] => {
						let childrenRaw = p.children as IDataObject[] | string | undefined;
						if (typeof childrenRaw === 'string') {
							try {
								childrenRaw = JSON.parse(childrenRaw || '[]') as IDataObject[];
							} catch {
								childrenRaw = [];
							}
						}
						let childrenList = (childrenRaw || []) as IDataObject[];
						if (!childrenList.length && p.children_pairs) {
							childrenList = String(p.children_pairs)
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
								.map((pair) => {
									const [student_userid, relation] = pair.split(':').map((x) => x.trim());
									return { student_userid, relation: relation || '家长' };
								})
								.filter((c) => c.student_userid);
						}
						return childrenList.map((c) => ({
							student_userid: c.student_userid,
							relation: c.relation,
						}));
					};

					const formattedParents = parents.map((p) => {
						const parent: IDataObject = {
							parent_userid: p.parent_userid,
							mobile: p.mobile,
							children: parseChildren(p),
						};
						if (p.to_invite !== undefined) parent.to_invite = p.to_invite;
						return parent;
					});

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_create_parent',
						{ parents: formattedParents },
					);
					break;
				}
				case 'batchDeleteParent': {
					const userid_list = this.getNodeParameter('userid_list', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_delete_parent',
						{ userid_list: userid_list.split(',').map((id) => id.trim()) },
					);
					break;
				}
				case 'batchUpdateParent': {
					const parentsCollection = this.getNodeParameter('parentsCollection', i, {}) as IDataObject;
					const parents = parentsCollection.parents as IDataObject[] | undefined;

					if (!parents || parents.length === 0) {
						throw new Error('家长列表不能为空');
					}

					const formattedParents = parents.map((p) => {
						const parent: IDataObject = {
							parent_userid: p.parent_userid,
						};
						if (p.mobile) parent.mobile = p.mobile;
						if (p.new_parent_userid) parent.new_parent_userid = p.new_parent_userid;
						let childrenList: IDataObject[] = [];
						if (p.children) {
							let childrenRaw = p.children as IDataObject[] | string;
							if (typeof childrenRaw === 'string') {
								try {
									childrenRaw = JSON.parse(childrenRaw || '[]') as IDataObject[];
								} catch {
									childrenRaw = [];
								}
							}
							childrenList = childrenRaw as IDataObject[];
						}
						if (!childrenList.length && p.children_pairs) {
							childrenList = String(p.children_pairs)
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
								.map((pair) => {
									const [student_userid, relation] = pair.split(':').map((x) => x.trim());
									return { student_userid, relation: relation || '家长' };
								})
								.filter((c) => c.student_userid);
						}
						if (childrenList.length) {
							parent.children = childrenList.map((c) => ({
								student_userid: c.student_userid,
								relation: c.relation,
							}));
						}
						return parent;
					});

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/school/user/batch_update_parent',
						{ parents: formattedParents },
					);
					break;
				}
				case 'getSchoolUser': {
					const userid = this.getNodeParameter('userid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/school/user/get',
						{},
						{ userid },
					);
					break;
				}
				default: {
					if (schoolExtraHttpOpsById[operation]) {
						const bodyDefaults: IDataObject = {};
						const qsDefaults: IDataObject = {};
						const school_department_id = this.getNodeParameter('school_department_id', i, 0) as number;
						const school_department_name = this.getNodeParameter('school_department_name', i, '') as string;
						const school_parentid = this.getNodeParameter('school_parentid', i, 0) as number;
						const school_department_type = this.getNodeParameter('school_department_type', i, 1) as number;
						const school_code = this.getNodeParameter('school_code', i, '') as string;
						const school_livingid = this.getNodeParameter('school_livingid', i, '') as string;
						const arch_sync_mode = this.getNodeParameter('arch_sync_mode', i, 1) as number;
						const create_mode = this.getNodeParameter('create_mode', i, 0) as number;
						const school_next_key = this.getNodeParameter('school_next_key', i, '') as string;
						const upgrade_time = this.getNodeParameter('upgrade_time', i, 0) as number;
						const upgrade_switch = this.getNodeParameter('upgrade_switch', i, 0) as number;
						const school_new_id = this.getNodeParameter('school_new_id', i, 0) as number;
						const register_year = this.getNodeParameter('register_year', i, 0) as number;
						const standard_grade = this.getNodeParameter('standard_grade', i, 0) as number;
						const school_department_order = this.getNodeParameter('school_department_order', i, 0) as number;
						if (operation === 'departmentUpdate' && school_department_id) {
							bodyDefaults.id = school_department_id;
						}
						if (operation === 'departmentDelete' && school_department_id) {
							qsDefaults.id = school_department_id;
						}
						if (operation === 'departmentCreate') {
							if (school_department_id) bodyDefaults.id = school_department_id;
							bodyDefaults.type = school_department_type;
							if (school_parentid) bodyDefaults.parentid = school_parentid;
						}
						if (school_department_name) bodyDefaults.name = school_department_name;
						if (operation === 'departmentUpdate' && school_parentid) {
							bodyDefaults.parentid = school_parentid;
						}
						if (operation === 'departmentUpdate' && school_new_id) {
							bodyDefaults.new_id = school_new_id;
						}
						if (register_year) bodyDefaults.register_year = register_year;
						// create：仅 >0 时写入；update：始终写入（0 表示转非标准年级）
						if (operation === 'departmentUpdate') {
							bodyDefaults.standard_grade = standard_grade;
						} else if (standard_grade > 0) {
							bodyDefaults.standard_grade = standard_grade;
						}
						if (school_department_order) bodyDefaults.order = school_department_order;
						if (['departmentCreate', 'departmentUpdate'].includes(operation)) {
							const adminsCollection = this.getNodeParameter(
								'departmentAdminsCollection',
								i,
								{},
							) as IDataObject;
							const admins = ((adminsCollection?.admins as IDataObject[]) || [])
								.filter((a) => a.userid)
								.map((a) => {
									const item: IDataObject = {
										userid: a.userid,
										type: a.type,
									};
									if (a.subject) item.subject = a.subject;
									if (operation === 'departmentUpdate') item.op = a.op ?? 0;
									return item;
								});
							if (admins.length) bodyDefaults.department_admins = admins;
						}
						if (school_livingid) bodyDefaults.livingid = school_livingid;
						if (school_next_key) bodyDefaults.next_key = school_next_key;
						if (operation === 'setArchSyncMode') {
							bodyDefaults.arch_sync_mode = arch_sync_mode;
						}
						if (operation === 'setChatCreateMode') {
							bodyDefaults.create_mode = create_mode;
						}
						if (operation === 'setUpgradeInfo') {
							bodyDefaults.upgrade_time = upgrade_time || 0;
							bodyDefaults.upgrade_switch = upgrade_switch;
						}
						// GET query fields
						if (operation === 'getuserinfo' && school_code) qsDefaults.code = school_code;
						if (operation === 'departmentList' && school_department_id) {
							qsDefaults.id = school_department_id;
						}
						if (['userList', 'userListParent'].includes(operation) && school_department_id) {
							qsDefaults.department_id = school_department_id;
						}
						responseData = await executeExtraHttpOp.call(
							this,
							schoolExtraHttpOpsById[operation],
							i,
							bodyDefaults,
							qsDefaults,
						);
						break;
					}
					throw new Error(`未知操作: ${operation}`);
				}
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
