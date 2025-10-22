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
 * Token 缓存数据结构
 */
interface TokenCache {
	/** 企业微信 access_token */
	token: string;
	/** 过期时间戳（已提前 5 分钟） */
	expiresAt: number;
	/** 正在进行的请求 Promise（防止并发重复请求） */
	pending?: Promise<string>;
	/** 最后访问时间戳（用于清理长期未使用的缓存） */
	lastAccess: number;
}

/**
 * 全局缓存存储
 * Key 格式: `${corpId}_${corpSecret}`
 */
const accessTokenCache = new Map<string, TokenCache>();

/**
 * 缓存清理配置
 */
const CACHE_CLEANUP_CONFIG = {
	/** 最大缓存有效期：3 小时未访问的缓存将被清理 */
	MAX_CACHE_AGE: 3 * 60 * 60 * 1000,
	/** 清理阈值：当缓存数量超过此值时触发清理 */
	CLEANUP_THRESHOLD: 50,
} as const;

/**
 * 懒惰清理过期的缓存
 * 在每次访问缓存时执行，避免使用定时器
 */
function cleanupExpiredCache(): void {
	// 只有当缓存数量超过阈值时才执行清理，避免频繁操作
	if (accessTokenCache.size <= CACHE_CLEANUP_CONFIG.CLEANUP_THRESHOLD) {
		return;
	}

	const now = Date.now();
	for (const [key, cache] of accessTokenCache.entries()) {
		// 清理已过期或长时间未访问的缓存
		if (cache.expiresAt < now || now - cache.lastAccess > CACHE_CLEANUP_CONFIG.MAX_CACHE_AGE) {
			accessTokenCache.delete(key);
		}
	}
}

/**
 * 生成缓存键
 * 根据企业 ID 和应用 Secret 生成唯一标识
 */
function getCacheKey(credentials: IWeComCredentials): string {
	return `${credentials.corpId}_${credentials.corpSecret}`;
}

/**
 * 清除指定凭证的 Access Token 缓存
 * 用于手动清除缓存或 Token 失效时强制刷新
 *
 * @param credentials 企业微信凭证
 */
export function clearAccessTokenCache(credentials: IWeComCredentials): void {
	const cacheKey = getCacheKey(credentials);
	accessTokenCache.delete(cacheKey);
}

/**
 * 获取企业微信 Access Token
 * 官方文档：https://developer.work.weixin.qq.com/document/path/91039
 * @returns 有效的 access_token
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

	// 如果缓存有效，直接返回
	if (cached && cached.expiresAt > Date.now()) {
		cached.lastAccess = Date.now(); // 更新最后访问时间
		return cached.token;
	}

	// 缓存不存在或已过期，重新获取
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
		// 请求失败时清除缓存，下次重新尝试
		accessTokenCache.delete(cacheKey);
		throw error;
	}
}

/**
 * 调用企业微信 API 获取新的 access_token 并缓存
 *
 * @param credentials 企业微信凭证
 * @param cacheKey 缓存键
 * @returns 新获取的 access_token
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

	// 检查响应是否成功
	if (response.errcode !== 0 || !response.access_token) {
		throw new NodeOperationError(
			this.getNode(),
			`获取 Access Token 失败: ${response.errmsg} (错误码: ${response.errcode})`,
		);
	}

	// 缓存 token，提前 5 分钟过期以确保安全（企业微信官方建议）
	const expiresIn = response.expires_in || 7200; // 默认 7200 秒（2 小时）
	const TOKEN_EXPIRE_BUFFER = 300; // 提前 5 分钟过期

	accessTokenCache.set(cacheKey, {
		token: response.access_token,
		expiresAt: Date.now() + (expiresIn - TOKEN_EXPIRE_BUFFER) * 1000,
		lastAccess: Date.now(),
	});

	return response.access_token;
}

/**
 * 发送企业微信 API 请求
 *
 * Token 失效自动重试机制：
 * 当遇到 token 失效错误时，会自动清除缓存并重新获取 token，然后重试请求
 * - 40014: 不合法的 access_token
 * - 42001: access_token 已过期
 *
 * @param method HTTP 方法
 * @param resource API 资源路径（如 /cgi-bin/message/send）
 * @param body 请求体
 * @param qs 查询参数
 * @param headers 自定义请求头
 * @param option 其他请求选项
 * @param maxRetries 最大重试次数
 * @returns API 响应数据
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

	// 合并自定义 headers
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

		// 处理 Access Token 失效错误并自动重试
		const isTokenInvalid = jsonResponse.errcode === 40014 || jsonResponse.errcode === 42001;
		if (isTokenInvalid && maxRetries > 0) {
			// 清除缓存的 token
			const credentials = (await this.getCredentials('weComApi')) as IWeComCredentials;
			clearAccessTokenCache(credentials);

			// 重试请求
			return await weComApiRequest.call(
				this,
				method,
				resource,
				body,
				qs,
				headers,
				option,
				maxRetries - 1,
			);
		}

		// 检查其他 API 错误
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
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90253
 *
 * 支持的媒体类型：
 * - image: 图片（jpg/png 等）
 * - voice: 语音（amr/mp3 等）
 * - video: 视频（mp4 等）
 * - file: 普通文件（pdf/doc/xls 等）
 *
 * @param mediaType 媒体类型
 * @param buffer 文件二进制数据
 * @param filename 文件名（用于识别 MIME 类型）
 * @returns 媒体文件 media_id
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

/**
 * 根据文件名获取 MIME Content-Type
 *
 * @param filename 文件名
 * @returns MIME 类型
 */
function getContentType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();
	const mimeTypes: { [key: string]: string } = {
		// 图片
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		// 音频
		mp3: 'audio/mpeg',
		amr: 'audio/amr',
		// 视频
		mp4: 'video/mp4',
		// 文档
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		xls: 'application/vnd.ms-excel',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	};
	return mimeTypes[ext || ''] || 'application/octet-stream';
}
