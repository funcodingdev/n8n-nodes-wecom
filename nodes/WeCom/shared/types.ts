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

// 消息推送相关类型
export type PushMessageType = 'text' | 'image' | 'voice' | 'video' | 'location' | 'link' | 'event';

export type EventType = 
	| 'change_contact'
	| 'change_contact_party'
	| 'change_contact_tag'
	| 'click'
	| 'view'
	| 'scancode_push'
	| 'scancode_waitmsg'
	| 'pic_sysphoto'
	| 'pic_photo_or_album'
	| 'pic_weixin'
	| 'location_select'
	| 'location'
	| 'enter_agent'
	| 'batch_job_result';

export type ChangeType = 
	| 'create_user'
	| 'update_user'
	| 'delete_user'
	| 'create_party'
	| 'update_party'
	| 'delete_party'
	| 'create_tag'
	| 'update_tag'
	| 'delete_tag'
	| 'update_tag_user';

// 基础推送消息接口
export interface IBasePushMessage {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: string;
	AgentID?: number;
}

// 文本消息
export interface IPushTextMessage extends IBasePushMessage {
	MsgType: 'text';
	Content: string;
	MsgId: string;
}

// 图片消息
export interface IPushImageMessage extends IBasePushMessage {
	MsgType: 'image';
	PicUrl: string;
	MediaId: string;
	MsgId: string;
}

// 语音消息
export interface IPushVoiceMessage extends IBasePushMessage {
	MsgType: 'voice';
	MediaId: string;
	Format: string;
	MsgId: string;
}

// 视频消息
export interface IPushVideoMessage extends IBasePushMessage {
	MsgType: 'video';
	MediaId: string;
	ThumbMediaId: string;
	MsgId: string;
}

// 位置消息
export interface IPushLocationMessage extends IBasePushMessage {
	MsgType: 'location';
	Location_X: number;
	Location_Y: number;
	Scale: number;
	Label: string;
	MsgId: string;
	AppType: string;
}

// 链接消息
export interface IPushLinkMessage extends IBasePushMessage {
	MsgType: 'link';
	Title: string;
	Description: string;
	Url: string;
	PicUrl: string;
	MsgId: string;
}

// 事件推送
export interface IPushEventMessage extends IBasePushMessage {
	MsgType: 'event';
	Event: string;
	ChangeType?: string;
	EventKey?: string;
	[key: string]: unknown;
}

