import type { INodeProperties } from 'n8n-workflow';

import { getCorporationRulesDescription } from './getCorporationRules';
import { getUserRulesDescription } from './getUserRules';
import { getCheckinDataDescription } from './getCheckinData';
import { getDailyReportDescription } from './getDailyReport';
import { getMonthlyReportDescription } from './getMonthlyReport';
import { getScheduleListDescription } from './getScheduleList';
import { setScheduleListDescription } from './setScheduleList';
import { addCheckinDescription } from './addCheckin';
import { addCheckinRecordDescription } from './addCheckinRecord';
import { addFaceInfoDescription } from './addFaceInfo';
import { getDeviceCheckinDataDescription } from './getDeviceCheckinData';
import { manageRulesDescription } from './manageRules';

const showOnlyForCheckin = {
	resource: ['checkin'],
};

export const checkinDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCheckin,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '获取企业所有打卡规则',
				value: 'getCorporationRules',
				action: '获取企业所有打卡规则',
				description: 'Get all check-in rules of the corporation',
			},
			{
				name: '获取员工打卡规则',
				value: 'getUserRules',
				action: '获取员工打卡规则',
				description: 'Get employee check-in rules',
			},
			{
				name: '获取打卡记录数据',
				value: 'getCheckinData',
				action: '获取打卡记录数据',
				description: 'Get check-in record data',
			},
			{
				name: '获取打卡日报数据',
				value: 'getDailyReport',
				action: '获取打卡日报数据',
				description: 'Get daily check-in report',
			},
			{
				name: '获取打卡月报数据',
				value: 'getMonthlyReport',
				action: '获取打卡月报数据',
				description: 'Get monthly check-in report',
			},
			{
				name: '获取打卡人员排班信息',
				value: 'getScheduleList',
				action: '获取排班信息',
				description: 'Get schedule information',
			},
			{
				name: '为打卡人员排班',
				value: 'setScheduleList',
				action: '设置排班',
				description: 'Set schedule for employees',
			},
			{
				name: '为打卡人员补卡',
				value: 'addCheckin',
				action: '补卡',
				description: 'Add supplementary check-in',
			},
			{
				name: '添加打卡记录',
				value: 'addCheckinRecord',
				action: '添加打卡记录',
				description: 'Add check-in record',
			},
			{
				name: '录入打卡人员人脸信息',
				value: 'addFaceInfo',
				action: '录入人脸信息',
				description: 'Add face information',
			},
			{
				name: '获取设备打卡数据',
				value: 'getDeviceCheckinData',
				action: '获取设备打卡数据',
				description: 'Get device check-in data',
			},
			{
				name: '管理打卡规则',
				value: 'manageRules',
				action: '管理打卡规则',
				description: 'Manage check-in rules',
			},
		],
		default: 'getCheckinData',
	},
	...getCorporationRulesDescription,
	...getUserRulesDescription,
	...getCheckinDataDescription,
	...getDailyReportDescription,
	...getMonthlyReportDescription,
	...getScheduleListDescription,
	...setScheduleListDescription,
	...addCheckinDescription,
	...addCheckinRecordDescription,
	...addFaceInfoDescription,
	...getDeviceCheckinDataDescription,
	...manageRulesDescription,
];

