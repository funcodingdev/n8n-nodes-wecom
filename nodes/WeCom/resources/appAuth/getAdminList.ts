import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取应用管理员列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/100073
 *
 * 用途：
 * - 第三方服务商可以用此接口获取授权企业中某个第三方应用或者代开发应用的管理员列表
 * - 不包括外部管理员
 * - 服务商在用户进入应用主页之后根据是否管理员身份做权限的区分
 *
 * 注意事项：
 * - 需要代开发自建应用access_token或第三方应用access_token
 * - 成员授权模式下，不返回管理员列表
 * - 旧的使用suite_access_token获取管理员的方式已不再维护，建议使用当前新的接口
 *
 * @returns 应用管理员列表
 */
export async function getAdminList(
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
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/agent/get_admin_list`,
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
				`获取应用管理员列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取应用管理员列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
