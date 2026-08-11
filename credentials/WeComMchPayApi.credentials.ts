import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

/**
 * 企业微信企业支付（红包 / 向员工付款）
 * 走 api.mch.weixin.qq.com XML + 商户 API 证书双向 TLS
 */
export class WeComMchPayApi implements ICredentialType {
	name = 'weComMchPayApi';

	displayName = '企业微信商户支付 (红包/向员工付款)';

	// eslint-disable-next-line @n8n/community-nodes/icon-validation
	icon: Icon = { light: 'file:../icons/wecom.png', dark: 'file:../icons/wecom.dark.png' };

	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/90273';

	properties: INodeProperties[] = [
		{
			displayName: '商户号 (mch_id)',
			name: 'mchId',
			type: 'string',
			default: '',
			required: true,
			description: '微信支付分配的商户号',
		},
		{
			displayName: '商户 API 密钥 (key)',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: '商户平台 API 密钥，用于微信支付 sign',
		},
		{
			displayName: 'AppID / CorpID (wxappid)',
			name: 'wxAppId',
			type: 'string',
			default: '',
			required: true,
			description: '企业微信 corpid（文档中作为 wxappid/appid）',
		},
		{
			displayName: '应用 Secret (workwx_sign)',
			name: 'agentSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: '发红包/付款用的应用 secret，用于 workwx_sign',
		},
		{
			displayName: '默认应用 AgentID',
			name: 'agentId',
			type: 'string',
			default: '',
			description: '以企业应用名义发红包/付款时的 agentid（可选默认）',
		},
		{
			displayName: '商户 API 证书 (PEM)',
			name: 'certPem',
			type: 'string',
			typeOptions: { rows: 6, password: true },
			default: '',
			required: true,
			description: 'apiclient_cert.pem 全文（含 BEGIN CERTIFICATE）',
		},
		{
			displayName: '商户 API 私钥 (PEM)',
			name: 'keyPem',
			type: 'string',
			typeOptions: { rows: 6, password: true },
			default: '',
			required: true,
			description: 'apiclient_key.pem 全文（含 BEGIN PRIVATE KEY）',
		},
		{
			displayName: '私钥口令 (可选)',
			name: 'keyPassphrase',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: '若私钥加密则填写',
		},
	];
}
