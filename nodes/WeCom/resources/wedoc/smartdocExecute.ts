import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError, sleep } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const SMARTDOC_API = '/cgi-bin/wedoc/smartdoc';
const LIST_SEPARATOR = /[,，|\n\r]+/;
const BLOCK_TYPES = new Set([
	'BLOCK_TYPE_TEXT', 'BLOCK_TYPE_HEADER_1', 'BLOCK_TYPE_HEADER_2', 'BLOCK_TYPE_HEADER_3',
	'BLOCK_TYPE_HEADER_4', 'BLOCK_TYPE_HEADER_5', 'BLOCK_TYPE_HEADER_6', 'BLOCK_TYPE_IMAGE',
	'BLOCK_TYPE_TODO', 'BLOCK_TYPE_NUMBERED_LIST', 'BLOCK_TYPE_BULLETED_LIST', 'BLOCK_TYPE_DIVIDER',
	'BLOCK_TYPE_LINK', 'BLOCK_TYPE_COLUMN_LIST', 'BLOCK_TYPE_HIGHLIGHT', 'BLOCK_TYPE_FILE',
	'BLOCK_TYPE_VIEW', 'BLOCK_TYPE_TABLE', 'BLOCK_TYPE_CODE', 'BLOCK_TYPE_QUOTE',
]);
/** 导出任务轮询：每 2 秒一次，最多等待 60 秒 */
const EXPORT_POLL_INTERVAL = 2000;
const EXPORT_POLL_TIMES = 30;

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(context: IExecuteFunctions, name: string, label: string, itemIndex: number, required = true): string {
	const value = String(context.getNodeParameter(name, itemIndex, '') ?? '').trim();
	if (required && !value) fail(context, `${label}不能为空`, itemIndex);
	return value;
}

function idList(context: IExecuteFunctions, name: string, label: string, itemIndex: number, required: boolean): string[] {
	const raw = context.getNodeParameter(name, itemIndex, '') as string | string[];
	const ids = [...new Set((Array.isArray(raw) ? raw : String(raw ?? '').split(LIST_SEPARATOR))
		.map((id) => String(id).trim())
		.filter(Boolean))];
	if (required && !ids.length) fail(context, `${label}不能为空`, itemIndex);
	return ids;
}

function blockList(context: IExecuteFunctions, itemIndex: number, isUpdate: boolean): IDataObject[] {
	const raw = context.getNodeParameter('blocks_json', itemIndex, '[]');
	let blocks: unknown;
	try {
		blocks = typeof raw === 'string' ? JSON.parse(raw) : raw;
	} catch (error) {
		fail(context, `内容块列表必须是有效的 JSON 数组：${(error as Error).message}`, itemIndex);
	}
	if (!Array.isArray(blocks) || !blocks.length) fail(context, '内容块列表必须是非空 JSON 数组', itemIndex);
	return (blocks as unknown[]).map((block, index) => {
		if (!block || typeof block !== 'object' || Array.isArray(block)) {
			fail(context, `第 ${index + 1} 个内容块必须是对象`, itemIndex);
		}
		const info = block as IDataObject;
		if (isUpdate && !String(info.id ?? '').trim()) fail(context, `第 ${index + 1} 个内容块缺少 id`, itemIndex);
		if (!isUpdate && !info.type) fail(context, `第 ${index + 1} 个内容块缺少 type`, itemIndex);
		if (info.type !== undefined && !BLOCK_TYPES.has(String(info.type))) {
			fail(context, `第 ${index + 1} 个内容块的 type 不受支持：${String(info.type)}`, itemIndex);
		}
		return info;
	});
}

function publishBody(context: IExecuteFunctions, docid: string, itemIndex: number): IDataObject {
	const publish_range = Number(context.getNodeParameter('publish_range', itemIndex, 1));
	const body: IDataObject = { docid, publish_range };
	if (publish_range === 4) {
		const collection = context.getNodeParameter('publish_auth_list', itemIndex, {}) as IDataObject;
		const items = Array.isArray(collection.items) ? collection.items as IDataObject[] : [];
		if (!items.length) fail(context, '指定成员可见时至少需要添加一个成员或部门', itemIndex);
		body.auth_list = items.map((item) => {
			const type = Number(item.type ?? 1);
			if (type === 1) {
				const userid = String(item.userid ?? '').trim();
				if (!userid) fail(context, '可见成员的 UserID 不能为空', itemIndex);
				return { type, userid };
			}
			const departmentid = Number(item.departmentid);
			if (!Number.isInteger(departmentid) || departmentid < 1) fail(context, '可见部门 ID 必须是正整数', itemIndex);
			return { type, departmentid };
		});
	}
	return body;
}

/**
 * 智能文档内容管理
 * 官方文档：https://developer.work.weixin.qq.com/document/path/101619
 */
export async function executeSmartdocOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	const post = async (path: string, body: IDataObject, option: IDataObject = {}) =>
		await weComApiRequest.call(this, 'POST', `${SMARTDOC_API}/${path}`, body, {}, {}, option);

	if (operation === 'smartdocGetExportResult') {
		// /cgi-bin/wedoc/smartdoc/get_export_result
		return await post('get_export_result', { task_id: text(this, 'task_id', '任务 ID', i) });
	}

	const docid = text(this, 'docid', '文档 ID', i);
	switch (operation) {
		case 'smartdocGetPageHierarchy':
			// /cgi-bin/wedoc/smartdoc/get_page_hierarchy
			return await post('get_page_hierarchy', { docid });
		case 'smartdocAddPage':
		case 'smartdocUpdatePage': {
			// /cgi-bin/wedoc/smartdoc/add_page、/cgi-bin/wedoc/smartdoc/update_page
			const info: IDataObject = {};
			if (operation === 'smartdocUpdatePage') info.page_id = text(this, 'page_id', '页面 ID', i);
			const title = text(this, 'page_title', '页面标题', i, false);
			const parentId = text(this, 'page_parent_id', '父页面 ID', i, false);
			const afterId = text(this, 'page_after_id', '排序位置', i, false);
			const layoutMode = Number(this.getNodeParameter('layout_mode', i, 0));
			if (title) info.title = title;
			if (parentId) info.parent_id = parentId;
			if (afterId) info.after_id = afterId;
			if (layoutMode) info.layout_mode = layoutMode;
			if (operation === 'smartdocUpdatePage' && Object.keys(info).length === 1) {
				fail(this, '请至少填写一项需要更新的页面信息', i);
			}
			return await post(operation === 'smartdocAddPage' ? 'add_page' : 'update_page', { docid, info });
		}
		case 'smartdocDeletePage':
			// /cgi-bin/wedoc/smartdoc/delete_page
			return await post('delete_page', { docid, page_id: text(this, 'page_id', '页面 ID', i) });
		case 'smartdocGetBlockList': {
			// /cgi-bin/wedoc/smartdoc/get_block_list
			const body: IDataObject = {
				docid,
				page_id: text(this, 'page_id', '页面 ID', i),
				start: Number(this.getNodeParameter('start', i, 0)),
				limit: Number(this.getNodeParameter('limit', i, 50)),
			};
			const ids = idList(this, 'block_ids', '内容块 ID 列表', i, false);
			if (ids.length) body.ids = ids;
			return await post('get_block_list', body);
		}
		case 'smartdocAddBlocks':
		case 'smartdocUpdateBlocks':
			// /cgi-bin/wedoc/smartdoc/add_blocks、/cgi-bin/wedoc/smartdoc/update_blocks
			return await post(operation === 'smartdocAddBlocks' ? 'add_blocks' : 'update_blocks', {
				docid,
				page_id: text(this, 'page_id', '页面 ID', i),
				blocks: blockList(this, i, operation === 'smartdocUpdateBlocks'),
			});
		case 'smartdocDeleteBlocks':
			// /cgi-bin/wedoc/smartdoc/delete_blocks
			return await post('delete_blocks', {
				docid,
				page_id: text(this, 'page_id', '页面 ID', i),
				ids: idList(this, 'block_ids', '内容块 ID 列表', i, true),
			});
		case 'smartdocExport': {
			// /cgi-bin/wedoc/smartdoc/export_task
			const body: IDataObject = { docid, content_type: 1 };
			const pageId = text(this, 'export_page_id', '导出范围页面 ID', i, false);
			if (pageId) body.page_id = pageId;
			const task = await post('export_task', body);
			if (!this.getNodeParameter('wait_for_export', i, true)) return task;
			const task_id = String(task.task_id ?? '');
			if (!task_id) fail(this, '导出任务未返回 task_id', i);
			for (let attempt = 0; attempt < EXPORT_POLL_TIMES; attempt++) {
				await sleep(EXPORT_POLL_INTERVAL);
				const result = await post('get_export_result', { task_id });
				if (result.task_done === true) return { task_id, ...result };
			}
			return { task_id, task_done: false };
		}
		case 'smartdocGetSmartsheetInfo':
			// /cgi-bin/wedoc/smartdoc/get_smartsheet_info
			return await post('get_smartsheet_info', { docid });
		case 'smartdocAddSmartsheet':
		case 'smartdocUpdateSmartsheet': {
			// /cgi-bin/wedoc/smartdoc/add_smartsheet、/cgi-bin/wedoc/smartdoc/update_smartsheet
			const info: IDataObject = {};
			if (operation === 'smartdocUpdateSmartsheet') info.block_id = text(this, 'sheet_block_id', '数据表 Block ID', i);
			const title = text(this, 'sheet_title', '数据表标题', i, false);
			const afterId = text(this, 'sheet_after_id', '排序位置', i, false);
			if (title) info.title = title;
			if (afterId) info.after_id = afterId;
			return await post(operation === 'smartdocAddSmartsheet' ? 'add_smartsheet' : 'update_smartsheet', { docid, info });
		}
		case 'smartdocDeleteSmartsheet':
			// /cgi-bin/wedoc/smartdoc/delete_smartsheet
			return await post('delete_smartsheet', { docid, block_id: text(this, 'sheet_block_id', '数据表 Block ID', i) });
		case 'smartdocPublish':
			// /cgi-bin/wedoc/smartdoc/publish（官方提示耗时 3-8 秒）
			return await post('publish', publishBody(this, docid, i), { timeout: 30000 });
		case 'smartdocCancelPublish':
			// /cgi-bin/wedoc/smartdoc/cancel_publish
			return await post('cancel_publish', { docid });
		case 'smartdocPublishSetting':
			// /cgi-bin/wedoc/smartdoc/publish_setting
			return await post('publish_setting', publishBody(this, docid, i));
		default:
			return fail(this, `不支持的智能文档操作：${operation}`, i);
	}
}
