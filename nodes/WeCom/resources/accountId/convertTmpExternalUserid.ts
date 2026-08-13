import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { requireEnum, requireStringList } from './utils';

export async function convertTmpExternalUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const businessType = requireEnum(this, this.getNodeParameter('businessType', index), '业务类型', [1, 2, 3], index);
	const userType = requireEnum(this, this.getNodeParameter('userType', index), '用户类型', [1, 2, 3, 4], index);
	const tmpExternalUseridList = requireStringList(this, this.getNodeParameter('tmpExternalUseridList', index), '临时 External UserID 列表', index, 100);

	const body: IDataObject = {
		business_type: businessType,
		user_type: userType,
		tmp_external_userid_list: tmpExternalUseridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/convert_tmp_external_userid',
		body,
	);

	return responseData;
}
