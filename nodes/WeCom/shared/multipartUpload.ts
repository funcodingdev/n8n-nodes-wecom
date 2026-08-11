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
		minBytes = 6,
		maxBytes,
	} = options;

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const dataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const fileName = filename || binaryData.fileName || 'file';
	const contentType = binaryData.mimeType || 'application/octet-stream';
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

	const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
	const CRLF = '\r\n';
	const header =
		`--${boundary}${CRLF}` +
		`Content-Disposition: form-data; name="${formFieldName}";filename="${fileName}"; filelength=${fileLength}${CRLF}` +
		`Content-Type: ${contentType}${CRLF}${CRLF}`;
	const footer = `${CRLF}--${boundary}--${CRLF}`;
	const bodyBuffer = Buffer.concat([
		Buffer.from(header, 'utf-8'),
		dataBuffer,
		Buffer.from(footer, 'utf-8'),
	]);

	const query = new URLSearchParams({
		access_token: accessToken,
		...Object.fromEntries(
			Object.entries(qs).map(([k, v]) => [k, String(v ?? '')]),
		),
	});
	const uploadUrl = `${baseUrl}${path}?${query.toString()}`;

	const response = (await this.helpers.httpRequest({
		method: 'POST',
		url: uploadUrl,
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
