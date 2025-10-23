import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WeComReceiveApi implements ICredentialType {
	name = 'weComReceiveApi';

	displayName = '企业微信消息接收 API';

	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/90238';

	icon = { light: 'file:../icons/wecom.png', dark: 'file:../icons/wecom.dark.png' } as const;

	properties: INodeProperties[] = [
		{
			displayName: '企业 ID',
			name: 'corpId',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'ww1234567890abcdef',
			description: '企业微信的企业 ID（CorpID）',
			hint: '在企业微信管理后台 - 我的企业 - 企业信息中获取',
		},
		{
			displayName: '应用 ID (Agent ID)',
			name: 'agentId',
			type: 'string',
			default: '',
			required: true,
			placeholder: '1000001',
			description: '应用的唯一标识',
			hint: '在"应用管理 - 自建应用"中查看',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'your_token_here',
			description: '企业微信后台"接收消息"配置中自己设置的 Token，两边必须完全一致。用于自动验证消息签名，防止伪造请求',
			hint: '可由企业任意填写，用于生成签名',
			typeOptions: { password: true },
		},
		{
			displayName: 'EncodingAESKey',
			name: 'encodingAESKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			placeholder: '43位随机字符串（可在企业微信后台点击"随机生成"）',
			description: '企业微信后台"接收消息"配置中设置的密钥（43位字符），两边必须完全一致。用于自动解密消息内容',
			hint: '用于消息体的加密，长度固定为43个字符',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://qyapi.weixin.qq.com',
			url: '/cgi-bin/gettoken',
			method: 'GET',
			qs: {
				corpid: '={{$credentials.corpId}}',
				corpsecret: 'test',
			},
		},
	};
}

