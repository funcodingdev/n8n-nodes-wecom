import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取企业凭证
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90605
 *
 * 用途：
 * - 第三方服务商在取得企业的永久授权码后，通过此接口可以获取到企业的access_token
 * - 获取后可通过通讯录、应用、消息等企业接口来运营这些应用
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - 需要先通过"获取企业永久授权码"接口获取permanent_code和auth_corpid
 * - 此处获得的企业access_token与企业获取access_token拿到的token，本质上是一样的，只不过获取方式不同
 * - 获取之后，就跟普通企业一样使用token调用API接口
 * - 注意：因历史原因，该接口在调用失败时才返回errcode。没返回errcode视为调用成功
 *
 * @returns 企业access_token信息
 */
export async function getCorpToken(
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
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_corp_token`,
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

		// 注意：因历史原因，该接口在调用失败时才返回errcode。没返回errcode视为调用成功
		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取企业凭证失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取企业凭证失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
