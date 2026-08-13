import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 延长试用期
 * 官方文档：https://developer.work.weixin.qq.com/document/path/91913
 *
 * 用途：
 * - 服务商可以使用该接口延长应用的试用期
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - suite_access_token有效期为2小时
 * - 一个应用可以多次延长试用，但是试用总天数不能超过60天
 * - 仅限时试用或试用过期状态下的应用可以延长试用期
 *
 * @returns 延长后的试用到期时间
 */
export async function prolongTry(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = String(this.getNodeParameter('suiteAccessToken', index) ?? '').trim();
	const buyerCorpid = String(this.getNodeParameter('buyerCorpid', index) ?? '').trim();
	const prolongDays = Number(this.getNodeParameter('prolongDays', index));
	const includeAppid = this.getNodeParameter('includeAppid', index, false) as boolean;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!buyerCorpid) {
		throw new NodeOperationError(
			this.getNode(),
			'购买方corpid不能为空',
			{ itemIndex: index },
		);
	}

	if (!Number.isSafeInteger(prolongDays) || prolongDays < 1 || prolongDays > 60) {
		throw new NodeOperationError(
			this.getNode(),
			'延长天数必须是 1–60 的整数',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		buyer_corpid: buyerCorpid,
		prolong_days: prolongDays,
	};

	if (includeAppid) {
		const appid = Number(this.getNodeParameter('appid', index));
		if (!Number.isSafeInteger(appid) || appid <= 0) {
			throw new NodeOperationError(this.getNode(), '旧套件应用 ID 必须是正整数', {
				itemIndex: index,
			});
		}
		body.appid = appid;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/prolong_try`,
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
				`延长试用期失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`延长试用期失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
