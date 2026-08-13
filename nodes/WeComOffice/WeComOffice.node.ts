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
		displayName: '企业微信(WeCom)-办公',
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
						description: '文档管理（在线文档、表格、智能表格等）',
					},
					{
						name: '微盘',
						value: 'wefile',
						description: '微盘管理（空间、文件上传下载、权限与分享等）',
					},
					{
						name: '邮件',
						value: 'mail',
						description: '邮件管理（发信、邮件群组、公共邮箱等）',
					},
					{
						name: '会议',
						value: 'meeting',
						description: '会议管理（预约会议、会中控制、录制等）',
					},
					{
						name: '直播',
						value: 'live',
						description: '直播管理（创建直播、修改、观看统计等）',
					},
					{
						name: '日程',
						value: 'calendar',
						description: '日程管理（日历、日程、参与者等）',
					},
					{
						name: '打卡',
						value: 'checkin',
						description: '打卡管理（规则、记录、排班等）',
					},
					{
						name: '审批',
						value: 'approval',
						description: '审批管理（模板、申请、假期等）',
					},
					{
						name: '汇报',
						value: 'journal',
						description: '汇报管理（记录、统计、附件等）',
					},
					{
						name: '人事助手',
						value: 'hr',
						description: '人事助手管理（员工花名册等）',
					},
					{
						name: '会议室',
						value: 'meetingroom',
						description: '会议室管理（会议室信息、预定等）',
					},
					{
						name: '紧急通知',
						value: 'emergency',
						description: '紧急通知管理（语音呼叫、接听状态等）',
					},
					{
						name: '公费电话',
						value: 'phone',
						description: '公费电话管理（拨打记录等）',
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

			// 获取企业应用列表
			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(this, 'GET', '/cgi-bin/agent/list', {});
				const agents = (response.agentlist as Array<{ agentid: number; name: string }>) || [];
				return agents.map((agent) => ({
					name: `${agent.name} (${agent.agentid})`,
					value: String(agent.agentid),
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
