import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeContact(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getUser') {
				const userid = this.getNodeParameter('userid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/get', {}, { userid });
			} else if (operation === 'listUsers') {
				const department_id = this.getNodeParameter('department_id', i, '1') as string;
				const fetch_child = this.getNodeParameter('fetch_child', i, false) as boolean;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/simplelist',
					{},
					{
						department_id,
						fetch_child: fetch_child ? 1 : 0,
					},
				);
			} else if (operation === 'getDepartment') {
				const id = this.getNodeParameter('id', i, '') as string;
				const qs: IDataObject = {};
				if (id) {
					qs.id = id;
				}

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/list', {}, qs);
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

