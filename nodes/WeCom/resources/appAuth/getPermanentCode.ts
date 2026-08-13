import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取企业永久授权码
 * 官方文档：https://developer.work.weixin.qq.com/document/path/100776
 *
 * 用途：
 * - 使用临时授权码换取授权方的永久授权码以及企业信息
 * - 临时授权码一次有效
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - 临时授权码会在授权成功时附加在redirect_uri中跳转回第三方服务商网站，或通过授权成功通知回调推送给服务商
 * - 临时授权码长度为64至512个字节，一次有效
 * - 推荐使用v2接口，该接口耗时更短
 * - 若应用接入付费策略，接口会额外返回edition_info字段，包含企业当前生效的版本信息（付费状态、用户上限、到期时间等）
 *
 * @returns 永久授权码和企业信息（若应用接入付费策略，会额外包含edition_info字段）
 */
export async function getPermanentCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = String(this.getNodeParameter('suiteAccessToken', index) ?? '').trim();
	const authCode = String(this.getNodeParameter('authCode', index) ?? '').trim();

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!authCode) {
		throw new NodeOperationError(
			this.getNode(),
			'临时授权码不能为空',
			{ itemIndex: index },
		);
	}
	const authCodeBytes = Buffer.byteLength(authCode, 'utf8');
	if (authCodeBytes < 64 || authCodeBytes > 512) {
		throw new NodeOperationError(
			this.getNode(),
			'临时授权码长度必须为 64–512 个字节',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/v2/get_permanent_code`,
		qs: {
			suite_access_token: suiteAccessToken,
		},
		body: {
			auth_code: authCode,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取企业永久授权码失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取企业永久授权码失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
