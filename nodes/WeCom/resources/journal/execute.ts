import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

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
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
				const cursor = this.getNodeParameter('cursor', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const filters = this.getNodeParameter('filters', i, '[]') as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/journal/get_record_list', {
					starttime,
					endtime,
					cursor,
					limit,
					filters: JSON.parse(filters),
				});
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
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
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
				// 下载微盘文件
				// https://developer.work.weixin.qq.com/document/path/98021
				const fileid = this.getNodeParameter('fileid', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedrive/file_download', {
					fileid,
				});
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

