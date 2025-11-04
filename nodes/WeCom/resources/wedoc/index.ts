import type { INodeProperties } from 'n8n-workflow';

// 管理文档
import { createDocDescription } from './createDoc';
import { renameDocDescription } from './renameDoc';
import { deleteDocDescription } from './deleteDoc';
import { getDocInfoDescription } from './getDocInfo';
import { shareDocDescription } from './shareDoc';

// 编辑文档
import { modDocContentDescription } from './modDocContent';
import { modSheetContentDescription } from './modSheetContent';

// 智能表格操作
import { addSmartsheetSheetDescription } from './addSmartsheetSheet';
import { delSmartsheetSheetDescription } from './delSmartsheetSheet';
import { updateSmartsheetSheetDescription } from './updateSmartsheetSheet';
import { addSmartsheetViewDescription } from './addSmartsheetView';
import { delSmartsheetViewDescription } from './delSmartsheetView';
import { updateSmartsheetViewDescription } from './updateSmartsheetView';
import { addSmartsheetFieldDescription } from './addSmartsheetField';
import { delSmartsheetFieldDescription } from './delSmartsheetField';
import { updateSmartsheetFieldDescription } from './updateSmartsheetField';
import { addSmartsheetRecordDescription } from './addSmartsheetRecord';
import { delSmartsheetRecordDescription } from './delSmartsheetRecord';
import { updateSmartsheetRecordDescription } from './updateSmartsheetRecord';

// 获取文档数据
import { getDocDataDescription } from './getDocData';
import { getSheetRangeDescription } from './getSheetRange';
import { getSheetDataDescription } from './getSheetData';

// 获取智能表格数据
import { querySmartsheetSheetDescription } from './querySmartsheetSheet';
import { querySmartsheetViewDescription } from './querySmartsheetView';
import { querySmartsheetFieldDescription } from './querySmartsheetField';
import { querySmartsheetRecordDescription } from './querySmartsheetRecord';

// 权限设置
import { getDocAuthDescription } from './getDocAuth';
import { modDocSafeRuleDescription } from './modDocSafeRule';
import { modDocMemberRuleDescription } from './modDocMemberRule';
import { modDocShareScopeDescription } from './modDocShareScope';
import { manageSmartsheetAuthDescription } from './manageSmartsheetAuth';

// 收集表
import { createFormDescription } from './createForm';
import { modFormDescription } from './modForm';
import { getFormInfoDescription } from './getFormInfo';
import { getFormStatisticDescription } from './getFormStatistic';
import { getFormAnswerDescription } from './getFormAnswer';

// 高级账号管理
import { allocateAdvancedAccountDescription } from './allocateAdvancedAccount';
import { deallocateAdvancedAccountDescription } from './deallocateAdvancedAccount';
import { getAdvancedAccountListDescription } from './getAdvancedAccountList';

// 素材管理
import { uploadDocImageDescription } from './uploadDocImage';

const showOnlyForWedoc = {
	resource: ['wedoc'],
};

export const wedocDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWedoc,
		},
		options: [
			{
				name: '编辑表格内容',
				value: 'modSheetContent',
				action: '编辑表格内容',
			},
			{
				name: '编辑收集表',
				value: 'modForm',
				action: '编辑收集表',
				description: '编辑收集表设置',
			},
			{
				name: '编辑文档内容',
				value: 'modDocContent',
				action: '编辑文档内容',
			},
			{
				name: '查询记录',
				value: 'querySmartsheetRecord',
				action: '查询记录',
				description: '查询子表的记录数据',
			},
			{
				name: '查询视图',
				value: 'querySmartsheetView',
				action: '查询视图',
				description: '查询子表的视图列表',
			},
			{
				name: '查询子表',
				value: 'querySmartsheetSheet',
				action: '查询子表',
				description: '查询智能表格的子表列表',
			},
			{
				name: '查询字段',
				value: 'querySmartsheetField',
				action: '查询字段',
				description: '查询子表的字段列表',
			},
			{
				name: '创建收集表',
				value: 'createForm',
				action: '创建收集表',
				description: '创建新的收集表',
			},
			{
				name: '读取收集表答案',
				value: 'getFormAnswer',
				action: '读取收集表答案',
				description: '读取收集表的答案数据',
			},
			{
				name: '分配高级功能账号',
				value: 'allocateAdvancedAccount',
				action: '分配高级账号',
				description: '为成员分配高级功能账号',
			},
			{
				name: '分享文档',
				value: 'shareDoc',
				action: '分享文档',
				description: '获取文档分享链接',
			},
			{
				name: '更新记录',
				value: 'updateSmartsheetRecord',
				action: '更新记录',
				description: '更新子表的记录',
			},
			{
				name: '更新视图',
				value: 'updateSmartsheetView',
				action: '更新视图',
				description: '更新子表的视图',
			},
			{
				name: '更新子表',
				value: 'updateSmartsheetSheet',
				action: '更新子表',
				description: '更新智能表格的子表',
			},
			{
				name: '更新字段',
				value: 'updateSmartsheetField',
				action: '更新字段',
				description: '更新子表的字段',
			},
			{
				name: '管理智能表格内容权限',
				value: 'manageSmartsheetAuth',
				action: '管理内容权限',
				description: '管理智能表格的内容权限',
			},
			{
				name: '获取表格数据',
				value: 'getSheetData',
				action: '获取表格数据',
				description: '获取表格指定范围的数据',
			},
			{
				name: '获取表格行列信息',
				value: 'getSheetRange',
				action: '获取表格行列信息',
				description: '获取表格的行列信息',
			},
			{
				name: '获取高级功能账号列表',
				value: 'getAdvancedAccountList',
				action: '获取高级账号列表',
				description: '获取已分配的高级功能账号列表',
			},
			{
				name: '获取收集表信息',
				value: 'getFormInfo',
				action: '获取收集表信息',
				description: '获取收集表的基本信息',
			},
			{
				name: '获取文档基础信息',
				value: 'getDocInfo',
				action: '获取文档信息',
			},
			{
				name: '获取文档权限信息',
				value: 'getDocAuth',
				action: '获取权限信息',
				description: '获取文档的权限信息',
			},
			{
				name: '获取文档数据',
				value: 'getDocData',
				action: '获取文档数据',
				description: '获取文档内容数据',
			},
			{
				name: '取消高级功能账号',
				value: 'deallocateAdvancedAccount',
				action: '取消高级账号',
				description: '取消成员的高级功能账号',
			},
			{
				name: '删除记录',
				value: 'delSmartsheetRecord',
				action: '删除记录',
				description: '删除子表的记录',
			},
			{
				name: '删除视图',
				value: 'delSmartsheetView',
				action: '删除视图',
				description: '删除子表的视图',
			},
			{
				name: '删除文档',
				value: 'deleteDoc',
				action: '删除文档',
			},
			{
				name: '删除子表',
				value: 'delSmartsheetSheet',
				action: '删除子表',
				description: '删除智能表格的子表',
			},
			{
				name: '删除字段',
				value: 'delSmartsheetField',
				action: '删除字段',
				description: '删除子表的字段',
			},
			{
				name: '上传文档图片',
				value: 'uploadDocImage',
				action: '上传文档图片',
				description: '上传图片到文档',
			},
			{
				name: '收集表的统计信息查询',
				value: 'getFormStatistic',
				action: '查询统计信息',
				description: '查询收集表的统计信息',
			},
			{
				name: '添加记录',
				value: 'addSmartsheetRecord',
				action: '添加记录',
				description: '在子表中添加记录',
			},
			{
				name: '添加视图',
				value: 'addSmartsheetView',
				action: '添加视图',
				description: '在子表中添加视图',
			},
			{
				name: '添加子表',
				value: 'addSmartsheetSheet',
				action: '添加子表',
				description: '在智能表格中添加子表',
			},
			{
				name: '添加字段',
				value: 'addSmartsheetField',
				action: '添加字段',
				description: '在子表中添加字段',
			},
			{
				name: '新建文档',
				value: 'createDoc',
				action: '新建文档',
				description: '创建新的文档/表格/智能表格',
			},
			{
				name: '修改文档安全设置',
				value: 'modDocSafeRule',
				action: '修改安全设置',
				description: '修改文档的安全设置',
			},
			{
				name: '修改文档查看规则',
				value: 'modDocShareScope',
				action: '修改查看规则',
				description: '修改文档的查看范围规则',
			},
			{
				name: '修改文档通知范围及权限',
				value: 'modDocMemberRule',
				action: '修改成员权限',
				description: '修改文档的成员权限规则',
			},
			{
				name: '重命名文档',
				value: 'renameDoc',
				action: '重命名文档',
			},
		],
		default: 'createDoc',
	},
	...createDocDescription,
	...renameDocDescription,
	...deleteDocDescription,
	...getDocInfoDescription,
	...shareDocDescription,
	...modDocContentDescription,
	...modSheetContentDescription,
	...addSmartsheetSheetDescription,
	...delSmartsheetSheetDescription,
	...updateSmartsheetSheetDescription,
	...addSmartsheetViewDescription,
	...delSmartsheetViewDescription,
	...updateSmartsheetViewDescription,
	...addSmartsheetFieldDescription,
	...delSmartsheetFieldDescription,
	...updateSmartsheetFieldDescription,
	...addSmartsheetRecordDescription,
	...delSmartsheetRecordDescription,
	...updateSmartsheetRecordDescription,
	...getDocDataDescription,
	...getSheetRangeDescription,
	...getSheetDataDescription,
	...querySmartsheetSheetDescription,
	...querySmartsheetViewDescription,
	...querySmartsheetFieldDescription,
	...querySmartsheetRecordDescription,
	...getDocAuthDescription,
	...modDocSafeRuleDescription,
	...modDocMemberRuleDescription,
	...modDocShareScopeDescription,
	...manageSmartsheetAuthDescription,
	...createFormDescription,
	...modFormDescription,
	...getFormInfoDescription,
	...getFormStatisticDescription,
	...getFormAnswerDescription,
	...allocateAdvancedAccountDescription,
	...deallocateAdvancedAccountDescription,
	...getAdvancedAccountListDescription,
	...uploadDocImageDescription,
];
