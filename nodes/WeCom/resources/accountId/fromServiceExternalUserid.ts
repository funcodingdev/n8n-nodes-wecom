import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requirePositiveInteger, requireText } from './utils';

export async function fromServiceExternalUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const sourceAgentid = requirePositiveInteger(this, this.getNodeParameter('sourceAgentid', index), '源应用 ID', index);
	const externalUserid = requireText(this, this.getNodeParameter('externalUserid', index), 'External UserID', index);

	const body: IDataObject = {
		external_userid: externalUserid,
		source_agentid: sourceAgentid,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/externalcontact/from_service_external_userid',
		body,
	);

	return responseData;
}
