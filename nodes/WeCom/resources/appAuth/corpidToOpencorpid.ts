import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 明文corpid转换为加密corpid
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95604
 *
 * 用途：
 * - 为更好地保护企业与用户的数据，第三方应用获取的corpid不再是明文的corpid，将升级为第三方服务商级别的加密corpid
 * - 第三方可以将已有的明文corpid转换为第三方的加密corpid
 *
 * 注意事项：
 * - 需要应用服务商的provider_access_token
 * - 仅限第三方服务商，转换已获授权企业的corpid
 *
 * @returns 加密后的corpid（open_corpid）
 */
export async function corpidToOpencorpid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = String(
		this.getNodeParameter('providerAccessToken', index) ?? '',
	).trim();
	const corpid = String(this.getNodeParameter('corpid', index) ?? '').trim();

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!corpid) {
		throw new NodeOperationError(
			this.getNode(),
			'企业ID不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/corpid_to_opencorpid`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`明文corpid转换为加密corpid失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`明文corpid转换为加密corpid失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
