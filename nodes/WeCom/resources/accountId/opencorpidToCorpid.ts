import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requirePositiveInteger, requireText } from './utils';

/**
 * 密文 corpid 转明文 corpid（服务商）
 * https://developer.work.weixin.qq.com/document/path/97062
 */
export async function opencorpidToCorpid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const open_corpid = requireText(this, this.getNodeParameter('opencorpid', index), '密文 CorpID', index);
	const source_agentid = requirePositiveInteger(
		this,
		this.getNodeParameter('sourceAgentid', index),
		'源应用 ID',
		index,
	);
	return await weComApiRequest.call(this, 'POST', '/cgi-bin/corp/opencorpid_to_corpid', {
		open_corpid,
		source_agentid,
	});
}
