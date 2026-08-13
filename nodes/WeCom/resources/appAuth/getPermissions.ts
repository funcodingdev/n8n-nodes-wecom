import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取应用权限详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/99052
 *
 * 用途：
 * - 获取代开发应用或第三方应用用户授权的权限详情
 * - 返回需要添加的权限列表
 *
 * 注意事项：
 * - 需要代开发自建应用access_token或第三方应用access_token
 * - 支持所有的代开发应用和第三方应用调用
 * - 应用权限为字符串类型，应用权限对应的字符串描述参考附录
 *
 * @returns 应用权限详情
 */
export async function getPermissions(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const accessToken = String(this.getNodeParameter('accessToken', index) ?? '').trim();

	if (!accessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Access Token不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/agent/get_permissions`,
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
				`获取应用权限详情失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取应用权限详情失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
