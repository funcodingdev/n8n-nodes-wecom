import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function submitBatchDelVipJob(this: IExecuteFunctions): Promise<IDataObject> {
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

	return weComApiRequest.call(this, 'POST', '/cgi-bin/security/vip/submit_batch_del_job', {
		userid_list: unique,
	});
}
