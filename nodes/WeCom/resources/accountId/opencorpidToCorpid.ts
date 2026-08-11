import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

/**
 * 密文 corpid 转明文 corpid（服务商）
 * https://developer.work.weixin.qq.com/document/path/97062
 */
export async function opencorpidToCorpid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const opencorpid = this.getNodeParameter('opencorpid', index) as string;
	// 部分环境需 provider_access_token，此处走标准企业 access_token 调用
	return await weComApiRequest.call(this, 'POST', '/cgi-bin/corp/opencorpid_to_corpid', {
		opencorpid,
	});
}
