import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import {
	fail,
	normalizeUserIdList,
	optionalText,
	optionalUnixSeconds,
	parseUserIdJson,
	requireCharacterText,
	requireInteger,
	requireText,
} from './utils';

function buildEventListBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = {
		limit: requireInteger(
			context,
			context.getNodeParameter('limit', itemIndex, 20),
			'每页条数',
			itemIndex,
			1,
			50,
		),
	};
	const beginCreateTime = optionalUnixSeconds(
		context,
		context.getNodeParameter('begin_create_time', itemIndex, ''),
		'创建时间起点',
		itemIndex,
	);
	const beginModifyTime = optionalUnixSeconds(
		context,
		context.getNodeParameter('begin_modify_time', itemIndex, ''),
		'修改时间起点',
		itemIndex,
	);
	const cursor = optionalText(context.getNodeParameter('cursor', itemIndex, ''));
	if (beginCreateTime !== undefined) body.begin_create_time = beginCreateTime;
	if (beginModifyTime !== undefined) body.begin_modify_time = beginModifyTime;
	if (cursor !== undefined) body.cursor = cursor;
	return body;
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
			let responseData: IDataObject;

			switch (operation) {
				case 'addGrid': {
					const body: IDataObject = {
						grid_name: requireCharacterText(
							this,
							this.getNodeParameter('grid_name', i),
							'网格名称',
							i,
							30,
						),
						grid_parent_id: requireText(
							this,
							this.getNodeParameter('grid_parent_id', i),
							'父网格 ID',
							i,
						),
						grid_admin: normalizeUserIdList(
							this,
							[
								this.getNodeParameter('grid_admin', i, ''),
								this.getNodeParameter('grid_admin_selected', i, []),
								...parseUserIdJson(
									this,
									this.getNodeParameter('gridAdminJson', i, '[]'),
									'负责人 JSON',
									i,
								),
							],
							'负责人列表',
							i,
							1,
							20,
						),
					};
					const gridMembers = normalizeUserIdList(
						this,
						[
							this.getNodeParameter('grid_member', i, ''),
							this.getNodeParameter('grid_member_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('gridMemberJson', i, '[]'),
								'网格成员 JSON',
								i,
							),
						],
						'网格成员列表',
						i,
						0,
						100,
					);
					if (gridMembers.length) body.grid_member = gridMembers;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/add',
						body,
					);
					break;
				}
				case 'updateGrid': {
					const body: IDataObject = {
						grid_id: requireText(this, this.getNodeParameter('grid_id', i), '网格 ID', i),
						grid_name: requireCharacterText(
							this,
							this.getNodeParameter('grid_name', i),
							'网格名称',
							i,
							30,
						),
						grid_parent_id: requireText(
							this,
							this.getNodeParameter('grid_parent_id', i),
							'父网格 ID',
							i,
						),
						grid_admin: normalizeUserIdList(
							this,
							[
								this.getNodeParameter('grid_admin', i, ''),
								this.getNodeParameter('grid_admin_selected', i, []),
								...parseUserIdJson(
									this,
									this.getNodeParameter('gridAdminJson', i, '[]'),
									'负责人 JSON',
									i,
								),
							],
							'负责人列表',
							i,
							1,
							20,
						),
					};
					if (this.getNodeParameter('update_grid_member', i, false) === true) {
						body.grid_member = normalizeUserIdList(
							this,
							[
								this.getNodeParameter('grid_member', i, ''),
								this.getNodeParameter('grid_member_selected', i, []),
								...parseUserIdJson(
									this,
									this.getNodeParameter('gridMemberJson', i, '[]'),
									'网格成员 JSON',
									i,
								),
							],
							'网格成员列表',
							i,
							0,
							100,
						);
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
					const deleteRoot = this.getNodeParameter('delete_root_grid', i, false) === true;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/delete',
						{
							grid_id: deleteRoot
								? ''
								: requireText(this, this.getNodeParameter('grid_id', i), '网格 ID', i),
						},
					);
					break;
				}
				case 'getGridList': {
					const body: IDataObject = {};
					const gridId = optionalText(this.getNodeParameter('grid_id', i, ''));
					if (gridId !== undefined) body.grid_id = gridId;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/list',
						body,
					);
					break;
				}
				case 'getUserGridList': {
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/get_user_grid_info',
						{
							userid: requireText(
								this,
								this.getNodeParameter('userid', i, '') ||
									this.getNodeParameter('userid_selected', i, ''),
								'成员 UserID',
								i,
							),
						},
					);
					break;
				}
				case 'addEventCategory':
				case 'updateEventCategory': {
					const level = requireInteger(
						this,
						this.getNodeParameter('level', i),
						'分类层级',
						i,
						1,
						2,
					);
					const body: IDataObject = {
						category_name: requireCharacterText(
							this,
							this.getNodeParameter('category_name', i),
							'分类名称',
							i,
							30,
						),
						level,
					};
					if (operation === 'updateEventCategory') {
						body.category_id = requireText(
							this,
							this.getNodeParameter('category_id', i),
							'分类 ID',
							i,
						);
					}
					if (level === 2) {
						body.parent_category_id = requireText(
							this,
							this.getNodeParameter('parent_category_id', i),
							'所属一级分类 ID',
							i,
						);
					}
					const path =
						operation === 'addEventCategory'
							? '/cgi-bin/report/grid/add_cata'
							: '/cgi-bin/report/grid/update_cata';
					responseData = await weComApiRequest.call(
						this,
						'POST',
						path,
						body,
					);
					break;
				}
				case 'deleteEventCategory': {
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/delete_cata',
						{
							category_id: requireText(
								this,
								this.getNodeParameter('category_id', i),
								'分类 ID',
								i,
							),
						},
					);
					break;
				}
				case 'getEventCategoryList': {
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/report/grid/list_cata',
						{},
					);
					break;
				}
				case 'getInspectGridInfo':
				case 'getResidentGridInfo': {
					const path =
						operation === 'getInspectGridInfo'
							? '/cgi-bin/report/patrol/get_grid_info'
							: '/cgi-bin/report/resident/get_grid_info';
					responseData = await weComApiRequest.call(
						this,
						'GET',
						path,
					);
					break;
				}
				case 'getCorpInspectStat':
				case 'getCorpResidentStat': {
					const path =
						operation === 'getCorpInspectStat'
							? '/cgi-bin/report/patrol/get_corp_status'
							: '/cgi-bin/report/resident/get_corp_status';
					const body: IDataObject = {};
					const gridId = optionalText(this.getNodeParameter('grid_id', i, ''));
					if (gridId !== undefined) body.grid_id = gridId;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						path,
						body,
					);
					break;
				}
				case 'getUserInspectStat':
				case 'getUserResidentStat': {
					const path =
						operation === 'getUserInspectStat'
							? '/cgi-bin/report/patrol/get_user_status'
							: '/cgi-bin/report/resident/get_user_status';
					responseData = await weComApiRequest.call(
						this,
						'POST',
						path,
						{
							userid: requireText(
								this,
								this.getNodeParameter('userid', i, '') ||
									this.getNodeParameter('userid_selected', i, ''),
								'成员 UserID',
								i,
							),
						},
					);
					break;
				}
				case 'getInspectCategoryStat':
				case 'getResidentCategoryStat': {
					const path =
						operation === 'getInspectCategoryStat'
							? '/cgi-bin/report/patrol/category_statistic'
							: '/cgi-bin/report/resident/category_statistic';
					const body: IDataObject = {};
					const categoryId = optionalText(this.getNodeParameter('category_id', i, ''));
					if (categoryId !== undefined) body.category_id = categoryId;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						path,
						body,
					);
					break;
				}
				case 'getInspectEventList':
				case 'getResidentEventList': {
					const path =
						operation === 'getInspectEventList'
							? '/cgi-bin/report/patrol/get_order_list'
							: '/cgi-bin/report/resident/get_order_list';
					responseData = await weComApiRequest.call(
						this,
						'POST',
						path,
						buildEventListBody(this, i),
					);
					break;
				}
				case 'getInspectEventDetail':
				case 'getResidentEventDetail': {
					const path =
						operation === 'getInspectEventDetail'
							? '/cgi-bin/report/patrol/get_order_info'
							: '/cgi-bin/report/resident/get_order_info';
					responseData = await weComApiRequest.call(
						this,
						'POST',
						path,
						{ order_id: requireText(this, this.getNodeParameter('order_id', i), '工单 ID', i) },
					);
					break;
				}
				default:
					fail(this, `不支持的政民沟通操作: ${operation}`, i);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
