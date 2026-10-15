import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 游标分页配置
 * - cursorParam：节点上的游标参数名
 * - nextKey：响应中下一页游标字段，默认依次尝试 next_cursor、new_next_cursor
 * - listKey：列表字段，默认取响应中唯一的顶层数组
 */
interface CursorPagination {
	cursorParam: string;
	nextKey?: string;
	listKey?: string;
}

type ResourcePagination = Record<string, CursorPagination>;

const cursor = (cursorParam = 'cursor', extra: Partial<CursorPagination> = {}): CursorPagination => ({
	cursorParam,
	...extra,
});

const ops = (names: string[], config: CursorPagination = cursor()): ResourcePagination =>
	Object.fromEntries(names.map((name) => [name, config]));

/** 支持自动翻页的列表操作（按资源分组） */
export const PAGINATED_OPERATIONS: Record<string, ResourcePagination> = {
	contact: ops(['listUserIds']),
	linkedcorp: ops(['getAppShareInfo', 'getChainInfo']),
	agent: ops(['listAppShareInfo']),
	license: ops(['listOrder', 'listOrderAccount', 'getUnionOrder', 'listActivedAccount']),
	paytool: ops(['getOrderList', 'getInvoiceList', 'getBillList']),
	externalpay: ops(['getBillList', 'getFundFlow']),
	chatdata: ops(['getAuthUserList', 'getFileArchiveAuthUserList']),
	security: ops([
		'getFileOperRecord',
		'getDeviceList',
		'getScreenOperRecord',
		'getVipList',
		'getMemberOperLog',
		'getAdminOperLog',
	]),
	meeting: {
		...ops([
			'getUserMeetings',
			'getMeetingRecords',
			'getMeetingInvitees',
			'getLiveParticipants',
			'getParticipants',
			'listRecordings',
			'getMeetingAdvancedAccountList',
			'listEnroll',
			'listRooms',
		]),
		phoneGetCalloutStatus: cursor('phone_status_cursor'),
		...ops(['webinarEnrollList', 'recordGetFileList'], cursor('webinar_cursor')),
		...ops(
			[
				'roomsListDevices',
				'roomsListControllers',
				'roomsListMeetings',
				'waitingroomUserList',
				'waitingroomCurrentUsers',
				'getQuality',
			],
			cursor('cr_cursor'),
		),
	},
	wedoc: {
		...ops(['getSmartsheetGroupChatList', 'getAdvancedAccountList']),
		// 收集表统计返回的下一页游标字段为 cursor
		getFormStatistic: cursor('cursor', { nextKey: 'cursor' }),
	},
	wefile: ops(['getVipAccountsList']),
	mail: ops(['getMailList', 'getMailAdvancedAccountList']),
	approval: {
		getApprovalSpNoList: cursor('new_cursor', { nextKey: 'new_next_cursor' }),
		advancedFeatureGetApplyIdList: cursor('af_cursor'),
	},
	journal: ops(['getRecordList']),
	externalContact: {
		...ops([
			'batchGetExternalContact',
			'transferResult',
			'getUnassignedList',
			'resignedTransferResult',
			'getGroupChatList',
			'listContactWay',
			'getMomentTaskList',
			'getMomentTask',
			'getMomentCustomerList',
			'getMomentSendResult',
			'listMomentStrategy',
			'getMomentStrategyRange',
			'getGroupMsgListV2',
			'getGroupMsgTask',
			'getGroupMsgSendResult',
			'getProductAlbumList',
			'listCustomerAcquisitionLink',
			'getCustomerAcquisitionCustomer',
			'getServedExternalContact',
		]),
		...ops(
			['externalcontactCustomerStrategyList', 'externalcontactCustomerStrategyGetRange', 'crmGetUnassignedList'],
			cursor('ec_cursor'),
		),
	},
	kf: ops(['syncMsg']),
	school: ops(['getUserLivingId']),
	living: ops(['getInspectEventList', 'getResidentEventList']),
};

/** 防止接口返回异常游标时无限翻页 */
const MAX_PAGES = 1000;

function paginationConfig(resource: string, operation: string): CursorPagination | undefined {
	return PAGINATED_OPERATIONS[resource]?.[operation];
}

/**
 * 在每个游标参数前插入“分页方式”，在其后插入“最多返回条数”；
 * 选择自动翻页时隐藏手动游标。
 */
export function withPagination(properties: INodeProperties[]): INodeProperties[] {
	const result: INodeProperties[] = [];
	for (const property of properties) {
		const show = property.displayOptions?.show;
		const resources = (show?.resource as string[] | undefined) ?? [];
		const operations = (show?.operation as string[] | undefined) ?? [];
		const paged = resources.flatMap((resource) =>
			operations.filter((operation) => paginationConfig(resource, operation)?.cursorParam === property.name),
		);
		if (!paged.length) {
			result.push(property);
			continue;
		}
		const pagedShow = { resource: resources, operation: paged };
		result.push({
			displayName: '分页方式',
			name: 'paginationMode',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: pagedShow },
			options: [
				{
					name: '单页（返回原始响应）',
					value: 'page',
					description: '只请求一次，可用返回的 next_cursor 手动翻页',
				},
				{
					name: '返回全部',
					value: 'all',
					description: '自动翻页直到取完，每条记录输出为一个 item',
				},
				{
					name: '最多返回指定条数',
					value: 'limit',
					description: '自动翻页直到达到条数上限，每条记录输出为一个 item',
				},
			],
			default: 'page',
		});
		result.push({
			...property,
			displayOptions: {
				...property.displayOptions,
				hide: { ...property.displayOptions?.hide, paginationMode: ['all', 'limit'] },
			},
		});
		result.push({
			displayName: '最多返回条数',
			name: 'maxResults',
			type: 'number',
			displayOptions: { show: { ...pagedShow, paginationMode: ['limit'] } },
			typeOptions: { minValue: 1, numberStepSize: 1 },
			default: 100,
			description: '达到该条数后停止翻页',
		});
	}
	return result;
}

function isFinished(response: IDataObject): boolean {
	const flag = (value: unknown) => value === true || value === 1 || value === '1' || value === 'true';
	if ('has_more' in response && !flag(response.has_more)) return true;
	if (flag(response.endflag) || flag(response.ending) || flag(response.is_last)) return true;
	return false;
}

function extractList(
	context: IExecuteFunctions,
	response: IDataObject,
	config: CursorPagination,
	itemIndex: number,
): IDataObject[] | undefined {
	if (config.listKey) return (response[config.listKey] as IDataObject[] | undefined) ?? [];
	const arrays = Object.keys(response).filter((key) => Array.isArray(response[key]));
	if (arrays.length === 1) return response[arrays[0]] as IDataObject[];
	if (arrays.length === 0) return undefined;
	throw new NodeOperationError(
		context.getNode(),
		`无法确定列表字段（${arrays.join('、')}），请改用“单页”分页方式`,
		{ itemIndex },
	);
}

/**
 * 自动翻页执行列表操作。非分页操作或“单页”模式返回 undefined，由调用方按原逻辑执行。
 * 每页调用原有的资源执行函数，只把游标参数替换为上一页返回的游标。
 */
export async function executeWithPagination(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	items: INodeExecutionData[],
	executor:
		| ((this: IExecuteFunctions, operation: string, items: INodeExecutionData[]) => Promise<INodeExecutionData[]>)
		| undefined,
): Promise<INodeExecutionData[] | undefined> {
	const config = paginationConfig(resource, operation);
	if (!config || !executor) return undefined;
	const mode = this.getNodeParameter('paginationMode', 0, 'page') as string;
	if (mode === 'page') return undefined;

	const returnData: INodeExecutionData[] = [];
	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		const maxResults =
			mode === 'limit' ? Number(this.getNodeParameter('maxResults', itemIndex, 100)) : Infinity;
		let nextCursor: unknown;
		const collected: IDataObject[] = [];
		const pageContext = new Proxy(this, {
			get: (target, property) => {
				if (property === 'getNodeParameter') {
					return (name: string, _index: number, fallback?: unknown, options?: IDataObject) => {
						if (name === config.cursorParam) return nextCursor ?? fallback ?? '';
						return target.getNodeParameter(name, itemIndex, fallback as never, options);
					};
				}
				const value = Reflect.get(target, property, target) as unknown;
				return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
			},
		});

		try {
			for (let page = 0; page < MAX_PAGES; page++) {
				const [result] = await executor.call(pageContext, operation, [items[itemIndex]]);
				const response = (result?.json ?? {}) as IDataObject;
				if (response.error !== undefined && response.errcode === undefined) {
					// 执行函数在 continueOnFail 时返回的错误项
					returnData.push({ json: response, pairedItem: { item: itemIndex } });
					break;
				}
				const list = extractList(this, response, config, itemIndex);
				if (!list) {
					returnData.push({ json: response, pairedItem: { item: itemIndex } });
					break;
				}
				collected.push(...list);
				const next = config.nextKey
					? response[config.nextKey]
					: (response.next_cursor ?? response.new_next_cursor);
				if (
					collected.length >= maxResults ||
					isFinished(response) ||
					next === undefined ||
					next === null ||
					next === '' ||
					next === nextCursor
				) {
					break;
				}
				nextCursor = next;
			}
		} catch (error) {
			if (!this.continueOnFail()) throw error;
			returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: itemIndex } });
			continue;
		}

		for (const entry of collected.slice(0, maxResults)) {
			const json = entry !== null && typeof entry === 'object' && !Array.isArray(entry)
				? entry
				: { value: entry as unknown };
			returnData.push({ json: json as IDataObject, pairedItem: { item: itemIndex } });
		}
	}
	return returnData;
}
