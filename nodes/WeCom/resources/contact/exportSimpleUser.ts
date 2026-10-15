import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExportSimple = {
	resource: ['contact'],
	operation: ['exportSimpleUser'],
};

export const exportSimpleUserDescription: INodeProperties[] = [
	{
		displayName: '加密密钥',
		name: 'encoding_aeskey',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForExportSimple,
		},
		default: '',
		placeholder: 'IJUiXNpvGbODwKEBSEsAeOAPAhkqHqNCF6g19t9wfg2',
		description: '用于解密导出文件的密钥：43 位 Base64 字符（解码后为 32 字节 AESKey，AES-256-CBC 加密）。从2022年8月15日10点开始，"企业管理后台 - 管理工具 - 通讯录同步"的新增IP将不能再调用此接口，企业可通过「获取成员ID列表」和「获取部门ID列表」接口获取userid和部门ID列表。<a href="https://developer.work.weixin.qq.com/document/path/94849" target="_blank">官方文档</a>',
	},
	{
		displayName: '每块数据的人员数',
		name: 'block_size',
		type: 'number',
		displayOptions: {
			show: showOnlyForExportSimple,
		},
		default: 1000000,
		typeOptions: {
			minValue: 10000,
			maxValue: 1000000,
		},
		description: '可选。每块数据的人员数，支持范围 10⁴～10⁶，默认值为 10⁶。<a href="https://developer.work.weixin.qq.com/document/path/94849" target="_blank">官方文档</a>',
	},
];
