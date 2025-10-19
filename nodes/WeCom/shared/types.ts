export interface IWeComCredentials {
	corpId: string;
	corpSecret: string;
	agentId: string;
}

export interface IWeComAccessTokenResponse {
	errcode: number;
	errmsg: string;
	access_token?: string;
	expires_in?: number;
}

export interface IWeComMessageResponse {
	errcode: number;
	errmsg: string;
	invaliduser?: string;
	invalidparty?: string;
	invalidtag?: string;
	msgid?: string;
	response_code?: string;
}

export type MessageType = 'text' | 'image' | 'voice' | 'video' | 'file' | 'textcard' | 'news' | 'mpnews' | 'markdown';

// 群机器人消息推送类型
export type WebhookMessageType = 'text' | 'markdown' | 'markdown_v2' | 'image' | 'news' | 'file' | 'voice' | 'template_card';

// Webhook 凭证
export interface IWeComWebhookCredentials {
	webhookUrl: string;
}

// Webhook 响应
export interface IWeComWebhookResponse {
	errcode: number;
	errmsg: string;
}

