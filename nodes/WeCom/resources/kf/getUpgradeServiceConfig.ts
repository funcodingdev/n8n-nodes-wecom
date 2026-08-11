import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['getUpgradeServiceConfig'] };

// 获取配置的专员与客户群：GET，无额外参数
export const getUpgradeServiceConfigDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'调用 GET /cgi-bin/kf/customer/get_upgrade_service_config 获取企业已配置的升级服务专员与客户群列表，无需额外参数。<a href="https://developer.work.weixin.qq.com/document/path/94674" target="_blank">官方文档</a>',
	},
];
