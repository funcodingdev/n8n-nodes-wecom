import type { INodeProperties } from 'n8n-workflow';
import { getCheckinExtraHttpOpOptions, checkinExtraHttpOpsDescription } from './extraHttpOps';

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
		// 官方文档：https://developer.work.weixin.qq.com/document/path/90261
		options: [
			// 打卡规则
			{
				name: '[打卡规则] 获取企业所有打卡规则',
				value: 'getCorporationRules',
				action: '获取企业所有打卡规则',
				description:
					'获取企业的所有打卡规则配置。<a href="https://developer.work.weixin.qq.com/document/path/93384" target="_blank">官方文档</a>',
			},
			{
				name: '[打卡规则] 获取员工打卡规则',
				value: 'getUserRules',
				action: '获取员工打卡规则',
				description: '获取指定员工的打卡规则',
			},
			{
				name: '[打卡规则] 管理打卡规则',
				value: 'manageRules',
				action: '管理打卡规则',
				description: '管理企业的打卡规则',
			},
			// 打卡数据
			{
				name: '[打卡数据] 获取打卡记录数据',
				value: 'getCheckinData',
				action: '获取打卡记录数据',
				description: '获取员工的打卡记录数据',
			},
			{
				name: '[打卡数据] 获取打卡日报数据',
				value: 'getDailyReport',
				action: '获取打卡日报数据',
				description: '获取打卡日报统计数据',
			},
			{
				name: '[打卡数据] 获取打卡月报数据',
				value: 'getMonthlyReport',
				action: '获取打卡月报数据',
				description: '获取打卡月报统计数据',
			},
			{
				name: '[打卡数据] 获取设备打卡数据',
				value: 'getDeviceCheckinData',
				action: '获取设备打卡数据',
				description: '获取打卡设备的打卡数据',
			},
			// 排班管理
			{
				name: '[排班管理] 获取打卡人员排班信息',
				value: 'getScheduleList',
				action: '获取排班信息',
				description: '获取打卡人员的排班信息',
			},
			{
				name: '[排班管理] 为打卡人员排班',
				value: 'setScheduleList',
				action: '设置排班',
				description: '为打卡人员设置排班',
			},
			// 打卡操作
			{
				name: '[打卡操作] 为打卡人员补卡',
				value: 'addCheckin',
				action: '补卡',
				description: '为员工添加补卡记录',
			},
			{
				name: '[打卡操作] 添加打卡记录',
				value: 'addCheckinRecord',
				action: '添加打卡记录',
				description: '添加员工的打卡记录',
			},
			{
				name: '[打卡操作] 录入打卡人员人脸信息',
				value: 'addFaceInfo',
				action: '录入人脸信息',
				description: '录入员工的人脸识别信息',
			},
			...getCheckinExtraHttpOpOptions(),
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
	...checkinExtraHttpOpsDescription,
];
