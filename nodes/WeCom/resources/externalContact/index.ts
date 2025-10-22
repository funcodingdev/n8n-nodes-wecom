import type { INodeProperties } from 'n8n-workflow';
import { getFollowUserListDescription } from './getFollowUserList';
import { getExternalContactListDescription } from './getExternalContactList';
import { getExternalContactDescription } from './getExternalContact';
import { batchGetExternalContactDescription } from './batchGetExternalContact';
import { updateExternalContactRemarkDescription } from './updateExternalContactRemark';
import { getCorpTagListDescription } from './getCorpTagList';
import { addCorpTagDescription } from './addCorpTag';
import { editCorpTagDescription } from './editCorpTag';
import { delCorpTagDescription } from './delCorpTag';
import { markTagDescription } from './markTag';
import { transferCustomerDescription } from './transferCustomer';
import { transferResultDescription } from './transferResult';
import { transferGroupChatDescription } from './transferGroupChat';
import { getUnassignedListDescription } from './getUnassignedList';
import { resignedTransferCustomerDescription } from './resignedTransferCustomer';
import { resignedTransferResultDescription } from './resignedTransferResult';
import { resignedTransferGroupChatDescription } from './resignedTransferGroupChat';
import { getGroupChatListDescription } from './getGroupChatList';
import { getGroupChatDescription } from './getGroupChat';
import { opengidToChatidDescription } from './opengidToChatid';
import { addContactWayDescription } from './addContactWay';
import { getContactWayDescription } from './getContactWay';
import { updateContactWayDescription } from './updateContactWay';
import { delContactWayDescription } from './delContactWay';
import { addJoinWayDescription } from './addJoinWay';
import { getJoinWayDescription } from './getJoinWay';
import { updateJoinWayDescription } from './updateJoinWay';
import { delJoinWayDescription } from './delJoinWay';
import { addMomentTaskDescription } from './addMomentTask';
import { cancelMomentTaskDescription } from './cancelMomentTask';
import { getMomentTaskListDescription } from './getMomentTaskList';
import { getMomentTaskDescription } from './getMomentTask';
import { addMsgTemplateDescription } from './addMsgTemplate';
import { remindGroupMsgSendDescription } from './remindGroupMsgSend';
import { cancelGroupMsgSendDescription } from './cancelGroupMsgSend';
import { getGroupMsgListV2Description } from './getGroupMsgListV2';
import { sendWelcomeMsgDescription } from './sendWelcomeMsg';
import { addGroupWelcomeTemplateDescription } from './addGroupWelcomeTemplate';
import { editGroupWelcomeTemplateDescription } from './editGroupWelcomeTemplate';
import { getGroupWelcomeTemplateDescription } from './getGroupWelcomeTemplate';
import { delGroupWelcomeTemplateDescription } from './delGroupWelcomeTemplate';
import { getUserBehaviorDataDescription } from './getUserBehaviorData';
import { getGroupChatStatisticDescription } from './getGroupChatStatistic';
import { addProductAlbumDescription } from './addProductAlbum';
import { getProductAlbumListDescription } from './getProductAlbumList';
import { getProductAlbumDescription } from './getProductAlbum';
import { updateProductAlbumDescription } from './updateProductAlbum';
import { deleteProductAlbumDescription } from './deleteProductAlbum';
import { addInterceptRuleDescription } from './addInterceptRule';
import { getInterceptRuleListDescription } from './getInterceptRuleList';
import { getInterceptRuleDescription } from './getInterceptRule';
import { updateInterceptRuleDescription } from './updateInterceptRule';
import { deleteInterceptRuleDescription } from './deleteInterceptRule';
import { uploadAttachmentDescription } from './uploadAttachment';
import { getCustomerAcquisitionQuotaDescription } from './getCustomerAcquisitionQuota';
import { listCustomerAcquisitionLinkDescription } from './listCustomerAcquisitionLink';
import { createCustomerAcquisitionLinkDescription } from './createCustomerAcquisitionLink';
import { updateCustomerAcquisitionLinkDescription } from './updateCustomerAcquisitionLink';
import { deleteCustomerAcquisitionLinkDescription } from './deleteCustomerAcquisitionLink';
import { getCustomerAcquisitionCustomerDescription } from './getCustomerAcquisitionCustomer';
import { getServedExternalContactDescription } from './getServedExternalContact';

const showOnlyForExternalContact = {
	resource: ['externalContact'],
};

export const externalContactDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForExternalContact,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			// 企业服务人员管理
			{
				name: '获取配置了客户联系功能的成员列表',
				value: 'getFollowUserList',
				action: '获取配置了客户联系功能的成员列表',
			},
			// 客户管理
			{
				name: '获取客户列表',
				value: 'getExternalContactList',
				action: '获取客户列表',
				description: '获取某个成员的客户列表',
			},
			{
				name: '获取客户详情',
				value: 'getExternalContact',
				action: '获取客户详情',
				description: '获取外部联系人详情',
			},
			{
				name: '批量获取客户详情',
				value: 'batchGetExternalContact',
				action: '批量获取客户详情',
				description: '批量获取成员的客户列表',
			},
			{
				name: '修改客户备注信息',
				value: 'updateExternalContactRemark',
				action: '修改客户备注信息',
			},
			// 客户标签管理
			{
				name: '获取企业标签库',
				value: 'getCorpTagList',
				action: '获取企业标签库',
				description: '获取企业客户标签库',
			},
			{
				name: '添加企业客户标签',
				value: 'addCorpTag',
				action: '添加企业客户标签',
				description: '创建企业客户标签',
			},
			{
				name: '编辑企业客户标签',
				value: 'editCorpTag',
				action: '编辑企业客户标签',
				description: '编辑企业客户标签名称或次序',
			},
			{
				name: '删除企业客户标签',
				value: 'delCorpTag',
				action: '删除企业客户标签',
			},
			{
				name: '编辑客户企业标签',
				value: 'markTag',
				action: '编辑客户企业标签',
				description: '为指定的客户添加或删除企业标签',
			},
			// 在职继承
			{
				name: '分配在职成员的客户',
				value: 'transferCustomer',
				action: '分配在职成员的客户',
				description: '在职成员客户转接',
			},
			{
				name: '查询客户接替状态',
				value: 'transferResult',
				action: '查询客户接替状态',
				description: '查询在职成员客户接替状态',
			},
			{
				name: '分配在职成员的客户群',
				value: 'transferGroupChat',
				action: '分配在职成员的客户群',
				description: '在职成员的客户群转接',
			},
			// 离职继承
			{
				name: '获取待分配的离职成员列表',
				value: 'getUnassignedList',
				action: '获取待分配的离职成员列表',
				description: '获取离职成员列表',
			},
			{
				name: '分配离职成员的客户',
				value: 'resignedTransferCustomer',
				action: '分配离职成员的客户',
				description: '离职成员客户转接',
			},
			{
				name: '查询离职成员客户接替状态',
				value: 'resignedTransferResult',
				action: '查询离职成员客户接替状态',
			},
			{
				name: '分配离职成员的客户群',
				value: 'resignedTransferGroupChat',
				action: '分配离职成员的客户群',
				description: '离职成员的客户群转接',
			},
			// 客户群管理
			{
				name: '获取客户群列表',
				value: 'getGroupChatList',
				action: '获取客户群列表',
			},
			{
				name: '获取客户群详情',
				value: 'getGroupChat',
				action: '获取客户群详情',
			},
			{
				name: '客户群Opengid转换',
				value: 'opengidToChatid',
				action: 'Opengid',
				description: '将客户群的opengid转换为chat_id',
			},
			// 联系我与客户入群方式
			{
				name: '配置客户联系「联系我」方式',
				value: 'addContactWay',
				action: '配置客户联系「联系我」方式',
				description: '配置「联系我」二维码和「联系我」小程序按钮',
			},
			{
				name: '获取企业已配置的「联系我」方式',
				value: 'getContactWay',
				action: '获取企业已配置的「联系我」方式',
			},
			{
				name: '更新企业已配置的「联系我」方式',
				value: 'updateContactWay',
				action: '更新企业已配置的「联系我」方式',
				description: '更新「联系我」二维码和「联系我」小程序按钮',
			},
			{
				name: '删除企业已配置的「联系我」方式',
				value: 'delContactWay',
				action: '删除企业已配置的「联系我」方式',
				description: '删除「联系我」配置',
			},
			{
				name: '配置客户群进群方式',
				value: 'addJoinWay',
				action: '配置客户群进群方式',
			},
			{
				name: '获取客户群进群方式配置',
				value: 'getJoinWay',
				action: '获取客户群进群方式配置',
			},
			{
				name: '更新客户群进群方式配置',
				value: 'updateJoinWay',
				action: '更新客户群进群方式配置',
			},
			{
				name: '删除客户群进群方式配置',
				value: 'delJoinWay',
				action: '删除客户群进群方式配置',
			},
			// 客户朋友圈
			{
				name: '创建发表任务',
				value: 'addMomentTask',
				action: '创建发表任务',
				description: '企业和第三方应用可调用此接口创建客户朋友圈发表任务',
			},
			{
				name: '停止发表企业朋友圈',
				value: 'cancelMomentTask',
				action: '停止发表企业朋友圈',
			},
			{
				name: '获取企业全部的发表列表',
				value: 'getMomentTaskList',
				action: '获取企业全部的发表列表',
				description: '获取企业全部的发表记录',
			},
			{
				name: '获取客户朋友圈发表时刻的成员发送情况',
				value: 'getMomentTask',
				action: '获取客户朋友圈发表时刻的成员发送情况',
				description: '获取客户朋友圈企业发表的列表',
			},
			// 消息推送
			{
				name: '创建企业群发',
				value: 'addMsgTemplate',
				action: '创建企业群发',
				description: '创建企业群发消息',
			},
			{
				name: '提醒成员群发',
				value: 'remindGroupMsgSend',
				action: '提醒成员群发',
			},
			{
				name: '停止企业群发',
				value: 'cancelGroupMsgSend',
				action: '停止企业群发',
			},
			{
				name: '获取群发记录列表',
				value: 'getGroupMsgListV2',
				action: '获取群发记录列表',
				description: '获取企业的全部群发记录',
			},
			{
				name: '发送新客户欢迎语',
				value: 'sendWelcomeMsg',
				action: '发送新客户欢迎语',
			},
			{
				name: '添加入群欢迎语素材',
				value: 'addGroupWelcomeTemplate',
				action: '添加入群欢迎语素材',
			},
			{
				name: '编辑入群欢迎语素材',
				value: 'editGroupWelcomeTemplate',
				action: '编辑入群欢迎语素材',
			},
			{
				name: '获取入群欢迎语素材',
				value: 'getGroupWelcomeTemplate',
				action: '获取入群欢迎语素材',
			},
			{
				name: '删除入群欢迎语素材',
				value: 'delGroupWelcomeTemplate',
				action: '删除入群欢迎语素材',
			},
			// 统计管理
			{
				name: '获取「联系客户统计」数据',
				value: 'getUserBehaviorData',
				action: '获取「联系客户统计」数据',
				description: '获取成员联系客户的数据',
			},
			{
				name: '获取「群聊数据统计」数据',
				value: 'getGroupChatStatistic',
				action: '获取「群聊数据统计」数据',
				description: '获取群聊数据统计',
			},
			// 其他接口
			{
				name: '创建商品图册',
				value: 'addProductAlbum',
				action: '创建商品图册',
			},
			{
				name: '获取商品图册列表',
				value: 'getProductAlbumList',
				action: '获取商品图册列表',
			},
			{
				name: '获取商品图册',
				value: 'getProductAlbum',
				action: '获取商品图册',
			},
			{
				name: '编辑商品图册',
				value: 'updateProductAlbum',
				action: '编辑商品图册',
			},
			{
				name: '删除商品图册',
				value: 'deleteProductAlbum',
				action: '删除商品图册',
			},
			{
				name: '新建敏感词规则',
				value: 'addInterceptRule',
				action: '新建敏感词规则',
			},
			{
				name: '获取敏感词规则列表',
				value: 'getInterceptRuleList',
				action: '获取敏感词规则列表',
			},
			{
				name: '获取敏感词规则详情',
				value: 'getInterceptRule',
				action: '获取敏感词规则详情',
			},
			{
				name: '修改敏感词规则',
				value: 'updateInterceptRule',
				action: '修改敏感词规则',
			},
			{
				name: '删除敏感词规则',
				value: 'deleteInterceptRule',
				action: '删除敏感词规则',
			},
			{
				name: '上传附件资源',
				value: 'uploadAttachment',
				action: '上传附件资源',
			},
			{
				name: '获取获客链接使用详情',
				value: 'getCustomerAcquisitionQuota',
				action: '获取获客链接使用详情',
			},
			{
				name: '获取获客链接列表',
				value: 'listCustomerAcquisitionLink',
				action: '获取获客链接列表',
			},
			{
				name: '创建获客链接',
				value: 'createCustomerAcquisitionLink',
				action: '创建获客链接',
			},
			{
				name: '编辑获客链接',
				value: 'updateCustomerAcquisitionLink',
				action: '编辑获客链接',
			},
			{
				name: '删除获客链接',
				value: 'deleteCustomerAcquisitionLink',
				action: '删除获客链接',
			},
			{
				name: '获取由获客链接添加的客户信息',
				value: 'getCustomerAcquisitionCustomer',
				action: '获取由获客链接添加的客户信息',
			},
			{
				name: '获取已服务的外部联系人',
				value: 'getServedExternalContact',
				action: '获取已服务的外部联系人',
				description: '批量获取企业已服务的外部联系人',
			},
		],
		default: 'getFollowUserList',
	},
	...getFollowUserListDescription,
	...getExternalContactListDescription,
	...getExternalContactDescription,
	...batchGetExternalContactDescription,
	...updateExternalContactRemarkDescription,
	...getCorpTagListDescription,
	...addCorpTagDescription,
	...editCorpTagDescription,
	...delCorpTagDescription,
	...markTagDescription,
	...transferCustomerDescription,
	...transferResultDescription,
	...transferGroupChatDescription,
	...getUnassignedListDescription,
	...resignedTransferCustomerDescription,
	...resignedTransferResultDescription,
	...resignedTransferGroupChatDescription,
	...getGroupChatListDescription,
	...getGroupChatDescription,
	...opengidToChatidDescription,
	...addContactWayDescription,
	...getContactWayDescription,
	...updateContactWayDescription,
	...delContactWayDescription,
	...addJoinWayDescription,
	...getJoinWayDescription,
	...updateJoinWayDescription,
	...delJoinWayDescription,
	...addMomentTaskDescription,
	...cancelMomentTaskDescription,
	...getMomentTaskListDescription,
	...getMomentTaskDescription,
	...addMsgTemplateDescription,
	...remindGroupMsgSendDescription,
	...cancelGroupMsgSendDescription,
	...getGroupMsgListV2Description,
	...sendWelcomeMsgDescription,
	...addGroupWelcomeTemplateDescription,
	...editGroupWelcomeTemplateDescription,
	...getGroupWelcomeTemplateDescription,
	...delGroupWelcomeTemplateDescription,
	...getUserBehaviorDataDescription,
	...getGroupChatStatisticDescription,
	...addProductAlbumDescription,
	...getProductAlbumListDescription,
	...getProductAlbumDescription,
	...updateProductAlbumDescription,
	...deleteProductAlbumDescription,
	...addInterceptRuleDescription,
	...getInterceptRuleListDescription,
	...getInterceptRuleDescription,
	...updateInterceptRuleDescription,
	...deleteInterceptRuleDescription,
	...uploadAttachmentDescription,
	...getCustomerAcquisitionQuotaDescription,
	...listCustomerAcquisitionLinkDescription,
	...createCustomerAcquisitionLinkDescription,
	...updateCustomerAcquisitionLinkDescription,
	...deleteCustomerAcquisitionLinkDescription,
	...getCustomerAcquisitionCustomerDescription,
	...getServedExternalContactDescription,
];

