import type { INodeProperties } from 'n8n-workflow';

/**
 * 各资源对自建应用凭证的权限要求（来自官方文档各接口的“权限说明”）。
 * 未满足时企业微信通常返回 48002、60011、60020 等错误。
 */
const PERMISSION_NOTICES: Record<string, string> = {
	contact:
		'读取通讯录可使用任一自建应用凭证（结果受应用可见范围限制）；新增、修改、删除成员/部门/标签及管理查看权限规则，需要使用「通讯录同步」Secret 创建的凭证并开启“API 编辑通讯录”。',
	security:
		'需要将凭证对应的应用配置到「安全与管理 - 可调用接口的应用」（文件防泄漏、域名IP 等功能需在对应模块中配置）。',
	invoice: '需要使用自建应用凭证，且发票所属成员在应用可见范围内。',
	externalContact:
		'需要将凭证对应的应用配置到「客户联系 - 可调用接口的应用」，或使用「客户联系」Secret 创建凭证。',
	kf: '需要将凭证对应的应用配置到「微信客服 - 可调用接口的应用」，或使用「微信客服」Secret 创建凭证。',
	msgaudit: '需要使用「会话内容存档」Secret 创建的凭证，并在管理后台开启会话内容存档。',
	school:
		'需要将应用配置到「家校沟通 - 可调用接口的应用」；上课直播、健康上报等家校应用需分别配置到对应模块的「可调用接口的应用」。',
	living:
		'需要将应用配置到「居民联系」「居民上报」或「巡查上报」中对应模块的「可调用接口的应用」。',
	mail: '需要将应用配置到「协作 - 邮件 - 可调用接口的应用」。',
	wedoc: '需要将应用配置到「协作 - 文档 - 可调用接口的应用」。',
	calendar: '需要将应用配置到「协作 - 日程 - 可调用接口的应用」。',
	todo: '调用应用的可见范围需要包含根部门。',
	meeting: '需要将应用配置到「协作 - 会议 - 可调用接口的应用」。',
	wefile: '需要将应用配置到「协作 - 微盘 - 可调用接口的应用」。',
	live: '需要将应用配置到「直播 - 可调用接口的应用」。',
	phone: '需要将应用配置到「公费电话 - 可调用接口的应用」。',
	checkin: '需要将应用配置到「打卡 - 可调用接口的应用」。',
	approval:
		'需要将应用配置到「审批 - 可调用接口的应用」；提交审批还需在「审批 - API - 审批数据权限」中授权该应用。',
	journal: '需要将应用配置到「汇报 - 可调用接口的应用」。',
	hr: '需要将应用配置到「人事助手 - 可调用接口的应用」。',
	meetingroom: '需要将应用配置到「会议室 - 可调用接口的应用」。',
	emergency: '需要将应用配置到「紧急通知 - 可调用接口的应用」。',
};

/** 在每个资源的“操作”下拉框之后插入权限提示 */
export function withPermissionNotices(properties: INodeProperties[]): INodeProperties[] {
	const result: INodeProperties[] = [];
	for (const property of properties) {
		result.push(property);
		const resources = property.displayOptions?.show?.resource as string[] | undefined;
		if (property.name !== 'operation' || resources?.length !== 1) continue;
		const notice = PERMISSION_NOTICES[resources[0]];
		if (!notice) continue;
		result.push({
			displayName: notice,
			name: `${resources[0]}PermissionNotice`,
			type: 'notice',
			displayOptions: { show: { resource: resources } },
			default: '',
		});
	}
	return result;
}
