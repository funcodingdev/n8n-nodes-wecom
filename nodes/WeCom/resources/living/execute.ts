import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function parseCommaList(value: string): string[] {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

/**
 * 政民沟通（居民联系 / 巡查上报 / 居民上报）
 * 官方路径前缀：/cgi-bin/report/*
 * 文档：docs/001-企业内部开发/002-服务端API/022-政民沟通
 */
export async function executeLiving(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
				case 'addGrid': {
					// POST /cgi-bin/report/grid/add
					const grid_name = this.getNodeParameter('grid_name', i) as string;
					const grid_parent_id = this.getNodeParameter('grid_parent_id', i) as string;
					const grid_admin = this.getNodeParameter('grid_admin', i) as string;
					const grid_member = this.getNodeParameter('grid_member', i, '') as string;

					const body: IDataObject = {
						grid_name,
						grid_parent_id,
						grid_admin: parseCommaList(grid_admin),
					};
					if (grid_member) {
						body.grid_member = parseCommaList(grid_member);
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/add',
						body,
					);
					break;
				}
				case 'updateGrid': {
					// POST /cgi-bin/report/grid/update
					const grid_id = this.getNodeParameter('grid_id', i) as string;
					const grid_name = this.getNodeParameter('grid_name', i) as string;
					const grid_parent_id = this.getNodeParameter('grid_parent_id', i) as string;
					const grid_admin = this.getNodeParameter('grid_admin', i) as string;
					const grid_member = this.getNodeParameter('grid_member', i, '') as string;

					const body: IDataObject = {
						grid_id,
						grid_name,
						grid_parent_id,
						grid_admin: parseCommaList(grid_admin),
					};
					// 空字符串表示清空成员；不传则不覆盖时文档要求 grid_member 可选
					if (grid_member !== undefined && grid_member !== null) {
						body.grid_member = parseCommaList(grid_member);
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/update',
						body,
					);
					break;
				}
				case 'deleteGrid': {
					// POST /cgi-bin/report/grid/delete
					const grid_id = this.getNodeParameter('grid_id', i) as string;
					responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/report/grid/delete', {
						grid_id,
					});
					break;
				}
				case 'getGridList': {
					// POST /cgi-bin/report/grid/list
					const grid_id = this.getNodeParameter('grid_id', i, '') as string;
					const body: IDataObject = {};
					if (grid_id) {
						body.grid_id = grid_id;
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/list',
						body,
					);
					break;
				}
				case 'getUserGridList': {
					// POST /cgi-bin/report/grid/get_user_grid_info
					const userid = this.getNodeParameter('userid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/get_user_grid_info',
						{ userid },
					);
					break;
				}
				case 'addEventCategory': {
					// POST /cgi-bin/report/grid/add_cata
					const category_name = this.getNodeParameter('category_name', i) as string;
					const level = this.getNodeParameter('level', i) as number;
					const parent_category_id = this.getNodeParameter('parent_category_id', i, '') as string;

					const body: IDataObject = {
						category_name,
						level,
					};
					if (level === 2 && parent_category_id) {
						body.parent_category_id = parent_category_id;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/add_cata',
						body,
					);
					break;
				}
				case 'updateEventCategory': {
					// POST /cgi-bin/report/grid/update_cata
					const category_id = this.getNodeParameter('category_id', i) as string;
					const category_name = this.getNodeParameter('category_name', i) as string;
					const level = this.getNodeParameter('level', i) as number;
					const parent_category_id = this.getNodeParameter('parent_category_id', i, '') as string;

					const body: IDataObject = {
						category_id,
						category_name,
						level,
					};
					if (level === 2 && parent_category_id) {
						body.parent_category_id = parent_category_id;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/update_cata',
						body,
					);
					break;
				}
				case 'deleteEventCategory': {
					// POST /cgi-bin/report/grid/delete_cata
					const category_id = this.getNodeParameter('category_id', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/delete_cata',
						{ category_id },
					);
					break;
				}
				case 'getEventCategoryList': {
					// POST /cgi-bin/report/grid/list_cata
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/list_cata',
						{},
					);
					break;
				}
				case 'getInspectGridInfo': {
					// GET /cgi-bin/report/patrol/get_grid_info
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/report/patrol/get_grid_info',
					);
					break;
				}
				case 'getCorpInspectStat': {
					// POST /cgi-bin/report/patrol/get_corp_status
					const grid_id = this.getNodeParameter('grid_id', i, '') as string;
					const body: IDataObject = {};
					if (grid_id) {
						body.grid_id = grid_id;
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/patrol/get_corp_status',
						body,
					);
					break;
				}
				case 'getUserInspectStat': {
					// POST /cgi-bin/report/patrol/get_user_status
					const userid = this.getNodeParameter('userid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/patrol/get_user_status',
						{ userid },
					);
					break;
				}
				case 'getInspectCategoryStat': {
					// POST /cgi-bin/report/patrol/category_statistic
					const category_id = this.getNodeParameter('category_id', i, '') as string;
					const body: IDataObject = {};
					if (category_id) {
						body.category_id = category_id;
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/patrol/category_statistic',
						body,
					);
					break;
				}
				case 'getInspectEventList': {
					// POST /cgi-bin/report/patrol/get_order_list
					const begin_create_time = this.getNodeParameter('begin_create_time', i, 0) as number;
					const begin_modify_time = this.getNodeParameter('begin_modify_time', i, 0) as number;
					const cursor = this.getNodeParameter('cursor', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 20) as number;

					const body: IDataObject = {
						limit: limit || 20,
					};
					if (begin_create_time) {
						body.begin_create_time = begin_create_time;
					}
					if (begin_modify_time) {
						body.begin_modify_time = begin_modify_time;
					}
					if (cursor) {
						body.cursor = cursor;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/patrol/get_order_list',
						body,
					);
					break;
				}
				case 'getInspectEventDetail': {
					// POST /cgi-bin/report/patrol/get_order_info
					const order_id = this.getNodeParameter('order_id', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/patrol/get_order_info',
						{ order_id },
					);
					break;
				}
				case 'getResidentGridInfo': {
					// GET /cgi-bin/report/resident/get_grid_info
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/report/resident/get_grid_info',
					);
					break;
				}
				case 'getCorpResidentStat': {
					// POST /cgi-bin/report/resident/get_corp_status
					const grid_id = this.getNodeParameter('grid_id', i, '') as string;
					const body: IDataObject = {};
					if (grid_id) {
						body.grid_id = grid_id;
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/resident/get_corp_status',
						body,
					);
					break;
				}
				case 'getUserResidentStat': {
					// POST /cgi-bin/report/resident/get_user_status
					const userid = this.getNodeParameter('userid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/resident/get_user_status',
						{ userid },
					);
					break;
				}
				case 'getResidentCategoryStat': {
					// POST /cgi-bin/report/resident/category_statistic
					const category_id = this.getNodeParameter('category_id', i, '') as string;
					const body: IDataObject = {};
					if (category_id) {
						body.category_id = category_id;
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/resident/category_statistic',
						body,
					);
					break;
				}
				case 'getResidentEventList': {
					// POST /cgi-bin/report/resident/get_order_list
					const begin_create_time = this.getNodeParameter('begin_create_time', i, 0) as number;
					const begin_modify_time = this.getNodeParameter('begin_modify_time', i, 0) as number;
					const cursor = this.getNodeParameter('cursor', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 20) as number;

					const body: IDataObject = {
						limit: limit || 20,
					};
					if (begin_create_time) {
						body.begin_create_time = begin_create_time;
					}
					if (begin_modify_time) {
						body.begin_modify_time = begin_modify_time;
					}
					if (cursor) {
						body.cursor = cursor;
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/resident/get_order_list',
						body,
					);
					break;
				}
				case 'getResidentEventDetail': {
					// POST /cgi-bin/report/resident/get_order_info
					const order_id = this.getNodeParameter('order_id', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/resident/get_order_info',
						{ order_id },
					);
					break;
				}
				default:
					throw new Error(`未知操作: ${operation}`);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
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
