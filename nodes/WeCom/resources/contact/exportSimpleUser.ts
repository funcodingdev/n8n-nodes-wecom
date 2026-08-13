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
		description: 'Base64编码后的加密密钥。长度固定为43，从a-z, A-Z, 0-9共62个字符中选取，是AESKey的Base64编码。解码后即为32字节长的AESKey。加密方式采用AES-256-CBC方式，数据采用PKCS#7填充至32字节的倍数；IV初始向量大小为16字节，取AESKey前16字节。从2022年8月15日10点开始，"企业管理后台 - 管理工具 - 通讯录同步"的新增IP将不能再调用此接口，企业可通过「获取成员ID列表」和「获取部门ID列表」接口获取userid和部门ID列表。<a href="https://developer.work.weixin.qq.com/document/path/94849" target="_blank">官方文档</a>',
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
