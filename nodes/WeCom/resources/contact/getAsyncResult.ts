import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResult = {
	resource: ['contact'],
	operation: ['getAsyncResult'],
};

export const getAsyncResultDescription: INodeProperties[] = [
	{
		displayName: '任务 ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetResult,
		},
		default: '',
		placeholder: 'xxxxx',
		description: '异步任务ID，最大长度为64字节。只能查询已经提交过的历史任务。返回结果包含任务状态（1-任务开始，2-任务进行中，3-任务已完成）、操作类型（sync_user-增量更新成员，replace_user-全量覆盖成员，replace_party-全量覆盖部门）、总条数、运行百分比和详细的处理结果。<a href="https://developer.work.weixin.qq.com/document/path/90983" target="_blank">官方文档</a>',
	},
];

