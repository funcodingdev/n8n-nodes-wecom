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
import { sendSmartsheetWebhookDescription } from './sendSmartsheetWebhook';

// 获取文档数据
import { getDocDataDescription } from './getDocData';
import { getSheetRangeDescription } from './getSheetRange';
import { getSheetDataDescription } from './getSheetData';

// 获取智能表格数据
import { querySmartsheetSheetDescription } from './querySmartsheetSheet';
import { querySmartsheetViewDescription } from './querySmartsheetView';
import { querySmartsheetFieldDescription } from './querySmartsheetField';
import { querySmartsheetRecordDescription } from './querySmartsheetRecord';
import { getSmartsheetGroupChatListDescription } from './getSmartsheetGroupChatList';
import { getSmartsheetGroupChatDescription } from './getSmartsheetGroupChat';
import { updateSmartsheetGroupChatDescription } from './updateSmartsheetGroupChat';

// 权限设置
import { getDocAuthDescription } from './getDocAuth';
import { modDocSafeRuleDescription } from './modDocSafeRule';
import { modDocMemberRuleDescription } from './modDocMemberRule';
import { modDocShareScopeDescription } from './modDocShareScope';
import { manageSmartsheetAuthDescription } from './manageSmartsheetAuth';
import { smartsheetExtraOpsDescription } from './smartsheetExtraOps';

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
			// 管理文档
			{
				name: '[管理文档] 新建文档',
				value: 'createDoc',
				action: '[管理文档] 新建文档',
				description: '创建新的文档/表格/智能表格',
			},
			{
				name: '[管理文档] 重命名文档',
				value: 'renameDoc',
				action: '[管理文档] 重命名文档',
				description: '修改文档的名称',
			},
			{
				name: '[管理文档] 删除文档',
				value: 'deleteDoc',
				action: '[管理文档] 删除文档',
				description: '删除文档/表格/智能表格',
			},
			{
				name: '[管理文档] 获取文档基础信息',
				value: 'getDocInfo',
				action: '[管理文档] 获取文档基础信息',
				description: '获取文档基础信息',
			},
			{
				name: '[管理文档] 分享文档',
				value: 'shareDoc',
				action: '[管理文档] 分享文档',
				description: '获取文档分享链接',
			},
			// 管理文档内容
			{
				name: '[管理文档内容] 编辑文档内容',
				value: 'modDocContent',
				action: '[管理文档内容] 编辑文档内容',
				description: '编辑文本文档的内容',
			},
			{
				name: '[管理文档内容] 获取文档数据',
				value: 'getDocData',
				action: '[管理文档内容] 获取文档数据',
				description: '获取文档内容数据',
			},
			{
				name: '[管理表格内容] 编辑表格内容',
				value: 'modSheetContent',
				action: '[管理表格内容] 编辑表格内容',
				description: '编辑表格文档的内容',
			},
			{
				name: '[管理表格内容] 获取表格行列信息',
				value: 'getSheetRange',
				action: '[管理表格内容] 获取表格行列信息',
				description: '获取表格的行列信息',
			},
			{
				name: '[管理表格内容] 获取表格数据',
				value: 'getSheetData',
				action: '[管理表格内容] 获取表格数据',
				description: '获取表格指定范围的数据',
			},
			// 智能表格操作
			{
				name: '[智能表格] 添加子表',
				value: 'addSmartsheetSheet',
				action: '[智能表格] 添加子表',
				description: '在智能表格中添加子表',
			},
			{
				name: '[智能表格] 删除子表',
				value: 'delSmartsheetSheet',
				action: '[智能表格] 删除子表',
				description: '删除智能表格的子表',
			},
			{
				name: '[智能表格] 更新子表',
				value: 'updateSmartsheetSheet',
				action: '[智能表格] 更新子表',
				description: '更新智能表格的子表',
			},
			{
				name: '[智能表格] 添加视图',
				value: 'addSmartsheetView',
				action: '[智能表格] 添加视图',
				description: '在子表中添加视图',
			},
			{
				name: '[智能表格] 删除视图',
				value: 'delSmartsheetView',
				action: '[智能表格] 删除视图',
				description: '删除子表的视图',
			},
			{
				name: '[智能表格] 更新视图',
				value: 'updateSmartsheetView',
				action: '[智能表格] 更新视图',
				description: '更新子表的视图',
			},
			{
				name: '[智能表格] 添加字段',
				value: 'addSmartsheetField',
				action: '[智能表格] 添加字段',
				description: '在子表中添加字段',
			},
			{
				name: '[智能表格] 删除字段',
				value: 'delSmartsheetField',
				action: '[智能表格] 删除字段',
				description: '删除子表的字段',
			},
			{
				name: '[智能表格] 更新字段',
				value: 'updateSmartsheetField',
				action: '[智能表格] 更新字段',
				description: '更新子表的字段',
			},
			{
				name: '[智能表格] 添加记录',
				value: 'addSmartsheetRecord',
				action: '[智能表格] 添加记录',
				description: '在子表中添加记录',
			},
			{
				name: '[智能表格] 删除记录',
				value: 'delSmartsheetRecord',
				action: '[智能表格] 删除记录',
				description: '删除子表的记录',
			},
			{
				name: '[智能表格] 更新记录',
				value: 'updateSmartsheetRecord',
				action: '[智能表格] 更新记录',
				description: '更新子表的记录',
			},
			{
				name: '[智能表格] Webhook 写入数据',
				value: 'sendSmartsheetWebhook',
				action: '[智能表格] Webhook 写入数据',
				description: '通过智能表格“接收外部数据”生成的 Webhook 地址新增或更新记录',
			},
			// 获取智能表格数据
			{
				name: '[获取智能表格数据] 查询子表',
				value: 'querySmartsheetSheet',
				action: '[获取智能表格数据] 查询子表',
				description: '查询智能表格的子表列表',
			},
			{
				name: '[获取智能表格数据] 查询视图',
				value: 'querySmartsheetView',
				action: '[获取智能表格数据] 查询视图',
				description: '查询子表的视图列表',
			},
			{
				name: '[获取智能表格数据] 查询字段',
				value: 'querySmartsheetField',
				action: '[获取智能表格数据] 查询字段',
				description: '查询子表的字段列表',
			},
			{
				name: '[获取智能表格数据] 查询记录',
				value: 'querySmartsheetRecord',
				action: '[获取智能表格数据] 查询记录',
				description: '查询子表的记录数据',
			},
			{
				name: '[获取智能表格数据] 获取群聊列表',
				value: 'getSmartsheetGroupChatList',
				action: '[获取智能表格数据] 获取群聊列表',
				description: '查询通过智能表格自动化创建的群聊列表',
			},
			{
				name: '[获取智能表格数据] 获取群聊会话',
				value: 'getSmartsheetGroupChat',
				action: '[获取智能表格数据] 获取群聊会话',
				description: '查询通过智能表格自动化创建的群聊信息',
			},
			{
				name: '[获取智能表格数据] 修改群聊会话',
				value: 'updateSmartsheetGroupChat',
				action: '[获取智能表格数据] 修改群聊会话',
				description: '修改通过智能表格自动化创建的群聊的群成员',
			},
			// 权限设置
			{
				name: '[权限设置] 获取文档权限信息',
				value: 'getDocAuth',
				action: '[权限设置] 获取文档权限信息',
				description: '获取文档的权限信息',
			},
			{
				name: '[权限设置] 修改文档通知范围及权限',
				value: 'modDocMemberRule',
				action: '[权限设置] 修改文档通知范围及权限',
				description: '修改文档的成员权限规则',
			},
			{
				name: '[权限设置] 修改文档加入规则',
				value: 'modDocShareScope',
				action: '[权限设置] 修改文档加入规则',
				description: '修改文档、表格、智能表格的加入规则',
			},
			{
				name: '[权限设置] 修改文档安全设置',
				value: 'modDocSafeRule',
				action: '[权限设置] 修改文档安全设置',
				description: '修改文档的安全设置',
			},
			{
				name: '[权限设置] 管理智能表格内容权限',
				value: 'manageSmartsheetAuth',
				action: '[权限设置] 管理智能表格内容权限',
				description: 'update_sheet_priv 快捷开关',
			},
			{
				name: '[权限设置] 查询内容权限规则',
				value: 'getSheetPriv',
				action: '查询内容权限',
				description: 'content_priv/get_sheet_priv',
			},
			{
				name: '[权限设置] 创建额外权限规则',
				value: 'createPrivRule',
				action: '创建权限规则',
				description: 'content_priv/create_rule',
			},
			{
				name: '[权限设置] 修改权限规则成员',
				value: 'modPrivRuleMember',
				action: '修改规则成员',
				description: 'content_priv/mod_rule_member',
			},
			{
				name: '[权限设置] 删除额外权限规则',
				value: 'deletePrivRule',
				action: '删除权限规则',
				description: 'content_priv/delete_rule',
			},
			{
				name: '[智能表格] 添加字段编组',
				value: 'addFieldGroup',
				action: '添加编组',
				description: 'smartsheet/add_field_group',
			},
			{
				name: '[智能表格] 更新字段编组',
				value: 'updateFieldGroup',
				action: '更新编组',
				description: 'smartsheet/update_field_group',
			},
			{
				name: '[智能表格] 删除字段编组',
				value: 'deleteFieldGroups',
				action: '删除编组',
				description: 'smartsheet/delete_field_groups',
			},
			{
				name: '[智能表格] 查询字段编组',
				value: 'getFieldGroups',
				action: '查询编组',
				description: 'smartsheet/get_field_groups',
			},
			// 管理收集表
			{
				name: '[管理收集表] 创建收集表',
				value: 'createForm',
				action: '[管理收集表] 创建收集表',
				description: '创建新的收集表',
			},
			{
				name: '[管理收集表] 编辑收集表',
				value: 'modForm',
				action: '[管理收集表] 编辑收集表',
				description: '编辑收集表设置',
			},
			{
				name: '[管理收集表] 获取收集表信息',
				value: 'getFormInfo',
				action: '[管理收集表] 获取收集表信息',
				description: '获取收集表的基本信息',
			},
			{
				name: '[管理收集表] 收集表的统计信息查询',
				value: 'getFormStatistic',
				action: '[管理收集表] 收集表的统计信息查询',
				description: '查询收集表的统计信息',
			},
			{
				name: '[管理收集表] 读取收集表答案',
				value: 'getFormAnswer',
				action: '[管理收集表] 读取收集表答案',
				description: '读取收集表的答案数据',
			},
			// 高级功能账号管理
			{
				name: '[高级功能账号管理] 分配高级功能账号',
				value: 'allocateAdvancedAccount',
				action: '[高级功能账号管理] 分配高级功能账号',
				description: '为成员分配高级功能账号',
			},
			{
				name: '[高级功能账号管理] 取消高级功能账号',
				value: 'deallocateAdvancedAccount',
				action: '[高级功能账号管理] 取消高级功能账号',
				description: '取消成员的高级功能账号',
			},
			{
				name: '[高级功能账号管理] 获取高级功能账号列表',
				value: 'getAdvancedAccountList',
				action: '[高级功能账号管理] 获取高级功能账号列表',
				description: '获取已分配的高级功能账号列表',
			},
			// 素材管理
			{
				name: '[素材管理] 上传文档图片',
				value: 'uploadDocImage',
				action: '[素材管理] 上传文档图片',
				description: '上传图片到文档',
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
	...sendSmartsheetWebhookDescription,
	...getDocDataDescription,
	...getSheetRangeDescription,
	...getSheetDataDescription,
	...querySmartsheetSheetDescription,
	...querySmartsheetViewDescription,
	...querySmartsheetFieldDescription,
	...querySmartsheetRecordDescription,
	...getSmartsheetGroupChatListDescription,
	...getSmartsheetGroupChatDescription,
	...updateSmartsheetGroupChatDescription,
	...getDocAuthDescription,
	...modDocSafeRuleDescription,
	...modDocMemberRuleDescription,
	...modDocShareScopeDescription,
	...manageSmartsheetAuthDescription,
	...smartsheetExtraOpsDescription,
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
