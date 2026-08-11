import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取订单列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90600
 *
 * 用途：
 * - 服务商可以使用该接口查询指定时间段内的订单列表
 * - 支持查询正式授权和测试授权的订单
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - suite_access_token有效期为2小时
 * - start_time和end_time为必填参数
 *
 * @returns 订单列表信息
 */
function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

export async function getOrderList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = this.getNodeParameter('suiteAccessToken', index) as string;
	const startTime = dateTimeToUnixTimestamp(
		this.getNodeParameter('startTime', index) as string | number,
	);
	const endTime = dateTimeToUnixTimestamp(
		this.getNodeParameter('endTime', index) as string | number,
	);
	const testMode = this.getNodeParameter('testMode', index) as number | undefined;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!startTime) {
		throw new NodeOperationError(
			this.getNode(),
			'起始时间不能为空',
			{ itemIndex: index },
		);
	}

	if (!endTime) {
		throw new NodeOperationError(
			this.getNode(),
			'终止时间不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		start_time: startTime,
		end_time: endTime,
	};

	if (testMode !== undefined) {
		body.test_mode = testMode;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_order_list`,
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
				`获取订单列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取订单列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}