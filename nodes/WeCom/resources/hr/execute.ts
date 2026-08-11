import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

export async function executeHr(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject;

			if (operation === 'getFieldList') {
				// 获取员工字段配置
				responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/hr/get_fields', {});
			} else if (operation === 'getStaffInfo') {
				// 获取员工花名册信息
				const userid = this.getNodeParameter('userid', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/hr/get_staff_info', {
					userid,
				});
			} else if (operation === 'updateStaffInfo') {
				// 更新员工花名册信息
				const userid = this.getNodeParameter('userid', i) as string;
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				// 构建更新字段
				const update_attrs: IDataObject[] = [];
				if (fieldsCollection.fields) {
					const fieldsList = fieldsCollection.fields as IDataObject[];
					fieldsList.forEach((field) => {
						const attr: IDataObject = { fieldid: field.fieldid };

						// 根据值类型设置不同的值字段
						const valueType = field.value_type as string;
						if (valueType === 'text') {
							attr.value_string = field.value_text;
						} else if (valueType === 'date') {
							const ts = dateTimeToUnixTimestamp(field.value_date as string | number);
							if (ts) attr.value_uint32 = ts;
						} else if (valueType === 'number') {
							attr.value_uint32 = field.value_number;
						}

						update_attrs.push(attr);
					});
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/hr/update_staff_info', {
					userid,
					update_attrs,
				});
			} else {
				responseData = {};
			}

			returnData.push({
				json: responseData || {},
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
