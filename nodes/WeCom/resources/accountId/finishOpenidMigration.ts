import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import { requireStringList, requireText } from './utils';

export async function finishOpenidMigration(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = requireText(this, this.getNodeParameter('providerAccessToken', index), 'Provider Access Token', index, 2048);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const rawOpenidType = requireStringList(this, this.getNodeParameter('openidType', index), 'ID 类型', index, 2);
	const openidType = [...new Set(rawOpenidType.map(Number))];
	if (openidType.some((value) => ![1, 3].includes(value))) {
		throw new NodeOperationError(this.getNode(), 'ID 类型只能是 1 或 3', { itemIndex: index });
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/finish_openid_migration`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
			openid_type: openidType,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`ID迁移完成状态设置失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`ID迁移完成状态设置失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
