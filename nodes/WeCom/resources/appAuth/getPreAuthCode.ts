import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取预授权码
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90601
 *
 * 用途：
 * - 获取预授权码
 * - 预授权码用于企业授权时的第三方服务商安全验证
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - suite_access_token有效期为2小时
 * - 预授权码有效期为1200秒（20分钟）
 *
 * @returns 预授权码信息
 */
export async function getPreAuthCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = String(
		this.getNodeParameter('suiteAccessToken', index) ?? '',
	).trim();

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_pre_auth_code`,
		qs: {
			suite_access_token: suiteAccessToken,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取预授权码失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取预授权码失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
