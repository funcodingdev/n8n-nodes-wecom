import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取第三方应用凭证
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90600
 *
 * 用途：
 * - 获取第三方应用凭证（suite_access_token）
 * - 用于调用第三方应用相关API
 *
 * 注意事项：
 * - suite_ticket由企业微信后台定时推送给"指令回调URL"，每十分钟更新一次
 * - suite_ticket实际有效期为30分钟，可以容错连续两次获取suite_ticket失败的情况
 * - 请永远使用最新接收到的suite_ticket
 * - 通过本接口获取的suite_access_token有效期为2小时，开发者需要进行缓存，不可频繁获取
 *
 * @returns 第三方应用凭证信息
 */
export async function getSuiteToken(this: IExecuteFunctions, index: number): Promise<IDataObject> {
	const suiteId = String(this.getNodeParameter('suiteId', index) ?? '').trim();
	const suiteSecret = String(this.getNodeParameter('suiteSecret', index) ?? '').trim();
	const suiteTicket = String(this.getNodeParameter('suiteTicket', index) ?? '').trim();

	if (!suiteId) {
		throw new NodeOperationError(this.getNode(), '第三方应用ID不能为空', { itemIndex: index });
	}

	if (!suiteSecret) {
		throw new NodeOperationError(this.getNode(), '第三方应用Secret不能为空', { itemIndex: index });
	}

	if (!suiteTicket) {
		throw new NodeOperationError(this.getNode(), 'Suite Ticket不能为空', { itemIndex: index });
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_suite_token`,
		body: {
			suite_id: suiteId,
			suite_secret: suiteSecret,
			suite_ticket: suiteTicket,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		// 注意：因历史原因，该接口在调用失败时才返回errcode。没返回errcode视为调用成功
		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取第三方应用凭证失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取第三方应用凭证失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
