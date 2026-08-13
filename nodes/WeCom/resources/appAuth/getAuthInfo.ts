import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取企业授权信息
 * 官方文档：https://developer.work.weixin.qq.com/document/path/100779
 *
 * 用途：
 * - 通过永久授权码换取企业微信的授权信息
 * - 永久code的获取，是通过临时授权码使用get_permanent_code接口获取到的permanent_code
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - 需要先通过"获取企业永久授权码"接口获取permanent_code和auth_corpid
 * - 推荐使用v2接口，该接口性能更好，不会获取企业微信插件关注二维码
 * - 若应用接入付费策略，接口会额外返回edition_info字段，包含企业当前生效的版本信息（付费状态、用户上限、到期时间等）
 *
 * @returns 企业授权信息（若应用接入付费策略，会额外包含edition_info字段）
 */
export async function getAuthInfo(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = String(
		this.getNodeParameter('suiteAccessToken', index) ?? '',
	).trim();
	const authCorpid = String(this.getNodeParameter('authCorpid', index) ?? '').trim();
	const permanentCode = String(this.getNodeParameter('permanentCode', index) ?? '').trim();

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!authCorpid) {
		throw new NodeOperationError(
			this.getNode(),
			'授权方企业ID不能为空',
			{ itemIndex: index },
		);
	}

	if (!permanentCode) {
		throw new NodeOperationError(
			this.getNode(),
			'永久授权码不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/v2/get_auth_info`,
		qs: {
			suite_access_token: suiteAccessToken,
		},
		body: {
			auth_corpid: authCorpid,
			permanent_code: permanentCode,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取企业授权信息失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取企业授权信息失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
