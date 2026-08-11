import type { INodeProperties } from 'n8n-workflow';

/** 会议报名 + Rooms + 会中扩展 参数定义 */

const enrollOps = ['getEnrollConfig', 'setEnrollConfig', 'listEnroll', 'approveEnroll'];

export const meetingAdvancedOpsDescription: INodeProperties[] = [
	// --- 报名 ---
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					...enrollOps,
					'bookRooms',
					'releaseRooms',
					'setCohost',
					'realcontrolSet',
					'setDefaultLayout',
					'phoneCallout',
					'phoneGetCalloutStatus',
					'getPollList',
					'getPollDetail',
				],
			},
		},
		default: '',
	},
	{
		displayName: '扩展请求JSON',
		name: 'extraJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: [
					'setDefaultLayout',
					'phoneCallout',
					'phoneGetCalloutStatus',
					'getPollList',
					'getPollDetail',
					'listLayoutTemplate',
				],
			},
		},
		default: '{}',
		description: '额外请求字段，按会议接口文档填写（如布局 ID、电话号码、投票 ID 等）',
	},
	{
		displayName: '报名配置JSON',
		name: 'enrollConfigJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setEnrollConfig'] },
		},
		default:
			'{\n  "approve_type": 1,\n  "is_collect_question": 1,\n  "no_registration_needed_for_staff": true\n}',
		description:
			'合并进 set_config 请求体（除 meetingid）。<a href="https://developer.work.weixin.qq.com/document/path/98797" target="_blank">官方文档</a>',
	},
	{
		displayName: '报名状态',
		name: 'enroll_status',
		type: 'number',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['listEnroll'] },
		},
		default: 0,
		description: 'status 筛选，0 表示不传（以官方枚举为准）',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['listEnroll', 'listRooms'],
			},
		},
		default: '',
	},
	{
		displayName: '条数限制',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['listEnroll', 'listRooms'],
			},
		},
		default: 20,
	},
	{
		displayName: '审批操作JSON',
		name: 'approveJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['approveEnroll'] },
		},
		default: '{\n  "enroll_id_list": [],\n  "status": 1\n}',
		description:
			'approve 请求体字段（与 meetingid 合并）。<a href="https://developer.work.weixin.qq.com/document/path/98810" target="_blank">报名相关文档</a>',
	},
	// --- Rooms ---
	{
		displayName: 'Rooms名称',
		name: 'meeting_room_name',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['listRooms'] },
		},
		default: '',
		description: '按会议室名称模糊筛选（可选）',
	},
	{
		displayName: 'Rooms会议室ID',
		name: 'meeting_room_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['getRoomInfo'],
			},
		},
		default: '',
	},
	{
		displayName: 'Rooms会议室ID列表',
		name: 'meeting_room_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['bookRooms', 'releaseRooms'] },
		},
		default: '',
		placeholder: 'id1,id2',
		description:
			'meeting_room_id_list，逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/98791" target="_blank">预定/释放 Rooms</a>',
	},
	// --- 会中扩展 ---
	{
		displayName: '联席主持人UserID列表',
		name: 'cohost_userids',
		type: 'string',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['setCohost'] },
		},
		default: '',
		description: '联席主持人成员账号，多个用逗号分隔',
	},
	{
		displayName: '会中控制JSON',
		name: 'realcontrolJson',
		type: 'json',
		displayOptions: {
			show: { resource: ['meeting'], operation: ['realcontrolSet'] },
		},
		default: '{}',
		description:
			'realcontrol/set 请求体（除 meetingid）。用于全体静音、等候室等扩展设置',
	},
];
