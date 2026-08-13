import { randomBytes } from 'crypto';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getAccessToken, getWeComBaseUrl } from './transport';

/**
 * 通用 multipart 上传到 qyapi（media 字段）
 * 用于 material / chatdata / miniapppay 等 upload 接口
 */
export async function weComMultipartUpload(
	this: IExecuteFunctions,
	options: {
		itemIndex: number;
		/** 以 /cgi-bin/ 开头的路径，不含 query */
		path: string;
		/** query 参数（不含 access_token） */
		qs?: IDataObject;
		binaryPropertyName: string;
		formFieldName?: string;
		/** 覆盖文件名 */
		filename?: string;
		/** 覆盖 Content-Type（已通过调用方格式校验时使用） */
		contentType?: string;
		minBytes?: number;
		maxBytes?: number;
	},
): Promise<IDataObject> {
	const {
		itemIndex,
		path,
		qs = {},
		binaryPropertyName,
		formFieldName = 'media',
		filename,
		contentType: contentTypeOverride,
		minBytes = 6,
		maxBytes,
	} = options;

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const dataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const fileName = (filename || binaryData.fileName || 'file').replace(/[\r\n"\\]/g, '_');
	const rawContentType = contentTypeOverride || binaryData.mimeType || 'application/octet-stream';
	const contentType = /^[\w.+-]+\/[\w.+-]+$/.test(rawContentType)
		? rawContentType
		: 'application/octet-stream';
	const safeFormFieldName = formFieldName.replace(/[^\w.-]/g, '_');
	const fileLength = dataBuffer.length;

	if (fileLength < minBytes) {
		throw new NodeOperationError(
			this.getNode(),
			`文件大小必须至少 ${minBytes} 字节，当前: ${fileLength}`,
			{ itemIndex },
		);
	}
	if (maxBytes !== undefined && fileLength > maxBytes) {
		throw new NodeOperationError(
			this.getNode(),
			`文件大小不能超过 ${maxBytes} 字节，当前: ${fileLength}`,
			{ itemIndex },
		);
	}

	const accessToken = await getAccessToken.call(this);
	const baseUrl = await getWeComBaseUrl.call(this);

	const boundary = `----n8nWeComBoundary${randomBytes(18).toString('hex')}`;
	const CRLF = '\r\n';
	const header =
		`--${boundary}${CRLF}` +
		`Content-Disposition: form-data; name="${safeFormFieldName}"; filename="${fileName}"; filelength=${fileLength}${CRLF}` +
		`Content-Type: ${contentType}${CRLF}${CRLF}`;
	const footer = `${CRLF}--${boundary}--${CRLF}`;
	const bodyBuffer = Buffer.concat([
		Buffer.from(header, 'utf-8'),
		dataBuffer,
		Buffer.from(footer, 'utf-8'),
	]);

	const response = (await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}${path}`,
		qs: {
			access_token: accessToken,
			...qs,
		},
		body: bodyBuffer,
		headers: {
			'Content-Type': `multipart/form-data; boundary=${boundary}`,
			'Content-Length': bodyBuffer.length.toString(),
		},
	})) as IDataObject;

	if (response.errcode !== undefined && response.errcode !== 0) {
		throw new NodeOperationError(
			this.getNode(),
			`上传失败: ${response.errmsg} (错误码: ${response.errcode}) path=${path}`,
			{ itemIndex },
		);
	}

	return response;
}
