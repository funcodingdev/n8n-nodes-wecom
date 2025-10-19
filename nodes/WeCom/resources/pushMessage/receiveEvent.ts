import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReceiveEvent = {
	resource: ['pushMessage'],
	operation: ['receiveEvent'],
};

export const receiveEventDescription: INodeProperties[] = [
	{
		displayName: '事件类型',
		name: 'eventType',
		type: 'options',
		displayOptions: {
			show: showOnlyForReceiveEvent,
		},
		options: [
			{
				name: '上报地理位置事件',
				value: 'location',
				description: '用户上报地理位置的事件推送',
			},
			{
				name: '弹出地理位置选择器事件',
				value: 'location_select',
				description: '用户选择地理位置的事件推送',
			},
			{
				name: '弹出微信相册发图器事件',
				value: 'pic_weixin',
				description: '用户从微信相册选图的事件推送',
			},
			{
				name: '弹出拍照或者相册发图事件',
				value: 'pic_photo_or_album',
				description: '用户拍照或从相册选图的事件推送',
			},
			{
				name: '弹出系统拍照发图事件',
				value: 'pic_sysphoto',
				description: '用户使用系统拍照发图的事件推送',
			},
			{
				name: '成员变更事件',
				value: 'change_contact',
				description: '通讯录成员的增删改事件',
			},
			{
				name: '扫码推事件',
				value: 'scancode_push',
				description: '用户扫码后的事件推送',
			},
			{
				name: '扫码推事件且弹出"消息接收中"提示框',
				value: 'scancode_waitmsg',
				description: '用户扫码后等待消息的事件推送',
			},
			{
				name: '批量任务完成事件',
				value: 'batch_job_result',
				description: '异步任务完成的事件推送',
			},
			{
				name: '标签变更事件',
				value: 'change_contact_tag',
				description: '通讯录标签的增删改事件',
			},
			{
				name: '点击菜单拉取消息事件',
				value: 'click',
				description: '用户点击自定义菜单后的事件推送',
			},
			{
				name: '点击菜单跳转链接事件',
				value: 'view',
				description: '用户点击菜单跳转链接的事件推送',
			},
			{
				name: '进入应用事件',
				value: 'enter_agent',
				description: '用户进入应用的事件推送',
			},
			{
				name: '部门变更事件',
				value: 'change_contact_party',
				description: '通讯录部门的增删改事件',
			},
		],
		default: 'change_contact',
		description: '选择要处理的事件类型',
		hint: '不同事件类型对应不同的数据结构',
	},
	{
		displayName: '事件内容',
		name: 'eventData',
		type: 'json',
		displayOptions: {
			show: showOnlyForReceiveEvent,
		},
		default: '{}',
		description: '接收到的事件数据（JSON格式）',
		hint: '包含Event、ChangeType等字段的事件体，具体字段根据事件类型不同而不同',
		required: true,
	},
];

// 成员变更事件
export interface IChangeContactEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'change_contact';
	ChangeType: 'create_user' | 'update_user' | 'delete_user';
	UserID?: string;
	NewUserID?: string;
	Name?: string;
	Department?: string;
	MainDepartment?: number;
	IsLeaderInDept?: string;
	Position?: string;
	Mobile?: string;
	Gender?: string;
	Email?: string;
	Avatar?: string;
	Alias?: string;
	Telephone?: string;
	ExtAttr?: unknown;
}

// 部门变更事件
export interface IChangeContactPartyEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'change_contact';
	ChangeType: 'create_party' | 'update_party' | 'delete_party';
	Id: number;
	Name?: string;
	ParentId?: string;
	Order?: number;
}

// 标签变更事件
export interface IChangeContactTagEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'change_contact';
	ChangeType: 'create_tag' | 'update_tag' | 'delete_tag' | 'update_tag_user';
	TagId: number;
	TagName?: string;
	AddUserItems?: string;
	DelUserItems?: string;
	AddPartyItems?: string;
	DelPartyItems?: string;
}

// 菜单事件
export interface IMenuEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'click' | 'view' | 'scancode_push' | 'scancode_waitmsg' | 'pic_sysphoto' | 'pic_photo_or_album' | 'pic_weixin' | 'location_select';
	EventKey: string;
	AgentID: number;
	[key: string]: unknown;
}

// 上报地理位置事件
export interface ILocationEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'location';
	Latitude: number;
	Longitude: number;
	Precision: number;
	AgentID: number;
	AppType: string;
}

// 进入应用事件
export interface IEnterAgentEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'enter_agent';
	EventKey: string;
	AgentID: number;
}

// 批量任务完成事件
export interface IBatchJobResultEvent {
	ToUserName: string;
	FromUserName: string;
	CreateTime: number;
	MsgType: 'event';
	Event: 'batch_job_result';
	BatchJob: {
		JobId: string;
		JobType: string;
		ErrCode: number;
		ErrMsg: string;
	};
}

