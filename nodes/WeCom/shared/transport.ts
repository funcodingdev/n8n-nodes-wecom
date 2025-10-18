import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IWeComAccessTokenResponse, IWeComCredentials } from './types';

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * 获取企业微信 Access Token
 */
export async function getAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = (await this.getCredentials('weComApi')) as IWeComCredentials;

	// 检查缓存的 token 是否有效
	if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
		return cachedAccessToken.token;
	}

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

	// 缓存 token，提前 5 分钟过期以确保安全
	cachedAccessToken = {
		token: response.access_token,
		expiresAt: Date.now() + (response.expires_in! - 300) * 1000,
	};

	return response.access_token;
}

/**
 * 发送企业微信 API 请求
 */
export async function weComApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const accessToken = await getAccessToken.call(this);

	const options: IHttpRequestOptions = {
		method,
		body,
		qs: {
			...qs,
			access_token: accessToken,
		},
		url: `https://qyapi.weixin.qq.com${resource}`,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`企业微信 API 错误: ${response.errmsg} (错误码: ${response.errcode})`,
			);
		}

		return response;
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

