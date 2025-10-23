import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest, getAccessToken } from '../../shared/transport';

export async function executeWedoc(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

		// 管理文档
		if (operation === 'createDoc') {
			const doc_type = this.getNodeParameter('doctype', i) as number;
			const doc_name = this.getNodeParameter('doc_name', i) as string;
			const admin_users = this.getNodeParameter('admin_users', i, '') as string;
			const useSpaceId = this.getNodeParameter('useSpaceId', i, false) as boolean;

			const body: IDataObject = { doc_type, doc_name };
			if (admin_users) {
				body.admin_users = admin_users.split(',').map((id) => id.trim());
			}
			
			if (useSpaceId) {
				const spaceid = this.getNodeParameter('spaceid', i) as string;
				const fatherid = this.getNodeParameter('fatherid', i) as string;
				body.spaceid = spaceid;
				body.fatherid = fatherid;
			}

			response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_doc', body);
			} else if (operation === 'renameDoc') {
				const docid = this.getNodeParameter('docid', i) as string;
				const new_name = this.getNodeParameter('new_name', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/rename_doc', {
					docid,
					new_name,
				});
			} else if (operation === 'deleteDoc') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/del_doc', { docid });
			} else if (operation === 'getDocInfo') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_get_info', { docid });
			} else if (operation === 'shareDoc') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_share', { docid });
			}
			// 编辑文档
			else if (operation === 'modDocContent') {
				const docid = this.getNodeParameter('docid', i) as string;
				const content = this.getNodeParameter('content', i) as string;

				let parsedContent;
				try {
					parsedContent = JSON.parse(content);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `content 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc', {
					docid,
					...parsedContent,
				});
			} else if (operation === 'modSheetContent') {
				const docid = this.getNodeParameter('docid', i) as string;
				const content = this.getNodeParameter('content', i) as string;

				let parsedContent;
				try {
					parsedContent = JSON.parse(content);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `content 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/spreadsheet/batch_update', {
					docid,
					requests: parsedContent,
				});
			}
			// 智能表格操作 - 子表
			else if (operation === 'addSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const properties = this.getNodeParameter('properties', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_sheet', {
					docid,
					properties: JSON.parse(properties),
				});
			} else if (operation === 'delSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_sheet', {
					docid,
					sheet_id,
				});
			} else if (operation === 'updateSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const properties = this.getNodeParameter('properties', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_sheet', {
					docid,
					sheet_id,
					properties: JSON.parse(properties),
				});
			}
			// 智能表格操作 - 视图
			else if (operation === 'addSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const properties = this.getNodeParameter('properties', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_view', {
					docid,
					sheet_id,
					properties: JSON.parse(properties),
				});
			} else if (operation === 'delSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_view', {
					docid,
					sheet_id,
					view_id,
				});
			} else if (operation === 'updateSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i) as string;
				const properties = this.getNodeParameter('properties', i, '{}') as string;

				const body: IDataObject = { docid, sheet_id, view_id };
				if (properties && properties !== '{}') {
					body.properties = JSON.parse(properties);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_view', body);
			}
			// 智能表格操作 - 字段
			else if (operation === 'addSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const properties = this.getNodeParameter('properties', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_fields', {
					docid,
					sheet_id,
					properties: JSON.parse(properties),
				});
			} else if (operation === 'delSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const field_id = this.getNodeParameter('field_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_fields', {
					docid,
					sheet_id,
					field_ids: [field_id],
				});
			} else if (operation === 'updateSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const field_id = this.getNodeParameter('field_id', i) as string;
				const properties = this.getNodeParameter('properties', i, '{}') as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_fields', {
					docid,
					sheet_id,
					field_id,
					properties: properties !== '{}' ? JSON.parse(properties) : {},
				});
			}
			// 智能表格操作 - 记录
			else if (operation === 'addSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const records = this.getNodeParameter('records', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_records', {
					docid,
					sheet_id,
					records: JSON.parse(records),
				});
			} else if (operation === 'delSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const record_ids = this.getNodeParameter('record_ids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_records', {
					docid,
					sheet_id,
					record_ids: record_ids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'updateSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const records = this.getNodeParameter('records', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_records', {
					docid,
					sheet_id,
					records: JSON.parse(records),
				});
			}
			// 获取文档数据
			else if (operation === 'getDocData') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/document/get', { docid });
			} else if (operation === 'getSheetRange') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/spreadsheet/get_sheet_properties', { docid });
			} else if (operation === 'getSheetData') {
				const docid = this.getNodeParameter('docid', i) as string;
				const range = this.getNodeParameter('range', i, '') as string;

				const body: IDataObject = { docid };
				if (range) body.range = range;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/spreadsheet/get_sheet_range_data', body);
			}
			// 获取智能表格数据
			else if (operation === 'querySmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_sheets', { docid });
			} else if (operation === 'querySmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_views', {
					docid,
					sheet_id,
				});
			} else if (operation === 'querySmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_fields', {
					docid,
					sheet_id,
				});
			} else if (operation === 'querySmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i, '') as string;
				const filter = this.getNodeParameter('filter', i, '{}') as string;

				const body: IDataObject = { docid, sheet_id };
				if (view_id) body.view_id = view_id;
				if (filter && filter !== '{}') body.filter = JSON.parse(filter);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_records', body);
			}
			// 权限设置
			else if (operation === 'getDocAuth') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_get_auth', { docid });
			} else if (operation === 'modDocSafeRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const safe_setting = this.getNodeParameter('safe_setting', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_safe_setting', {
					docid,
					safe_setting: JSON.parse(safe_setting),
				});
			} else if (operation === 'modDocMemberRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const auth_info = this.getNodeParameter('auth_info', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_member', {
					docid,
					auth_info: JSON.parse(auth_info),
				});
			} else if (operation === 'modDocShareScope') {
				const docid = this.getNodeParameter('docid', i) as string;
				const view_rule = this.getNodeParameter('view_rule', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_join_rule', {
					docid,
					view_rule: JSON.parse(view_rule),
				});
			} else if (operation === 'manageSmartsheetAuth') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const auth_info = this.getNodeParameter('auth_info', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/set_sheet_permissions', {
					docid,
					sheet_id,
					...JSON.parse(auth_info),
				});
			}
			// 收集表
			else if (operation === 'createForm') {
				const docid = this.getNodeParameter('docid', i) as string;
				const title = this.getNodeParameter('title', i) as string;
				const form_setting = this.getNodeParameter('form_setting', i, '{}') as string;

				const body: IDataObject = { docid, title };
				if (form_setting && form_setting !== '{}') {
					body.form_setting = JSON.parse(form_setting);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_form', body);
			} else if (operation === 'modForm') {
				const formid = this.getNodeParameter('formid', i) as string;
				const form_setting = this.getNodeParameter('form_setting', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_form', {
					formid,
					form_setting: JSON.parse(form_setting),
				});
			} else if (operation === 'getFormInfo') {
				const formid = this.getNodeParameter('formid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_info', { formid });
			} else if (operation === 'getFormStatistic') {
				const formid = this.getNodeParameter('formid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_statistic', { formid });
			} else if (operation === 'getFormAnswer') {
				const formid = this.getNodeParameter('formid', i) as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const offset = this.getNodeParameter('offset', i, 0) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_answer', {
					formid,
					limit,
					offset,
				});
			}
			// 高级账号管理
			else if (operation === 'allocateAdvancedAccount') {
				const userids = this.getNodeParameter('userids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip_batch_add', {
					userids: userids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'deallocateAdvancedAccount') {
				const userids = this.getNodeParameter('userids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip_batch_del', {
					userids: userids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'getAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip_list', body);
			}
			// 素材管理
			else if (operation === 'uploadDocImage') {
				const docid = this.getNodeParameter('docid', i) as string;
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const filename = this.getNodeParameter('filename', i, '') as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const accessToken = await getAccessToken.call(this);

				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/upload_img',
					qs: {
						access_token: accessToken,
						docid,
					},
					formData: {
						media: {
							value: dataBuffer,
							options: {
								filename: filename || binaryData.fileName || 'image.jpg',
								contentType: binaryData.mimeType,
							},
						},
					},
					json: true,
				};

				response = await this.helpers.httpRequest(uploadOptions) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new Error(`企业微信 API 错误: ${response.errmsg} (错误码: ${response.errcode})`);
				}
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

