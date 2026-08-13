import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireEnum, requireText } from './utils';

export async function unionidToExternalUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const unionid = requireText(this, this.getNodeParameter('unionid', index), 'UnionID', index);
	const openid = requireText(this, this.getNodeParameter('openid', index), 'OpenID', index);
	const subjectType = requireEnum(this, this.getNodeParameter('subjectType', index, 0), '主体类型', [0, 1], index);

	const body: IDataObject = {
		unionid,
		openid,
		subject_type: subjectType,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/unionid_to_external_userid',
		body,
	);

	return responseData;
}
