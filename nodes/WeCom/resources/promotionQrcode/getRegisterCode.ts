import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import { fail, optionalText, requireText } from './utils';

/**
 * 获取注册码
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90581
 *
 * 用途：
 * - 根据注册推广包生成注册码（register_code）
 *
 * 注意事项：
 * - 需要provider_access_token
 * - register_code只能消费一次，在访问注册链接时消费
 * - register_code有效期由expires_in字段指定，生成链接需要在有效期内点击跳转
 *
 * @returns 注册码信息（包含register_code和expires_in）
 */
export async function getRegisterCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = requireText(
		this,
		this.getNodeParameter('providerAccessToken', index),
		'Provider Access Token',
		index,
		2048,
	);
	const templateId = requireText(this, this.getNodeParameter('templateId', index), '推广包 ID', index, 128);
	const corpName = optionalText(this, this.getNodeParameter('corpName', index, ''), '企业名称', index, 256);
	const adminName = optionalText(this, this.getNodeParameter('adminName', index, ''), '管理员姓名', index, 64);
	const adminMobile = optionalText(this, this.getNodeParameter('adminMobile', index, ''), '管理员手机号', index, 20);
	if (adminMobile && !/^\d{11}$/.test(adminMobile)) fail(this, '管理员手机号必须是 11 位数字', index);
	const state = optionalText(this, this.getNodeParameter('state', index, ''), 'State 值', index, 128);
	if (state && !/^[A-Za-z0-9]+$/.test(state)) fail(this, 'State 值只能包含英文字母和数字', index);
	const followUser = optionalText(this, this.getNodeParameter('followUser', index, ''), '跟进人 UserID', index, 64);

	const body: IDataObject = {
		template_id: templateId,
	};

	if (corpName) {
		body.corp_name = corpName;
	}

	if (adminName) {
		body.admin_name = adminName;
	}

	if (adminMobile) {
		body.admin_mobile = adminMobile;
	}

	if (state) {
		body.state = state;
	}

	if (followUser) {
		body.follow_user = followUser;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_register_code`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取注册码失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取注册码失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
