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

