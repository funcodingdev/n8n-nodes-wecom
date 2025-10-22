import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

/**
 * 获取企业微信回调服务器IP段
 * 官方文档：https://developer.work.weixin.qq.com/document/path/92521
 *
 * 用途：
 * - 用于配置回调服务器的防火墙白名单
 * - 确保只接收来自企业微信官方服务器的回调请求
 * - 提高回调接口的安全性
 *
 * @returns 企业微信回调服务器的IP段列表
 */
export async function getCallbackIp(this: IExecuteFunctions): Promise<IDataObject> {
	// 调用企业微信API获取回调IP段
	const responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/getcallbackip');

	return responseData;
}

