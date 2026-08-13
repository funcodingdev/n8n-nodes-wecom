import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import { requireText } from './utils';

export async function corpidToOpencorpid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = requireText(this, this.getNodeParameter('providerAccessToken', index), 'Provider Access Token', index, 2048);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);

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
				`corpid转换失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`corpid转换失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
