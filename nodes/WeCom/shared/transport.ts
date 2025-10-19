import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IWeComAccessTokenResponse, IWeComCredentials } from './types';

/**
 * Access Token 缓存结构
 * 使用 Map 按凭证隔离，支持多租户场景
 * 
 * 注意事项：
 * - 缓存存储在 Node.js 进程内存中
 * - 进程重启后缓存会丢失（这是正常的）
 * - 如果 n8n 运行在集群模式，每个实例会有独立的缓存
 * - 过期的缓存会在下次访问时自动清理
 */
interface TokenCache {
	token: string;
	expiresAt: number;
	pending?: Promise<string>;
	lastAccess: number; // 添加最后访问时间，用于清理
}

const accessTokenCache = new Map<string, TokenCache>();

// 缓存清理配置
const MAX_CACHE_AGE = 3 * 60 * 60 * 1000; // 3 小时未访问的缓存将被清理
const CLEANUP_THRESHOLD = 50; // 当缓存数量超过此值时触发清理

/**
 * 懒惰清理过期的缓存
 * 在每次访问缓存时执行，避免使用定时器
 */
function cleanupExpiredCache(): void {
	// 只有当缓存数量超过阈值时才执行清理，避免频繁操作
	if (accessTokenCache.size <= CLEANUP_THRESHOLD) {
		return;
	}
	
	const now = Date.now();
	for (const [key, cache] of accessTokenCache.entries()) {
		// 清理已过期或长时间未访问的缓存
		if (cache.expiresAt < now || now - cache.lastAccess > MAX_CACHE_AGE) {
			accessTokenCache.delete(key);
		}
	}
}

/**
 * 生成缓存 Key（基于凭证信息）
 */
function getCacheKey(credentials: IWeComCredentials): string {
	return `${credentials.corpId}-${credentials.corpSecret}`;
}

/**
 * 清除指定凭证的 Access Token 缓存
 */
export function clearAccessTokenCache(credentials: IWeComCredentials): void {
	const cacheKey = getCacheKey(credentials);
	accessTokenCache.delete(cacheKey);
}

/**
 * 获取企业微信 Access Token
 * 
 * 特性：
 * - 按凭证缓存，支持多租户
 * - 并发请求控制，避免重复调用
 * - 提前 5 分钟过期，确保安全性
 */
export async function getAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = (await this.getCredentials('weComApi')) as IWeComCredentials;
	const cacheKey = getCacheKey(credentials);
	
	// 执行懒惰清理
	cleanupExpiredCache();
	
	const cached = accessTokenCache.get(cacheKey);

	// 如果有正在进行的请求，等待它完成（避免并发重复请求）
	if (cached?.pending) {
		return await cached.pending;
	}

	// 检查缓存的 token 是否有效
	if (cached && cached.expiresAt > Date.now()) {
		// 更新最后访问时间
		cached.lastAccess = Date.now();
		return cached.token;
	}

	// 创建获取 token 的 Promise
	const tokenPromise = fetchAccessToken.call(this, credentials, cacheKey);

	// 保存 pending 状态，防止并发重复请求
	accessTokenCache.set(cacheKey, {
		token: '',
		expiresAt: 0,
		pending: tokenPromise,
		lastAccess: Date.now(),
	});

	try {
		const token = await tokenPromise;
		return token;
	} catch (error) {
		// 请求失败时清除缓存
		accessTokenCache.delete(cacheKey);
		throw error;
	}
}

/**
 * 实际获取 Access Token 的函数
 */
async function fetchAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	credentials: IWeComCredentials,
	cacheKey: string,
): Promise<string> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
		qs: {
			corpid: credentials.corpId,
			corpsecret: credentials.corpSecret,
		},
		json: true,
	};

	const response = (await this.helpers.httpRequest(options)) as IWeComAccessTokenResponse;

	if (response.errcode !== 0 || !response.access_token) {
		throw new NodeOperationError(
			this.getNode(),
			`获取 Access Token 失败: ${response.errmsg} (错误码: ${response.errcode})`,
		);
	}

	// 缓存 token，提前 5 分钟过期以确保安全（企业微信官方建议）
	const expiresIn = response.expires_in || 7200; // 默认 7200 秒（2 小时）
	accessTokenCache.set(cacheKey, {
		token: response.access_token,
		expiresAt: Date.now() + (expiresIn - 300) * 1000, // 提前 5 分钟过期
		lastAccess: Date.now(),
	});

	return response.access_token;
}

/**
 * 发送企业微信 API 请求
 * 
 * 特性：
 * - 自动处理 Access Token 失效（40014, 42001）并重试
 * - 完善的错误处理
 */
export async function weComApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	headers: IDataObject = {},
	option: IDataObject = {},
	maxRetries: number = 1,
): Promise<IDataObject> {
	const accessToken = await getAccessToken.call(this);

	const options: IHttpRequestOptions = {
		method,
		qs: {
			...qs,
			access_token: accessToken,
		},
		url: `https://qyapi.weixin.qq.com${resource}`,
		json: true,
		...option,
	};

	// 设置请求体
	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	// 合并自定义headers
	if (Object.keys(headers).length > 0) {
		options.headers = { ...options.headers, ...headers };
	}

	try {
		const response = await this.helpers.httpRequest(options);

		// 如果是二进制响应（如下载文件），直接返回
		if (option.encoding === null || option.resolveWithFullResponse) {
			return response;
		}

		const jsonResponse = response as IDataObject;

		// 处理 Access Token 失效错误（40014: 不合法的access_token, 42001: access_token已过期）
		if ((jsonResponse.errcode === 40014 || jsonResponse.errcode === 42001) && maxRetries > 0) {
			// 清除缓存的 token
			const credentials = (await this.getCredentials('weComApi')) as IWeComCredentials;
			clearAccessTokenCache(credentials);

			// 重试请求
			return await weComApiRequest.call(this, method, resource, body, qs, headers, option, maxRetries - 1);
		}

		if (jsonResponse.errcode !== undefined && jsonResponse.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`企业微信 API 错误: ${jsonResponse.errmsg} (错误码: ${jsonResponse.errcode})`,
			);
		}

		return jsonResponse;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(this.getNode(), `API 请求失败: ${err.message}`);
	}
}

/**
 * 上传媒体文件到企业微信
 */
export async function uploadMedia(
	this: IExecuteFunctions,
	mediaType: 'image' | 'voice' | 'video' | 'file',
	buffer: Uint8Array,
	filename: string,
): Promise<string> {
	const accessToken = await getAccessToken.call(this);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/media/upload',
		qs: {
			access_token: accessToken,
			type: mediaType,
		},
		body: {
			media: {
				value: buffer,
				options: {
					filename,
					contentType: getContentType(filename),
				},
			},
		},
		json: true,
	};

	const response = (await this.helpers.httpRequest(options)) as IDataObject;

	if ((response.errcode as number) !== 0 || !response.media_id) {
		throw new NodeOperationError(
			this.getNode(),
			`上传媒体文件失败: ${response.errmsg} (错误码: ${response.errcode})`,
		);
	}

	return response.media_id as string;
}

function getContentType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();
	const mimeTypes: { [key: string]: string } = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		mp3: 'audio/mpeg',
		amr: 'audio/amr',
		mp4: 'video/mp4',
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		xls: 'application/vnd.ms-excel',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	};
	return mimeTypes[ext || ''] || 'application/octet-stream';
}

