import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

export async function executeTodo(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const todo_id = String(this.getNodeParameter('todo_id', i, '') ?? '').trim();
			if (!todo_id) fail(this, '待办 ID 不能为空', i);
			let response: IDataObject;

			if (operation === 'getTodo') {
				// https://developer.work.weixin.qq.com/document/path/101524
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/todo/get', { todo_id });
			} else if (operation === 'updateTodo') {
				// https://developer.work.weixin.qq.com/document/path/101534
				const body: IDataObject = { todo_id };
				const status = Number(this.getNodeParameter('todo_status', i, -1));
				if (status === 0 || status === 1) body.status = status;
				const collection = this.getNodeParameter('todo_attendees', i, {}) as IDataObject;
				const attendees = Array.isArray(collection.attendees) ? collection.attendees as IDataObject[] : [];
				if (attendees.length > 20) fail(this, '参与人最多 20 个', i);
				if (attendees.length) {
					body.attendees = attendees.map((attendee) => {
						const userid = String(attendee.userid ?? '').trim();
						if (!userid) fail(this, '参与人 UserID 不能为空', i);
						return { userid, status: Number(attendee.status ?? 1) };
					});
				}
				if (body.status === undefined && !body.attendees) {
					fail(this, '请至少修改待办整体状态或参与人', i);
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/todo/update', body);
			} else {
				fail(this, `不支持的待办操作：${operation}`, i);
			}

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
