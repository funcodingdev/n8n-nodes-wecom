import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// 回调凭证没有可主动调用的校验接口，由节点的 weComSuiteReceiveApiTest 在本地校验格式
export class WeComSuiteReceiveApi implements ICredentialType {
	name = 'weComSuiteReceiveApi';

	displayName = '企业微信第三方应用指令回调 API';

	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/91116';

	icon = { light: 'file:../icons/wecom.png', dark: 'file:../icons/wecom.dark.png' } as const;

	properties: INodeProperties[] = [
		{
			displayName: '第三方应用ID',
			name: 'suiteId',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'ww1234567890abcdef',
			description: '第三方应用的SuiteID（以ww或wx开头）',
			hint: '在企业微信服务商后台 - 应用管理 - 第三方应用中获取',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'your_token_here',
			description:
				'企业微信后台"指令回调URL"配置中自己设置的Token，两边必须完全一致。用于自动验证消息签名，防止伪造请求',
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
			description:
				'企业微信后台"指令回调URL"配置中设置的密钥（43位字符），两边必须完全一致。用于自动解密消息内容',
			hint: '用于消息体的加密，长度固定为43个字符。在第三方回调事件中使用加解密算法，receiveid的内容为suiteid',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};
}
