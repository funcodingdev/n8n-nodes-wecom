import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import { requireText } from './utils';

/**
 * 查询注册状态
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90582
 *
 * 用途：
 * - 查询通过注册定制化新创建的企业注册状态，企业注册成功返回注册信息
 *
 * 注意事项：
 * - 需要provider_access_token
 * - register_code生成后的查询有效期为24小时
 * - 仅支持注册完成回调事件或者获取注册码返回的register_code调用
 * - 非全新创建企业，不支持使用该接口查询，返回84024错误码
 *
 * @returns 注册状态信息（包含corpid、contact_sync、auth_user_info、state、template_id等）
 */
export async function getRegisterInfo(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = requireText(
		this,
		this.getNodeParameter('providerAccessToken', index),
		'Provider Access Token',
		index,
		2048,
	);
	const registerCode = requireText(
		this,
		this.getNodeParameter('registerCode', index),
		'注册码',
		index,
		512,
	);

	const body: IDataObject = {
		register_code: registerCode,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_register_info`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`查询注册状态失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`查询注册状态失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
