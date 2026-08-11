import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
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

export async function executeJournal(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			if (operation === 'getRecordList') {
				// 批量获取汇报记录单号
				// https://developer.work.weixin.qq.com/document/path/93393
				const starttime = dateTimeToUnixTimestamp(
					this.getNodeParameter('starttime', i) as string | number,
				);
				const endtime = dateTimeToUnixTimestamp(
					this.getNodeParameter('endtime', i) as string | number,
				);
				const cursor = this.getNodeParameter('cursor', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const enableFilters = this.getNodeParameter('enableFilters', i, false) as boolean;

				const body: { starttime: number; endtime: number; cursor: number; limit: number; filters?: Array<{ key: string; value: string }> } = {
					starttime,
					endtime,
					cursor,
					limit,
				};

				if (enableFilters) {
					const filtersCollection = this.getNodeParameter('filtersCollection', i, {}) as { filters?: Array<{ key: string; value: string }> };
					if (filtersCollection.filters && filtersCollection.filters.length > 0) {
						body.filters = filtersCollection.filters.map((f) => ({ key: f.key, value: f.value }));
					}
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/journal/get_record_list', body);
			} else if (operation === 'getRecordDetail') {
				// 获取汇报记录详情
				// https://developer.work.weixin.qq.com/document/path/93394
				const journalid = this.getNodeParameter('journalid', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/journal/get_record_detail', {
					journalid,
				});
			} else if (operation === 'getStatistics') {
				// 获取汇报统计数据
				// https://developer.work.weixin.qq.com/document/path/93395
				const template_type = this.getNodeParameter('template_type', i) as number;
				const starttime = dateTimeToUnixTimestamp(
					this.getNodeParameter('starttime', i) as string | number,
				);
				const endtime = dateTimeToUnixTimestamp(
					this.getNodeParameter('endtime', i) as string | number,
				);
				const useridlist = this.getNodeParameter('useridlist', i, '') as string;

				const body: {
					template_type: number;
					starttime: number;
					endtime: number;
					useridlist?: string[];
				} = {
					template_type,
					starttime,
					endtime,
				};

				if (useridlist) {
					body.useridlist = useridlist.split(',').map((id) => id.trim());
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/journal/get_stat_list', body);
			} else if (operation === 'downloadFile') {
				// 下载汇报中的微盘文件
				// https://developer.work.weixin.qq.com/document/path/98021
				// 官方路径：/cgi-bin/oa/journal/download_wedrive_file
				const journaluuid = this.getNodeParameter('journaluuid', i) as string;
				const fileid = this.getNodeParameter('fileid', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/journal/download_wedrive_file',
					{
						journaluuid,
						fileid,
					},
				);
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

