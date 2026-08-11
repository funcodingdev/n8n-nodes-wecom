import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// 凭证测试会向群聊发送消息，因此有意不提供测试请求
// eslint-disable-next-line @n8n/community-nodes/credential-test-required
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
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://qyapi.weixin.qq.com',
			required: false,
			placeholder: 'https://qyapi.weixin.qq.com',
			description: '企业微信 API 的基础地址（用于上传媒体文件）',
			hint: '可选，不填默认走官方 API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};
}
