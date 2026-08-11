import type { INodeProperties } from 'n8n-workflow';
import {
	getExternalContactExtraHttpOpOptions,
	externalContactExtraHttpOpsDescription,
} from './extraHttpOps';
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
import { listContactWayDescription } from './listContactWay';
import { updateContactWayDescription } from './updateContactWay';
import { delContactWayDescription } from './delContactWay';
import { closeTempChatDescription } from './closeTempChat';
import { addJoinWayDescription } from './addJoinWay';
import { getJoinWayDescription } from './getJoinWay';
import { updateJoinWayDescription } from './updateJoinWay';
import { delJoinWayDescription } from './delJoinWay';
import { addMomentTaskDescription } from './addMomentTask';
import { getMomentTaskResultDescription } from './getMomentTaskResult';
import { cancelMomentTaskDescription } from './cancelMomentTask';
import { getMomentTaskListDescription } from './getMomentTaskList';
import { getMomentTaskDescription } from './getMomentTask';
import { getMomentCustomerListDescription } from './getMomentCustomerList';
import { getMomentSendResultDescription } from './getMomentSendResult';
import { getMomentCommentsDescription } from './getMomentComments';
import { listMomentStrategyDescription } from './listMomentStrategy';
import { getMomentStrategyDescription } from './getMomentStrategy';
import { getMomentStrategyRangeDescription } from './getMomentStrategyRange';
import { createMomentStrategyDescription } from './createMomentStrategy';
import { editMomentStrategyDescription } from './editMomentStrategy';
import { deleteMomentStrategyDescription } from './deleteMomentStrategy';
import { addMsgTemplateDescription } from './addMsgTemplate';
import { remindGroupMsgSendDescription } from './remindGroupMsgSend';
import { cancelGroupMsgSendDescription } from './cancelGroupMsgSend';
import { getGroupMsgListV2Description } from './getGroupMsgListV2';
import { getGroupMsgTaskDescription } from './getGroupMsgTask';
import { getGroupMsgSendResultDescription } from './getGroupMsgSendResult';
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
import { getCustomerAcquisitionStatisticDescription } from './getCustomerAcquisitionStatistic';
import { listCustomerAcquisitionLinkDescription } from './listCustomerAcquisitionLink';
import { getCustomerAcquisitionLinkDescription } from './getCustomerAcquisitionLink';
import { createCustomerAcquisitionLinkDescription } from './createCustomerAcquisitionLink';
import { updateCustomerAcquisitionLinkDescription } from './updateCustomerAcquisitionLink';
import { deleteCustomerAcquisitionLinkDescription } from './deleteCustomerAcquisitionLink';
import { getCustomerAcquisitionCustomerDescription } from './getCustomerAcquisitionCustomer';
import { getCustomerAcquisitionChatInfoDescription } from './getCustomerAcquisitionChatInfo';
import { getServedExternalContactDescription } from './getServedExternalContact';
import { createOnceKeyDescription } from './createOnceKey';
import { sendSchoolMessageCommonDescription } from './sendSchoolMessageCommon';
import { sendSchoolMessageTextDescription } from './sendSchoolMessageText';
import { sendSchoolMessageImageDescription } from './sendSchoolMessageImage';
import { sendSchoolMessageVoiceDescription } from './sendSchoolMessageVoice';
import { sendSchoolMessageVideoDescription } from './sendSchoolMessageVideo';
import { sendSchoolMessageFileDescription } from './sendSchoolMessageFile';
import { sendSchoolMessageNewsDescription } from './sendSchoolMessageNews';
import { sendSchoolMessageMpNewsDescription } from './sendSchoolMessageMpNews';
import { sendSchoolMessageMiniprogramDescription } from './sendSchoolMessageMiniprogram';

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
		options: [
			// 企业服务人员管理
			{
				name: '[服务人员管理] 获取配置了客户联系功能的成员列表',
				value: 'getFollowUserList',
				action: '获取配置了客户联系功能的成员列表',
				description: '获取配置了客户联系功能的成员列表',
			},
			// 客户管理
			{
				name: '[客户管理] 获取客户列表',
				value: 'getExternalContactList',
				action: '获取客户列表',
				description: '获取某个成员的客户列表',
			},
			{
				name: '[客户管理] 获取客户详情',
				value: 'getExternalContact',
				action: '获取客户详情',
				description: '获取外部联系人详情',
			},
			{
				name: '[客户管理] 批量获取客户详情',
				value: 'batchGetExternalContact',
				action: '批量获取客户详情',
				description: '批量获取成员的客户列表',
			},
			{
				name: '[客户管理] 修改客户备注信息',
				value: 'updateExternalContactRemark',
				action: '修改客户备注信息',
				description: '修改客户的备注信息',
			},
			// 客户标签管理
			{
				name: '[客户标签管理] 获取企业标签库',
				value: 'getCorpTagList',
				action: '获取企业标签库',
				description: '获取企业客户标签库',
			},
			{
				name: '[客户标签管理] 添加企业客户标签',
				value: 'addCorpTag',
				action: '添加企业客户标签',
				description: '创建企业客户标签',
			},
			{
				name: '[客户标签管理] 编辑企业客户标签',
				value: 'editCorpTag',
				action: '编辑企业客户标签',
				description: '编辑企业客户标签名称或次序',
			},
			{
				name: '[客户标签管理] 删除企业客户标签',
				value: 'delCorpTag',
				action: '删除企业客户标签',
				description: '删除企业客户标签',
			},
			{
				name: '[客户标签管理] 编辑客户企业标签',
				value: 'markTag',
				action: '编辑客户企业标签',
				description: '为指定的客户添加或删除企业标签',
			},
			// 在职继承
			{
				name: '[在职继承] 分配在职成员的客户',
				value: 'transferCustomer',
				action: '分配在职成员的客户',
				description: '在职成员客户转接',
			},
			{
				name: '[在职继承] 查询客户接替状态',
				value: 'transferResult',
				action: '查询客户接替状态',
				description: '查询在职成员客户接替状态',
			},
			{
				name: '[在职继承] 分配在职成员的客户群',
				value: 'transferGroupChat',
				action: '分配在职成员的客户群',
				description: '在职成员的客户群转接',
			},
			// 离职继承
			{
				name: '[离职继承] 获取待分配的离职成员列表',
				value: 'getUnassignedList',
				action: '获取待分配的离职成员列表',
				description: '获取离职成员列表',
			},
			{
				name: '[离职继承] 分配离职成员的客户',
				value: 'resignedTransferCustomer',
				action: '分配离职成员的客户',
				description: '离职成员客户转接',
			},
			{
				name: '[离职继承] 查询离职成员客户接替状态',
				value: 'resignedTransferResult',
				action: '查询离职成员客户接替状态',
				description: '查询离职成员客户接替的结果',
			},
			{
				name: '[离职继承] 分配离职成员的客户群',
				value: 'resignedTransferGroupChat',
				action: '分配离职成员的客户群',
				description: '离职成员的客户群转接',
			},
			// 客户群管理
			{
				name: '[客户群管理] 获取客户群列表',
				value: 'getGroupChatList',
				action: '获取客户群列表',
				description: '获取客户群列表',
			},
			{
				name: '[客户群管理] 获取客户群详情',
				value: 'getGroupChat',
				action: '获取客户群详情',
				description: '获取客户群的详细信息',
			},
			{
				name: '[客户群管理] 客户群Opengid转换',
				value: 'opengidToChatid',
				action: '客户群 Opengid 转换',
				description: '将客户群的opengid转换为chat_id',
			},
			// 联系我与客户入群方式
			{
				name: '[联系我方式] 配置客户联系「联系我」方式',
				value: 'addContactWay',
				action: '配置客户联系「联系我」方式',
				description: '配置「联系我」二维码和「联系我」小程序按钮',
			},
			{
				name: '[联系我方式] 获取企业已配置的「联系我」方式',
				value: 'getContactWay',
				action: '获取企业已配置的「联系我」方式',
				description: '获取企业已配置的「联系我」方式',
			},
			{
				name: '[联系我方式] 获取企业已配置的「联系我」列表',
				value: 'listContactWay',
				action: '获取企业已配置的「联系我」列表',
				description: '获取企业配置的「联系我」二维码和「联系我」小程序列表，不包含临时会话',
			},
			{
				name: '[联系我方式] 更新企业已配置的「联系我」方式',
				value: 'updateContactWay',
				action: '更新企业已配置的「联系我」方式',
				description: '更新「联系我」二维码和「联系我」小程序按钮',
			},
			{
				name: '[联系我方式] 删除企业已配置的「联系我」方式',
				value: 'delContactWay',
				action: '删除企业已配置的「联系我」方式',
				description: '删除「联系我」配置',
			},
			{
				name: '[联系我方式] 结束临时会话',
				value: 'closeTempChat',
				action: '结束临时会话',
				description: '将指定的企业成员和客户之前的临时会话断开，断开前会自动下发已配置的结束语',
			},
			// 客户群进群方式
			{
				name: '[客户群进群] 配置客户群进群方式',
				value: 'addJoinWay',
				action: '配置客户群进群方式',
				description: '配置客户群的进群方式',
			},
			{
				name: '[客户群进群] 获取客户群进群方式配置',
				value: 'getJoinWay',
				action: '获取客户群进群方式配置',
				description: '获取客户群进群方式的配置',
			},
			{
				name: '[客户群进群] 更新客户群进群方式配置',
				value: 'updateJoinWay',
				action: '更新客户群进群方式配置',
				description: '更新客户群进群方式的配置',
			},
			{
				name: '[客户群进群] 删除客户群进群方式配置',
				value: 'delJoinWay',
				action: '删除客户群进群方式配置',
				description: '删除客户群进群方式的配置',
			},
			// 客户朋友圈
			{
				name: '[客户朋友圈] 创建发表任务',
				value: 'addMomentTask',
				action: '创建发表任务',
				description: '企业和第三方应用可调用此接口创建客户朋友圈发表任务',
			},
			{
				name: '[客户朋友圈] 获取任务创建结果',
				value: 'getMomentTaskResult',
				action: '获取任务创建结果',
				description: '由于发表任务的创建是异步执行的，应用需要调用该接口以获取创建的结果',
			},
			{
				name: '[客户朋友圈] 停止发表企业朋友圈',
				value: 'cancelMomentTask',
				action: '停止发表企业朋友圈',
				description: '停止尚未发送的企业朋友圈发送任务',
			},
			{
				name: '[客户朋友圈] 获取企业全部的发表列表',
				value: 'getMomentTaskList',
				action: '获取企业全部的发表列表',
				description: '获取企业全部的发表记录',
			},
			{
				name: '[客户朋友圈] 获取客户朋友圈发表时刻的成员发送情况',
				value: 'getMomentTask',
				action: '获取客户朋友圈发表时刻的成员发送情况',
				description: '获取客户朋友圈企业发表的列表',
			},
			{
				name: '[客户朋友圈] 获取客户朋友圈发表时选择的可见范围',
				value: 'getMomentCustomerList',
				action: '获取客户朋友圈发表时选择的可见范围',
				description: '获取客户朋友圈创建时选择的客户可见范围',
			},
			{
				name: '[客户朋友圈] 获取客户朋友圈发表后的可见客户列表',
				value: 'getMomentSendResult',
				action: '获取客户朋友圈发表后的可见客户列表',
				description: '获取客户朋友圈发表后可在微信朋友圈中查看的客户列表',
			},
			{
				name: '[客户朋友圈] 获取客户朋友圈的互动数据',
				value: 'getMomentComments',
				action: '获取客户朋友圈的互动数据',
				description: '获取客户朋友圈的评论和点赞列表',
			},
			// 朋友圈规则组管理
			{
				name: '[朋友圈规则] 获取朋友圈规则组列表',
				value: 'listMomentStrategy',
				action: '获取朋友圈规则组列表',
				description: '获取企业配置的所有客户朋友圈规则组ID列表',
			},
			{
				name: '[朋友圈规则] 获取朋友圈规则组详情',
				value: 'getMomentStrategy',
				action: '获取朋友圈规则组详情',
				description: '获取某个客户朋友圈规则组的详细信息',
			},
			{
				name: '[朋友圈规则] 获取朋友圈规则组管理范围',
				value: 'getMomentStrategyRange',
				action: '获取朋友圈规则组管理范围',
				description: '获取某个朋友圈规则组管理的成员和部门列表',
			},
			{
				name: '[朋友圈规则] 创建朋友圈规则组',
				value: 'createMomentStrategy',
				action: '创建朋友圈规则组',
				description: '创建一个新的客户朋友圈规则组',
			},
			{
				name: '[朋友圈规则] 编辑朋友圈规则组',
				value: 'editMomentStrategy',
				action: '编辑朋友圈规则组',
				description: '编辑规则组的基本信息和修改客户朋友圈规则组管理范围',
			},
			{
				name: '[朋友圈规则] 删除朋友圈规则组',
				value: 'deleteMomentStrategy',
				action: '删除朋友圈规则组',
				description: '删除某个客户朋友圈规则组',
			},
			// 消息推送
			{
				name: '[消息推送] 创建企业群发',
				value: 'addMsgTemplate',
				action: '创建企业群发',
				description: '创建企业群发消息',
			},
			{
				name: '[消息推送] 提醒成员群发',
				value: 'remindGroupMsgSend',
				action: '提醒成员群发',
				description: '提醒成员进行群发消息',
			},
			{
				name: '[消息推送] 停止企业群发',
				value: 'cancelGroupMsgSend',
				action: '停止企业群发',
				description: '停止企业群发消息任务',
			},
			{
				name: '[消息推送] 获取群发记录列表',
				value: 'getGroupMsgListV2',
				action: '获取群发记录列表',
				description: '获取企业的全部群发记录',
			},
			{
				name: '[消息推送] 获取群发成员发送任务列表',
				value: 'getGroupMsgTask',
				action: '获取群发成员发送任务列表',
				description: '获取群发成员的发送任务列表',
			},
			{
				name: '[消息推送] 获取企业群发成员执行结果',
				value: 'getGroupMsgSendResult',
				action: '获取企业群发成员执行结果',
				description: '获取企业群发成员的执行结果',
			},
			{
				name: '[消息推送] 发送新客户欢迎语',
				value: 'sendWelcomeMsg',
				action: '发送新客户欢迎语',
				description: '发送新客户欢迎语消息',
			},
			{
				name: '[消息推送] 添加入群欢迎语素材',
				value: 'addGroupWelcomeTemplate',
				action: '添加入群欢迎语素材',
				description: '添加入群欢迎语模板素材',
			},
			{
				name: '[消息推送] 编辑入群欢迎语素材',
				value: 'editGroupWelcomeTemplate',
				action: '编辑入群欢迎语素材',
				description: '编辑入群欢迎语模板素材',
			},
			{
				name: '[消息推送] 获取入群欢迎语素材',
				value: 'getGroupWelcomeTemplate',
				action: '获取入群欢迎语素材',
				description: '获取入群欢迎语模板素材',
			},
			{
				name: '[消息推送] 删除入群欢迎语素材',
				value: 'delGroupWelcomeTemplate',
				action: '删除入群欢迎语素材',
				description: '删除入群欢迎语模板素材',
			},
			// 统计管理
			{
				name: '[统计管理] 获取「联系客户统计」数据',
				value: 'getUserBehaviorData',
				action: '获取「联系客户统计」数据',
				description: '获取成员联系客户的数据',
			},
			{
				name: '[统计管理] 获取「群聊数据统计」数据',
				value: 'getGroupChatStatistic',
				action: '获取「群聊数据统计」数据',
				description: '获取群聊数据统计',
			},
			// 商品图册
			{
				name: '[商品图册] 创建商品图册',
				value: 'addProductAlbum',
				action: '创建商品图册',
				description: '创建商品图册',
			},
			{
				name: '[商品图册] 获取商品图册列表',
				value: 'getProductAlbumList',
				action: '获取商品图册列表',
				description: '获取商品图册列表',
			},
			{
				name: '[商品图册] 获取商品图册',
				value: 'getProductAlbum',
				action: '获取商品图册',
				description: '获取商品图册详情',
			},
			{
				name: '[商品图册] 编辑商品图册',
				value: 'updateProductAlbum',
				action: '编辑商品图册',
				description: '编辑商品图册信息',
			},
			{
				name: '[商品图册] 删除商品图册',
				value: 'deleteProductAlbum',
				action: '删除商品图册',
				description: '删除商品图册',
			},
			// 敏感词管理
			{
				name: '[敏感词管理] 新建敏感词规则',
				value: 'addInterceptRule',
				action: '新建敏感词规则',
				description: '新建敏感词拦截规则',
			},
			{
				name: '[敏感词管理] 获取敏感词规则列表',
				value: 'getInterceptRuleList',
				action: '获取敏感词规则列表',
				description: '获取敏感词拦截规则列表',
			},
			{
				name: '[敏感词管理] 获取敏感词规则详情',
				value: 'getInterceptRule',
				action: '获取敏感词规则详情',
				description: '获取敏感词拦截规则详情',
			},
			{
				name: '[敏感词管理] 修改敏感词规则',
				value: 'updateInterceptRule',
				action: '修改敏感词规则',
				description: '修改敏感词拦截规则',
			},
			{
				name: '[敏感词管理] 删除敏感词规则',
				value: 'deleteInterceptRule',
				action: '删除敏感词规则',
				description: '删除敏感词拦截规则',
			},
			// 获客链接管理
			{
				name: '[获客链接] 查询获客助手剩余使用量',
				value: 'getCustomerAcquisitionQuota',
				action: '查询获客助手剩余使用量',
				description: '查询当前剩余的使用量，包括历史累计使用量、剩余使用量及即将过期的额度',
			},
			{
				name: '[获客链接] 查询获客链接使用详情',
				value: 'getCustomerAcquisitionStatistic',
				action: '查询获客链接使用详情',
				description: '查询指定获客链接在指定时间范围内的访问情况，包括点击链接客户数和新增客户数',
			},
			{
				name: '[获客链接] 获取获客链接列表',
				value: 'listCustomerAcquisitionLink',
				action: '获取获客链接列表',
				description: '获取当前仍然有效且是当前应用创建的获客链接',
			},
			{
				name: '[获客链接] 获取获客链接详情',
				value: 'getCustomerAcquisitionLink',
				action: '获取获客链接详情',
				description: '根据获客链接ID获取链接配置详情',
			},
			{
				name: '[获客链接] 创建获客链接',
				value: 'createCustomerAcquisitionLink',
				action: '创建获客链接',
				description: '创建新的获客链接',
			},
			{
				name: '[获客链接] 编辑获客链接',
				value: 'updateCustomerAcquisitionLink',
				action: '编辑获客链接',
				description: '编辑获客链接配置',
			},
			{
				name: '[获客链接] 删除获客链接',
				value: 'deleteCustomerAcquisitionLink',
				action: '删除获客链接',
				description: '删除获客链接',
			},
			{
				name: '[获客链接] 获取由获客链接添加的客户信息',
				value: 'getCustomerAcquisitionCustomer',
				action: '获取由获客链接添加的客户信息',
				description: '获取通过获客链接添加的客户列表',
			},
			{
				name: '[获客链接] 获取成员多次收消息详情',
				value: 'getCustomerAcquisitionChatInfo',
				action: '获取成员多次收消息详情',
				description: '获取成员多次收消息情况，如次数、客户ID等信息',
			},
			// 其他接口
			{
				name: '[其他接口] 上传附件资源',
				value: 'uploadAttachment',
				action: '上传附件资源',
				description: '上传临时附件素材',
			},
			{
				name: '[其他接口] 获取已服务的外部联系人',
				value: 'getServedExternalContact',
				action: '获取已服务的外部联系人',
				description: '批量获取企业已服务的外部联系人',
			},
			{
				name: '[其他接口] 生成代支付key',
				value: 'createOnceKey',
				action: '生成代支付key',
				description: '生成用于对应链接代支付的key，key使用一次之后失效',
			},
			{
				name: '[家校通知] 发送学校通知',
				value: 'sendSchoolMessage',
				action: '发送学校通知',
				description: '向家长或学生发送学校通知（文本、图片、文件等）',
			},
			...getExternalContactExtraHttpOpOptions(),
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
	...listContactWayDescription,
	...updateContactWayDescription,
	...delContactWayDescription,
	...closeTempChatDescription,
	...addJoinWayDescription,
	...getJoinWayDescription,
	...updateJoinWayDescription,
	...delJoinWayDescription,
	...addMomentTaskDescription,
	...getMomentTaskResultDescription,
	...cancelMomentTaskDescription,
	...getMomentTaskListDescription,
	...getMomentTaskDescription,
	...getMomentCustomerListDescription,
	...getMomentSendResultDescription,
	...getMomentCommentsDescription,
	...listMomentStrategyDescription,
	...getMomentStrategyDescription,
	...getMomentStrategyRangeDescription,
	...createMomentStrategyDescription,
	...editMomentStrategyDescription,
	...deleteMomentStrategyDescription,
	...addMsgTemplateDescription,
	...remindGroupMsgSendDescription,
	...cancelGroupMsgSendDescription,
	...getGroupMsgListV2Description,
	...getGroupMsgTaskDescription,
	...getGroupMsgSendResultDescription,
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
	...getCustomerAcquisitionStatisticDescription,
	...listCustomerAcquisitionLinkDescription,
	...getCustomerAcquisitionLinkDescription,
	...createCustomerAcquisitionLinkDescription,
	...updateCustomerAcquisitionLinkDescription,
	...deleteCustomerAcquisitionLinkDescription,
	...getCustomerAcquisitionCustomerDescription,
	...getCustomerAcquisitionChatInfoDescription,
	...getServedExternalContactDescription,
	...createOnceKeyDescription,
	...sendSchoolMessageCommonDescription,
	...sendSchoolMessageTextDescription,
	...sendSchoolMessageImageDescription,
	...sendSchoolMessageVoiceDescription,
	...sendSchoolMessageVideoDescription,
	...sendSchoolMessageFileDescription,
	...sendSchoolMessageNewsDescription,
	...sendSchoolMessageMpNewsDescription,
	...sendSchoolMessageMiniprogramDescription,
	...externalContactExtraHttpOpsDescription,
];

