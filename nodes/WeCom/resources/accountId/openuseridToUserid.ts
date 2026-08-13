import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requirePositiveInteger, requireStringList } from './utils';

export async function openuseridToUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const sourceAgentid = requirePositiveInteger(this, this.getNodeParameter('sourceAgentid', index), '源应用 ID', index);
	const openUseridList = requireStringList(this, this.getNodeParameter('openUseridList', index), 'Open UserID 列表', index, 1000);

	const body: IDataObject = {
		open_userid_list: openUseridList,
		source_agentid: sourceAgentid,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/batch/openuserid_to_userid',
		body,
	);

	return responseData;
}
