import type { INodeProperties } from 'n8n-workflow';

/**
 * 查询异步任务结果参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/96219
 *
 * 通过 jobid 查询异步上传任务的结果
 * 返回值中 status: 1-处理中，2-完成，3-异常失败
 *
 * 任务结果常见错误码（detail.errcode）：
 * - 830001: url非法，确认url是否支持Range分块下载
 * - 830003: url下载数据失败，确认url本身是否能正常访问
 * - 45001: 文件大小超过限制，确认文件在5字节~200M范围内
 * - 301019: 文件MD5不匹配，确认url对应的文件内容md5是否一致
 */

const showOnlyForGetUploadByUrlResult = {
	resource: ['material'],
	operation: ['getUploadByUrlResult'],
};

export const getUploadByUrlResultDescription: INodeProperties[] = [
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUploadByUrlResult,
		},
		default: '',
		description: '异步上传任务返回的 jobid，最长 128 字节且 60 分钟内有效。status：1-处理中，2-完成，3-异常失败',
		placeholder: 'jobid_S0MrnndvRG5fadSlLwiBqiDDbM143UqTmKP3152FZk4',
	},
];
