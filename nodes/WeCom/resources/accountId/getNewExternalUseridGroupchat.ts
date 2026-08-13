import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireStringList, requireText } from './utils';

export async function getNewExternalUseridGroupchat(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const chatId = requireText(this, this.getNodeParameter('chatId', index), '客户群 ID', index);
	const externalUseridList = requireStringList(this, this.getNodeParameter('externalUseridList', index), 'External UserID 列表', index, 1000);

	const body: IDataObject = {
		chat_id: chatId,
		external_userid_list: externalUseridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/externalcontact/groupchat/get_new_external_userid',
		body,
	);

	return responseData;
}
