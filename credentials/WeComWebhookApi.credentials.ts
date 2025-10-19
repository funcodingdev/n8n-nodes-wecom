import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WeComWebhookApi implements ICredentialType {
	name = 'weComWebhookApi';

	displayName = '企业微信群机器人 Webhook API';

	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/91770';

	icon = { light: 'file:../icons/wecom.png', dark: 'file:../icons/wecom.dark.png' } as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Webhook URL',
			name: 'webhookUrl',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			placeholder: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxx',
			description: '企业微信群机器人的 Webhook 地址',
			hint: '在企业微信群聊中添加机器人后获取',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.webhookUrl}}',
			method: 'POST',
			body: {
				msgtype: 'text',
				text: {
					content: 'n8n 凭证测试消息',
				},
			},
		},
	};
}

