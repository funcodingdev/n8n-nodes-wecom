import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 设置授权配置
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90602
 *
 * 用途：
 * - 对某次授权进行配置
 * - 可支持测试模式（应用未发布时）
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - 需要先通过"获取预授权码"接口获取pre_auth_code
 * - 授权类型：0 正式授权，1 测试授权。默认值为0
 * - 请确保应用在正式发布后的授权类型为"正式授权"
 *
 * @returns 设置结果
 */
export async function setSessionInfo(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = String(this.getNodeParameter('suiteAccessToken', index) ?? '').trim();
	const preAuthCode = String(this.getNodeParameter('preAuthCode', index) ?? '').trim();
	const appidStr = this.getNodeParameter('appid', index, '') as string;
	const authType = this.getNodeParameter('authType', index, 0) as number;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!preAuthCode) {
		throw new NodeOperationError(
			this.getNode(),
			'预授权码不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		pre_auth_code: preAuthCode,
		session_info: {} as IDataObject,
	};

	if (![0, 1].includes(authType)) {
		throw new NodeOperationError(this.getNode(), '授权类型仅支持正式授权或测试授权', {
			itemIndex: index,
		});
	}

	if (appidStr && appidStr.trim()) {
		const rawAppIds = appidStr.split(/[,|\n]/).map((id) => id.trim()).filter(Boolean);
		const appidArray = rawAppIds.map((id) => Number(id));
		if (appidArray.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
			throw new NodeOperationError(this.getNode(), '允许授权的应用 ID 必须全部为正整数', {
				itemIndex: index,
			});
		}
		(body.session_info as IDataObject).appid = [...new Set(appidArray)];
	}

	(body.session_info as IDataObject).auth_type = authType;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/set_session_info`,
		qs: {
			suite_access_token: suiteAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`设置授权配置失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`设置授权配置失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
