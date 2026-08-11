import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { wedocDescription } from '../WeCom/resources/wedoc';
import { wefileDescription } from '../WeCom/resources/wefile';
import { mailDescription } from '../WeCom/resources/mail';
import { calendarDescription } from '../WeCom/resources/calendar';
import { meetingDescription } from '../WeCom/resources/meeting';
import { liveDescription } from '../WeCom/resources/live';
import { checkinDescription } from '../WeCom/resources/checkin';
import { approvalDescription } from '../WeCom/resources/approval';
import { journalDescription } from '../WeCom/resources/journal';
import { hrDescription } from '../WeCom/resources/hr';
import { meetingroomDescription } from '../WeCom/resources/meetingroom';
import { emergencyDescription } from '../WeCom/resources/emergency';
import { phoneDescription } from '../WeCom/resources/phone';
import { executeWedoc } from '../WeCom/resources/wedoc/execute';
import { executeWefile } from '../WeCom/resources/wefile/execute';
import { executeMail } from '../WeCom/resources/mail/execute';
import { executeCalendar } from '../WeCom/resources/calendar/execute';
import { executeMeeting } from '../WeCom/resources/meeting/execute';
import { executeLive } from '../WeCom/resources/live/execute';
import { executeCheckin } from '../WeCom/resources/checkin/execute';
import { executeApproval } from '../WeCom/resources/approval/execute';
import { executeJournal } from '../WeCom/resources/journal/execute';
import { executeHr } from '../WeCom/resources/hr/execute';
import { executeMeetingroom } from '../WeCom/resources/meetingroom/execute';
import { executeEmergency } from '../WeCom/resources/emergency/execute';
import { executePhone } from '../WeCom/resources/phone/execute';
import { weComApiRequest } from '../WeCom/shared/transport';

export class WeComOffice implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信-办公 (WeCom)',
		name: 'weComOffice',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '企业微信办公功能 - 文档、微盘、邮件、日程、会议、直播、打卡、审批、汇报、人事、会议室、紧急通知、公费电话',
		defaults: {
			name: '企业微信-办公',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://qyapi.weixin.qq.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: '资源',
				name: 'resource',
				type: 'options',
				noDataExpression: true,

				options: [
					{
						name: '文档',
						value: 'wedoc',
						description: '管理企业微信文档（在线文档、表格、智能表格）',
					},
					{
						name: '微盘',
						value: 'wefile',
						description:
							'企业微信微盘（官方 API 前缀 /cgi-bin/wedrive/*）。资源 value 为 wefile，与直播 live 区分',
					},
					{
						name: '邮件',
						value: 'mail',
						description: '管理企业邮箱（发送邮件、邮件群组、公共邮箱等）',
					},
					{
						name: '会议',
						value: 'meeting',
						description: '管理企业微信会议（预约会议、会议控制、录制管理等）',
					},
					{
						name: '直播',
						value: 'live',
						description: '管理企业微信直播（创建、修改、观看、统计等）',
					},
					{
						name: '日程',
						value: 'calendar',
						description: '管理日历和日程（创建日历、创建日程、管理参与者等）',
					},
					{
						name: '打卡',
						value: 'checkin',
						description: '管理打卡规则、打卡记录、排班等',
					},
					{
						name: '审批',
						value: 'approval',
						description: '管理审批模板、审批申请、假期管理等',
					},
					{
						name: '汇报',
						value: 'journal',
						description: '管理汇报记录、汇报统计等',
					},
					{
						name: '人事助手',
						value: 'hr',
						description: '管理员工花名册信息',
					},
					{
						name: '会议室',
						value: 'meetingroom',
						description: '管理会议室和会议室预定',
					},
					{
						name: '紧急通知',
						value: 'emergency',
						description: '发起语音电话等紧急通知',
					},
					{
						name: '公费电话',
						value: 'phone',
						description: '获取公费电话拨打记录',
					},
				],
				default: 'wedoc',
			},
			...calendarDescription,
			...meetingDescription,
			...liveDescription,
			...wedocDescription,
			...wefileDescription,
			...mailDescription,
			...checkinDescription,
			...approvalDescription,
			...journalDescription,
			...hrDescription,
			...meetingroomDescription,
			...emergencyDescription,
			...phoneDescription,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			// 获取部门列表
			async getDepartments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/list', {});
				const departments = response.department as Array<{ id: number; name: string }>;
				return departments.map((dept) => ({
					name: `${dept.name} (${dept.id})`,
					value: dept.id.toString(),
				}));
			},

			// 获取所有成员列表（从根部门递归获取）
			async getAllUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/list',
					{},
					{
						department_id: '1',
						fetch_child: 1,
					},
				);
				const users = response.userlist as Array<{
					userid: string;
					name: string;
					department?: number[];
				}>;
				return users.map((user) => ({
					name: `${user.name} (${user.userid})`,
					value: user.userid,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let returnData: INodeExecutionData[] = [];

		if (resource === 'wedoc') {
			returnData = await executeWedoc.call(this, operation as string, items);
		} else if (resource === 'wefile') {
			returnData = await executeWefile.call(this, operation as string, items);
		} else if (resource === 'mail') {
			returnData = await executeMail.call(this, operation as string, items);
		} else if (resource === 'calendar') {
			returnData = await executeCalendar.call(this, operation as string, items);
		} else if (resource === 'meeting') {
			returnData = await executeMeeting.call(this, operation as string, items);
		} else if (resource === 'live') {
			returnData = await executeLive.call(this, operation as string, items);
		} else if (resource === 'checkin') {
			returnData = await executeCheckin.call(this, operation as string, items);
		} else if (resource === 'approval') {
			returnData = await executeApproval.call(this, operation as string, items);
		} else if (resource === 'journal') {
			returnData = await executeJournal.call(this, operation as string, items);
		} else if (resource === 'hr') {
			returnData = await executeHr.call(this, operation as string, items);
		} else if (resource === 'meetingroom') {
			returnData = await executeMeetingroom.call(this, operation as string, items);
		} else if (resource === 'emergency') {
			returnData = await executeEmergency.call(this, operation as string, items);
		} else if (resource === 'phone') {
			returnData = await executePhone.call(this, operation as string, items);
		}

		return [returnData];
	}
}
