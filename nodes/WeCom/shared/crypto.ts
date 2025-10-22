import { createDecipheriv, createCipheriv, createHash, randomBytes } from 'crypto';
import { NodeOperationError } from 'n8n-workflow';
import type { INode } from 'n8n-workflow';

/**
 * 企业微信消息加解密工具类
 *
 * 实现企业微信消息的加密和解密功能
 * 参考文档：https://developer.work.weixin.qq.com/document/path/90238
 */
export class WeComCrypto {
	private readonly key: Buffer;
	private readonly corpId: string;

	constructor(encodingAESKey: string, corpId: string) {
		// EncodingAESKey 是 Base64 编码的 43 位字符串，需要加上 '=' 补齐到 44 位
		const aesKey = encodingAESKey + '=';
		this.key = Buffer.from(aesKey, 'base64');
		this.corpId = corpId;
	}

	/**
	 * 解密消息
	 *
	 * @param encrypted - 加密的消息内容（Base64 编码）
	 * @returns 解密后的消息内容
	 */
	decrypt(encrypted: string, node: INode): string {
		try {
			const cipher = Buffer.from(encrypted, 'base64');

			// 使用 AES-256-CBC 解密
			const decipher = createDecipheriv('aes-256-cbc', this.key, this.key.slice(0, 16));
			decipher.setAutoPadding(false);

			let decrypted = Buffer.concat([decipher.update(cipher), decipher.final()]);

			// 移除 PKCS7 填充
			const pad = decrypted[decrypted.length - 1];
			if (pad < 1 || pad > 32) {
				throw new Error('Invalid padding');
			}
			decrypted = decrypted.slice(0, decrypted.length - pad);

			// 解析消息内容
			// 格式：随机16字节 + 4字节消息长度 + 消息内容 + corpId
			const content = decrypted.slice(16);
			const msgLen = content.readUInt32BE(0);
			const message = content.slice(4, msgLen + 4).toString('utf8');
			const receivedCorpId = content.slice(msgLen + 4).toString('utf8');

			// 验证 corpId
			if (receivedCorpId !== this.corpId) {
				throw new NodeOperationError(
					node,
					`CorpID 不匹配: 期望 ${this.corpId}, 收到 ${receivedCorpId}`,
				);
			}

			return message;
		} catch (error) {
			const err = error as Error;
			throw new NodeOperationError(node, `消息解密失败: ${err.message}`);
		}
	}

	/**
	 * 加密消息
	 *
	 * @param message - 要加密的消息内容
	 * @returns 加密后的消息内容（Base64 编码）
	 */
	encrypt(message: string, node: INode): string {
		try {
			// 生成随机16字节
			const random = randomBytes(16);

			const msgBuffer = Buffer.from(message, 'utf8');
			const msgLenBuffer = Buffer.alloc(4);
			msgLenBuffer.writeUInt32BE(msgBuffer.length, 0);
			const corpIdBuffer = Buffer.from(this.corpId, 'utf8');

			// 组合消息：随机16字节 + 4字节消息长度 + 消息内容 + corpId
			const content = Buffer.concat([random, msgLenBuffer, msgBuffer, corpIdBuffer]);

			// PKCS7 填充
			const blockSize = 32;
			const paddingLength = blockSize - (content.length % blockSize);
			const padding = Buffer.alloc(paddingLength, paddingLength);
			const paddedContent = Buffer.concat([content, padding]);

			// 使用 AES-256-CBC 加密
			const cipher = createCipheriv('aes-256-cbc', this.key, this.key.slice(0, 16));
			cipher.setAutoPadding(false);

			const encrypted = Buffer.concat([cipher.update(paddedContent), cipher.final()]);
			return encrypted.toString('base64');
		} catch (error) {
			const err = error as Error;
			throw new NodeOperationError(node, `消息加密失败: ${err.message}`);
		}
	}

	/**
	 * 生成签名
	 *
	 * @param token - Token
	 * @param timestamp - 时间戳
	 * @param nonce - 随机字符串
	 * @param encrypt - 加密的消息内容
	 * @returns SHA1 签名
	 */
	static generateSignature(
		token: string,
		timestamp: string,
		nonce: string,
		encrypt: string,
	): string {
		const arr = [token, timestamp, nonce, encrypt].sort();
		const str = arr.join('');
		return createHash('sha1').update(str).digest('hex');
	}

	/**
	 * 验证签名
	 *
	 * @param signature - 待验证的签名
	 * @param token - Token
	 * @param timestamp - 时间戳
	 * @param nonce - 随机字符串
	 * @param encrypt - 加密的消息内容
	 * @returns 签名是否有效
	 */
	static verifySignature(
		signature: string,
		token: string,
		timestamp: string,
		nonce: string,
		encrypt: string,
	): boolean {
		const expectedSignature = this.generateSignature(token, timestamp, nonce, encrypt);
		return signature === expectedSignature;
	}
}

/**
 * 解析 XML 消息
 *
 * 企业微信的消息都是 XML 格式，需要手动解析
 */
export function parseXML(xml: string): Record<string, string> {
	const result: Record<string, string> = {};

	// 使用正则表达式提取 XML 标签内容
	const regex = /<(\w+)><!?\[CDATA\[([^\]]+)\]\]><\/\1>|<(\w+)>([^<]+)<\/\3>/g;
	let match;

	while ((match = regex.exec(xml)) !== null) {
		const key = match[1] || match[3];
		const value = match[2] || match[4];
		result[key] = value;
	}

	return result;
}

/**
 * 生成 XML 响应（简单版本，用于键值对）
 */
export function generateXML(data: Record<string, string>): string {
	let xml = '<xml>';
	for (const [key, value] of Object.entries(data)) {
		xml += `<${key}><![CDATA[${value}]]></${key}>`;
	}
	xml += '</xml>';
	return xml;
}

/**
 * 生成被动回复消息的 XML
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90241
 *
 * @param toUser - 接收方 UserID
 * @param fromUser - 发送方（企业应用的 CorpID）
 * @param msgType - 消息类型
 * @param content - 消息内容（根据不同类型格式不同）
 * @returns 被动回复消息的 XML 字符串
 */
export function generateReplyMessageXML(
	toUser: string,
	fromUser: string,
	msgType: 'text' | 'image' | 'voice' | 'video' | 'news',
	content: Record<string, unknown>,
): string {
	const createTime = Math.floor(Date.now() / 1000);
	let xml = '<xml>';
	xml += `<ToUserName><![CDATA[${toUser}]]></ToUserName>`;
	xml += `<FromUserName><![CDATA[${fromUser}]]></FromUserName>`;
	xml += `<CreateTime>${createTime}</CreateTime>`;
	xml += `<MsgType><![CDATA[${msgType}]]></MsgType>`;

	switch (msgType) {
		case 'text':
			xml += `<Content><![CDATA[${content.Content as string}]]></Content>`;
			break;
		case 'image':
			xml += '<Image>';
			xml += `<MediaId><![CDATA[${content.MediaId as string}]]></MediaId>`;
			xml += '</Image>';
			break;
		case 'voice':
			xml += '<Voice>';
			xml += `<MediaId><![CDATA[${content.MediaId as string}]]></MediaId>`;
			xml += '</Voice>';
			break;
		case 'video':
			xml += '<Video>';
			xml += `<MediaId><![CDATA[${content.MediaId as string}]]></MediaId>`;
			if (content.Title) {
				xml += `<Title><![CDATA[${content.Title as string}]]></Title>`;
			}
			if (content.Description) {
				xml += `<Description><![CDATA[${content.Description as string}]]></Description>`;
			}
			xml += '</Video>';
			break;
		case 'news': {
			const articles = content.Articles as Array<{
				Title: string;
				Description?: string;
				Url: string;
				PicUrl?: string;
			}>;
			xml += `<ArticleCount>${articles.length}</ArticleCount>`;
			xml += '<Articles>';
			for (const article of articles) {
				xml += '<item>';
				xml += `<Title><![CDATA[${article.Title}]]></Title>`;
				if (article.Description) {
					xml += `<Description><![CDATA[${article.Description}]]></Description>`;
				}
				xml += `<Url><![CDATA[${article.Url}]]></Url>`;
				if (article.PicUrl) {
					xml += `<PicUrl><![CDATA[${article.PicUrl}]]></PicUrl>`;
				}
				xml += '</item>';
			}
			xml += '</Articles>';
			break;
		}
	}

	xml += '</xml>';
	return xml;
}

/**
 * 生成加密的响应 XML
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90930
 *
 * @param crypto - WeComCrypto 实例
 * @param token - Token
 * @param messageXML - 要加密的消息 XML 字符串
 * @param node - n8n 节点（用于错误处理）
 * @returns 加密后的响应 XML 字符串
 */
export function generateEncryptedResponseXML(
	crypto: WeComCrypto,
	token: string,
	messageXML: string,
	node: INode,
): string {
	// 加密消息内容
	const encrypt = crypto.encrypt(messageXML, node);

	// 生成时间戳和随机字符串
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const nonce = randomBytes(8).toString('hex');

	// 生成签名
	const signature = WeComCrypto.generateSignature(token, timestamp, nonce, encrypt);

	// 构建响应 XML
	let xml = '<xml>';
	xml += `<Encrypt><![CDATA[${encrypt}]]></Encrypt>`;
	xml += `<MsgSignature><![CDATA[${signature}]]></MsgSignature>`;
	xml += `<TimeStamp>${timestamp}</TimeStamp>`;
	xml += `<Nonce><![CDATA[${nonce}]]></Nonce>`;
	xml += '</xml>';

	return xml;
}
