import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function submitBatchAddVipJob(this: IExecuteFunctions): Promise<IDataObject> {
	const vip_userids = this.getNodeParameter('vip_userids', 0, '') as string;
	const selected = this.getNodeParameter('userid_list', 0, []) as string[];

	const userid_list = [
		...vip_userids
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean),
		...selected,
	];
	const unique = [...new Set(userid_list)].slice(0, 100);
	if (!unique.length) {
		throw new NodeOperationError(this.getNode(), '请至少填写或选择 1 个成员 UserID');
	}

	return weComApiRequest.call(this, 'POST', '/cgi-bin/security/vip/submit_batch_add_job', {
		userid_list: unique,
	});
}
