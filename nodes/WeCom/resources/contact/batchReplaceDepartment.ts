import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBatchReplaceParty = {
	resource: ['contact'],
	operation: ['batchReplaceDepartment'],
};

export const batchReplaceDepartmentDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForBatchReplaceParty,
		},
		default: '',
		description: '上传的csv文件的media_ID，通过素材管理接口上传文件获得。',
		hint: '素材Media ID',
	},
	{
		displayName: '回调信息',
		name: 'callback',
		type: 'json',
		displayOptions: {
			show: showOnlyForBatchReplaceParty,
		},
		default: '{}',
		description: '回调信息。如填写该项则任务完成后，通过callback推送事件给企业。',
		hint: '回调配置JSON',
	},
];

