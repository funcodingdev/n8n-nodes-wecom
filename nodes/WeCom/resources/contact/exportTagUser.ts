import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExportTag = {
	resource: ['contact'],
	operation: ['exportTagUser'],
};

export const exportTagUserDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		displayOptions: {
			show: showOnlyForExportTag,
		},
		default: '',
		placeholder: '1',
		description: '需要导出的标签ID。要求对标签有读取权限。<a href="https://developer.work.weixin.qq.com/document/path/94853" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '标签(选择)',
		name: 'tagid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTags' },
		default: '',
		displayOptions: {
			show: showOnlyForExportTag,
		},
		description: '与上方标签 ID 二选一；均填写时以字符串为准',
	},
	{
		displayName: '加密密钥',
		name: 'encoding_aeskey',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForExportTag,
		},
		default: '',
		placeholder: 'IJUiXNpvGbODwKEBSEsAeOAPAhkqHqNCF6g19t9wfg2',
		description: 'Base64编码后的加密密钥。长度固定为43，从a-z, A-Z, 0-9共62个字符中选取，是AESKey的Base64编码。解码后即为32字节长的AESKey。加密方式采用AES-256-CBC方式，数据采用PKCS#7填充至32字节的倍数；IV初始向量大小为16字节，取AESKey前16字节。<a href="https://developer.work.weixin.qq.com/document/path/94853" target="_blank">官方文档</a>',
	},
	{
		displayName: '每块数据的人员数和部门数之和',
		name: 'block_size',
		type: 'number',
		displayOptions: {
			show: showOnlyForExportTag,
		},
		default: 1000000,
		typeOptions: {
			minValue: 10000,
			maxValue: 1000000,
		},
		description: '可选。每块数据的人员数和部门数之和，支持范围 10⁴～10⁶，默认值为 10⁶。<a href="https://developer.work.weixin.qq.com/document/path/94853" target="_blank">官方文档</a>',
	},
];
