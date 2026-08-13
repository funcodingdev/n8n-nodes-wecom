import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import { requireText } from './utils';

/**
 * 设置通讯录同步完成
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90584
 *
 * 用途：
 * - 设置通讯录同步完成，解除通讯录锁定状态，同时使通讯录迁移access_token失效
 *
 * 注意事项：
 * - 需要使用查询注册状态接口返回的access_token
 * - 调用该接口后，通讯录迁移access_token将失效
 * - 解除通讯录锁定状态后，不能再调用设置授权应用可见范围接口
 *
 * @returns 操作结果
 */
export async function setContactSyncSuccess(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const accessToken = requireText(
		this,
		this.getNodeParameter('accessToken', index),
		'Access Token',
		index,
		2048,
	);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/sync/contact_sync_success`,
		qs: {
			access_token: accessToken,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`设置通讯录同步完成失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`设置通讯录同步完成失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
