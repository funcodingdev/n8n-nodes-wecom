import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WeComApi implements ICredentialType {
	name = 'weComApi';

	displayName = '企业微信 API';

	// eslint-disable-next-line @n8n/community-nodes/icon-validation
	icon: Icon = { light: 'file:../icons/wecom.png', dark: 'file:../icons/wecom.dark.png' };

	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/90664';

	properties: INodeProperties[] = [
		{
			displayName: '企业 ID (Corp ID)',
			name: 'corpId',
			type: 'string',
			default: '',
			required: true,
			description: '企业微信的企业 ID',
			hint: '在"管理后台 - 我的企业 - 企业信息"中查看'
		},
		{
			displayName: '应用 ID (Agent ID)',
			name: 'agentId',
			type: 'string',
			default: '',
			required: true,
			description: '应用的唯一标识',
			hint: '在"应用管理 - 自建应用"中查看'
		},
		{
			displayName: '应用 Secret',
			name: 'corpSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: '应用的密钥',
			hint: '在"应用管理 - 自建应用"中查看，注意应用需要是启用状态'
		}
	];

	// 企业微信需要先获取 access_token，不能直接在这里配置
	// authenticate 留空，在节点执行时动态获取 token
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	// 测试认证是否有效
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://qyapi.weixin.qq.com',
			url: '/cgi-bin/user/get',
			method: 'GET',
			qs: {
				userid: '@me',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'errcode',
					value: 0,
					message: '认证失败：Corp ID 或 Secret 不正确',
				},
			},
		],
	};
}

