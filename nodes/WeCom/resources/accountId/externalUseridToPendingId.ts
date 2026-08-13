import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { mergeStringListWithJson, optionalText } from './utils';

export async function externalUseridToPendingId(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalUserid = mergeStringListWithJson(
		this,
		this.getNodeParameter('externalUserid', index),
		this.getNodeParameter('externalUseridJson', index, '[]'),
		'External UserID 列表',
		index,
		100,
		['external_userid', 'externalUserid', 'userid', 'id'],
	);
	const chatId = optionalText(this, this.getNodeParameter('chatId', index, ''), '客户群 ID', index);

	const body: IDataObject = {
		external_userid: externalUserid,
	};

	if (chatId) {
		body.chat_id = chatId;
	}

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/batch/external_userid_to_pending_id',
		body,
	);

	return responseData;
}
