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

	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/90235';

	properties: INodeProperties[] = [
		{
			displayName: '企业 ID',
			name: 'corpId',
			type: 'string',
			default: '',
			required: true,
			description: '企业微信的企业 ID（CorpID）',
		},
		{
			displayName: '应用 Secret',
			name: 'corpSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: '企业微信应用的 Secret',
		},
		{
			displayName: '应用 ID',
			name: 'agentId',
			type: 'string',
			default: '',
			required: true,
			description: '企业微信应用的 AgentID',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				access_token: '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://qyapi.weixin.qq.com',
			url: '/cgi-bin/user/get',
			method: 'GET',
			qs: {
				userid: '@me',
			},
		},
	};
}

