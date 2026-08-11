import type { INodeProperties } from 'n8n-workflow';
import {
	getSchoolExtraHttpOpOptions,
	schoolExtraHttpOpsDescription,
} from './extraHttpOps';
import { getHealthReportStatDescription } from './getHealthReportStat';
import { getHealthReportJobIdsDescription } from './getHealthReportJobIds';
import { getHealthReportJobInfoDescription } from './getHealthReportJobInfo';
import { getHealthReportAnswerDescription } from './getHealthReportAnswer';
import { getUserLivingIdDescription } from './getUserLivingId';
import { getLivingInfoDescription } from './getLivingInfo';
import { getLivingWatchStatDescription } from './getLivingWatchStat';
import { getLivingUnwatchStatDescription } from './getLivingUnwatchStat';
import { deleteLivingReplayDataDescription } from './deleteLivingReplayData';
import { getLivingWatchStatV2Description } from './getLivingWatchStatV2';
import { getLivingUnwatchStatV2Description } from './getLivingUnwatchStatV2';
import { getTradeResultDescription } from './getTradeResult';
import { getTradeDetailDescription } from './getTradeDetail';
import { getAllowScopeDescription } from './getAllowScope';
import { getUserInfo3rdDescription } from './getUserInfo3rd';
import { createStudentDescription } from './createStudent';
import { getSchoolUserDescription } from './getSchoolUser';

const showOnlyForSchool = {
	resource: ['school'],
};

export const schoolDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSchool,
		},
		options: [
			{
				name: '[家校沟通] 获取健康上报使用统计',
				value: 'getHealthReportStat',
				description: '获取指定日期的健康上报使用统计',
				action: '获取健康上报使用统计',
			},
			{
				name: '[家校沟通] 获取健康上报任务ID列表',
				value: 'getHealthReportJobIds',
				description: '获取健康上报任务ID列表',
				action: '获取健康上报任务ID列表',
			},
			{
				name: '[家校沟通] 获取健康上报任务详情',
				value: 'getHealthReportJobInfo',
				description: '获取健康上报任务详情',
				action: '获取健康上报任务详情',
			},
			{
				name: '[家校沟通] 获取健康上报填写答案',
				value: 'getHealthReportAnswer',
				description: '获取用户填写的健康上报答案',
				action: '获取健康上报填写答案',
			},
			{
				name: '[家校沟通] 获取老师直播ID列表',
				value: 'getUserLivingId',
				description: '获取老师创建的直播ID列表',
				action: '获取老师直播ID列表',
			},
			{
				name: '[家校沟通] 获取直播详情',
				value: 'getLivingInfo',
				description: '获取直播详情',
				action: '获取直播详情',
			},
			{
				name: '[家校沟通] 获取观看直播统计',
				value: 'getLivingWatchStat',
				description: '获取直播观看统计（旧版本）',
				action: '获取观看直播统计',
			},
			{
				name: '[家校沟通] 获取未观看直播统计',
				value: 'getLivingUnwatchStat',
				description: '获取未观看直播统计（旧版本）',
				action: '获取未观看直播统计',
			},
			{
				name: '[家校沟通] 删除直播回放',
				value: 'deleteLivingReplayData',
				description: '删除指定直播的回放视频',
				action: '删除直播回放',
			},
			{
				name: '[家校沟通] 获取观看直播统计V2',
				value: 'getLivingWatchStatV2',
				description: '获取直播观看统计（V2）',
				action: '获取观看直播统计V2',
			},
			{
				name: '[家校沟通] 获取未观看直播统计V2',
				value: 'getLivingUnwatchStatV2',
				description: '获取未观看直播统计（V2）',
				action: '获取未观看直播统计V2',
			},
			{
				name: '[家校沟通] 获取学生付款结果',
				value: 'getTradeResult',
				description: '获取班级收款学生付款结果',
				action: '获取学生付款结果',
			},
			{
				name: '[家校沟通] 获取订单详情',
				value: 'getTradeDetail',
				description: '获取班级收款订单详情',
				action: '获取订单详情',
			},
			{
				name: '[家校沟通] 获取可使用的家长范围',
				value: 'getAllowScope',
				description: '获取可在微信「学校通知-学校应用」使用该应用的家长范围',
				action: '获取可使用的家长范围',
			},
			{
				name: '[家校沟通] 获取家校访问用户身份',
				value: 'getUserInfo3rd',
				description: '获取家校访问用户身份',
				action: '获取家校访问用户身份',
			},
			{
				name: '[家校沟通] 创建学生',
				value: 'createStudent',
				description: '创建学生',
				action: '创建学生',
			},
			{
				name: '[家校沟通] 删除学生',
				value: 'deleteStudent',
				description: '删除学生',
				action: '删除学生',
			},
			{
				name: '[家校沟通] 更新学生',
				value: 'updateStudent',
				description: '更新学生信息',
				action: '更新学生',
			},
			{
				name: '[家校沟通] 批量创建学生',
				value: 'batchCreateStudent',
				description: '批量创建学生，每次最多100个',
				action: '批量创建学生',
			},
			{
				name: '[家校沟通] 批量删除学生',
				value: 'batchDeleteStudent',
				description: '批量删除学生',
				action: '批量删除学生',
			},
			{
				name: '[家校沟通] 批量更新学生',
				value: 'batchUpdateStudent',
				description: '批量更新学生信息',
				action: '批量更新学生',
			},
			{
				name: '[家校沟通] 创建家长',
				value: 'createParent',
				description: '创建家长',
				action: '创建家长',
			},
			{
				name: '[家校沟通] 删除家长',
				value: 'deleteParent',
				description: '删除家长',
				action: '删除家长',
			},
			{
				name: '[家校沟通] 更新家长',
				value: 'updateParent',
				description: '更新家长信息',
				action: '更新家长',
			},
			{
				name: '[家校沟通] 批量创建家长',
				value: 'batchCreateParent',
				description: '批量创建家长',
				action: '批量创建家长',
			},
			{
				name: '[家校沟通] 批量删除家长',
				value: 'batchDeleteParent',
				description: '批量删除家长',
				action: '批量删除家长',
			},
			{
				name: '[家校沟通] 批量更新家长',
				value: 'batchUpdateParent',
				description: '批量更新家长信息',
				action: '批量更新家长',
			},
			{
				name: '[家校沟通] 读取学生或家长',
				value: 'getSchoolUser',
				description: '读取学生或家长信息',
				action: '读取学生或家长',
			},
					...getSchoolExtraHttpOpOptions(),
		],
		default: 'getHealthReportStat',
	},
	...getHealthReportStatDescription,
	...getHealthReportJobIdsDescription,
	...getHealthReportJobInfoDescription,
	...getHealthReportAnswerDescription,
	...getUserLivingIdDescription,
	...getLivingInfoDescription,
	...getLivingWatchStatDescription,
	...getLivingUnwatchStatDescription,
	...deleteLivingReplayDataDescription,
	...getLivingWatchStatV2Description,
	...getLivingUnwatchStatV2Description,
	...getTradeResultDescription,
	...getTradeDetailDescription,
	...getAllowScopeDescription,
	...getUserInfo3rdDescription,
	...createStudentDescription,
	...getSchoolUserDescription,
	...schoolExtraHttpOpsDescription,
];
