import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

/**
 * 获取企业微信API接口IP段
 * 官方文档：https://developer.work.weixin.qq.com/document/path/92520
 *
 * 用途：
 * - 用于配置防火墙白名单
 * - 提高企业微信API调用的安全性
 *
 * @returns 企业微信API接口服务器的IP段列表
 */
export async function getApiDomainIp(this: IExecuteFunctions): Promise<IDataObject> {
	// 调用企业微信API获取接口IP段
	const responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/get_api_domain_ip');

	return responseData;
}

