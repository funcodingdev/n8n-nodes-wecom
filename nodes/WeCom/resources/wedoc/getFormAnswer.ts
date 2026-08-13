import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getFormAnswer'] };
export const getFormAnswerDescription: INodeProperties[] = [
	{ displayName: '收集表周期ID', name: 'repeated_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '操作的收集表周期repeated_id。收集表周期ID', placeholder: '收集表周期ID' },
	{
		displayName: '答案ID列表',
		name: 'answer_ids',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'需要拉取的答案列表，多个ID用英文逗号分隔；与下方 JSON 合并去重，批次大小最大100',
		placeholder: '1,2,3',
	},
	{
		displayName: '答案ID列表 JSON',
		name: 'answerIdsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 [1,2] 或 [{"answer_id":1}]',
	},
];
