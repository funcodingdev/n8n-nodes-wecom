import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { wedocDescription } from '../WeCom/resources/wedoc';
import { wefileDescription } from '../WeCom/resources/wefile';
import { mailDescription } from '../WeCom/resources/mail';
import { calendarDescription } from '../WeCom/resources/calendar';
import { meetingDescription } from '../WeCom/resources/meeting';
import { executeWedoc } from '../WeCom/resources/wedoc/execute';
import { executeWefile } from '../WeCom/resources/wefile/execute';
import { executeMail } from '../WeCom/resources/mail/execute';
import { executeCalendar } from '../WeCom/resources/calendar/execute';
import { executeMeeting } from '../WeCom/resources/meeting/execute';

export class WeComOffice implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信-办公',
		name: 'weComOffice',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '企业微信办公功能 - 文档、微盘、邮件、日程、会议',
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
						name: '会议',
						value: 'meeting',
						description: '管理企业微信会议（预约会议、会议控制、录制管理等）',
					},
					{
						name: '微盘',
						value: 'wefile',
						description: '管理微盘空间和文件',
					},
					{
						name: '文档',
						value: 'wedoc',
						description: '管理企业微信文档（在线文档、表格、智能表格）',
					},
					{
						name: '日程',
						value: 'calendar',
						description: '管理日历和日程（创建日历、创建日程、管理参与者等）',
					},
					{
						name: '邮件',
						value: 'mail',
						description: '管理企业邮箱（发送邮件、邮件群组、公共邮箱等）',
					},
				],
				default: 'wedoc',
			},
			...calendarDescription,
			...meetingDescription,
			...wedocDescription,
			...wefileDescription,
			...mailDescription,
		],
		usableAsTool: true,
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
		}

		return [returnData];
	}
}

