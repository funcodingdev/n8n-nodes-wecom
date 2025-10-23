import { createDecipheriv, createCipheriv, createHash, randomBytes } from 'crypto';
import { NodeOperationError } from 'n8n-workflow';
import type { INode } from 'n8n-workflow';

/**
 * 企业微信消息加解密工具类
 *
 * 实现企业微信消息的加密和解密功能
 * 参考文档：
 * - 加密解密：https://developer.work.weixin.qq.com/document/path/91144
 * - 接收消息：https://developer.work.weixin.qq.com/document/path/90238
 * - 被动回复：https://developer.work.weixin.qq.com/document/path/90241
 */
export class WeComCrypto {
	private readonly key: Buffer;
	private readonly corpId: string;

	/**
	 * 构造函数
	 * @param encodingAESKey - EncodingAESKey，43位字符串，由企业微信后台生成
	 * @param corpId - 企业ID
	 */
	constructor(encodingAESKey: string, corpId: string) {
		// EncodingAESKey 是 Base64 编码的 43 位字符串，需要加上 '=' 补齐到 44 位
		// 解码后得到32字节的AES密钥
		const aesKey = encodingAESKey + '=';
		this.key = Buffer.from(aesKey, 'base64');
		
		// 验证密钥长度
		if (this.key.length !== 32) {
			throw new Error('EncodingAESKey 解码后必须是 32 字节');
		}
		
		this.corpId = corpId;
	}

	/**
	 * 解密消息
	 * 
	 * 解密算法：
	 * 1. 对密文 BASE64 解码
	 * 2. 使用 AESKey 做 AES-256-CBC 解密（IV为AESKey的前16字节）
	 * 3. 去除补位字符
	 * 4. 按格式提取：随机16字节 + 网络字节序的4字节消息长度 + 消息明文 + CorpID
	 * 5. 验证 CorpID 是否匹配
	 *
	 * @param encrypted - 加密的消息内容（Base64 编码）
	 * @param node - n8n 节点实例，用于错误处理
	 * @returns 解密后的消息明文（XML格式）
	 */
	decrypt(encrypted: string, node: INode): string {
		try {
			// 步骤1：对密文 BASE64 解码
			const cipher = Buffer.from(encrypted, 'base64');

			// 步骤2：使用 AES-256-CBC 解密
			// IV 为 AESKey 的前 16 字节
			const iv = this.key.slice(0, 16);
			const decipher = createDecipheriv('aes-256-cbc', this.key, iv);
			decipher.setAutoPadding(false);  // 手动处理 PKCS7 填充

			let decrypted = Buffer.concat([decipher.update(cipher), decipher.final()]);

			// 步骤3：去除 PKCS7 填充
			// PKCS7：填充字节的值等于填充字节的个数
			const pad = decrypted[decrypted.length - 1];
			if (pad < 1 || pad > 32) {
				throw new Error(`无效的填充值: ${pad}`);
			}
			// 验证所有填充字节的值是否一致
			for (let i = 0; i < pad; i++) {
				if (decrypted[decrypted.length - 1 - i] !== pad) {
					throw new Error('填充字节不一致');
				}
			}
			decrypted = decrypted.slice(0, decrypted.length - pad);

			// 步骤4：按格式解析明文
			// 格式：随机16字节 + 4字节网络字节序消息长度 + 消息内容 + CorpID
			if (decrypted.length < 20) {
				throw new Error('解密后的数据长度不足');
			}

			// 跳过随机16字节
			const content = decrypted.slice(16);
			
			// 读取消息长度（网络字节序，即大端序）
			const msgLen = content.readUInt32BE(0);
			
			// 提取消息内容
			if (content.length < 4 + msgLen) {
				throw new Error(`消息长度不匹配: 期望 ${msgLen}, 实际 ${content.length - 4}`);
			}
			const message = content.slice(4, 4 + msgLen).toString('utf8');
			
			// 提取并验证 CorpID
			const receivedCorpId = content.slice(4 + msgLen).toString('utf8');

			// 步骤5：验证 CorpID
			if (receivedCorpId !== this.corpId) {
				throw new NodeOperationError(
					node,
					`CorpID 不匹配: 期望 "${this.corpId}", 收到 "${receivedCorpId}"`,
				);
			}

			return message;
		} catch (error) {
			const err = error as Error;
			if (error instanceof NodeOperationError) {
				throw error;
			}
			throw new NodeOperationError(node, `消息解密失败: ${err.message}`);
		}
	}

	/**
	 * 加密消息
	 * 
	 * 加密算法：
	 * 1. 生成16字节随机字符串
	 * 2. 按格式组装明文：随机16字节 + 网络字节序的4字节消息长度 + 消息明文 + CorpID
	 * 3. 对明文进行 PKCS7 填充（32字节分组）
	 * 4. 使用 AESKey 做 AES-256-CBC 加密（IV为AESKey的前16字节）
	 * 5. 对密文进行 BASE64 编码
	 *
	 * @param message - 要加密的消息内容（通常是XML格式）
	 * @param node - n8n 节点实例，用于错误处理
	 * @returns 加密后的消息内容（Base64 编码）
	 */
	encrypt(message: string, node: INode): string {
		try {
			// 步骤1：生成16字节随机字符串
			const random = randomBytes(16);

			// 步骤2：按格式组装明文
			const msgBuffer = Buffer.from(message, 'utf8');
			
			// 消息长度采用网络字节序（大端序）
			const msgLenBuffer = Buffer.alloc(4);
			msgLenBuffer.writeUInt32BE(msgBuffer.length, 0);
			
			const corpIdBuffer = Buffer.from(this.corpId, 'utf8');

			// 组合：随机16字节 + 4字节消息长度 + 消息内容 + CorpID
			const content = Buffer.concat([random, msgLenBuffer, msgBuffer, corpIdBuffer]);

			// 步骤3：PKCS7 填充
			// 使用32字节分组，填充字节的值等于填充字节的个数
			const blockSize = 32;
			const paddingLength = blockSize - (content.length % blockSize);
			const padding = Buffer.alloc(paddingLength, paddingLength);
			const paddedContent = Buffer.concat([content, padding]);

			// 步骤4：使用 AES-256-CBC 加密
			// IV 为 AESKey 的前 16 字节
			const iv = this.key.slice(0, 16);
			const cipher = createCipheriv('aes-256-cbc', this.key, iv);
			cipher.setAutoPadding(false);  // 手动处理 PKCS7 填充

			const encrypted = Buffer.concat([cipher.update(paddedContent), cipher.final()]);
			
			// 步骤5：对密文进行 BASE64 编码
			return encrypted.toString('base64');
		} catch (error) {
			const err = error as Error;
			throw new NodeOperationError(node, `消息加密失败: ${err.message}`);
		}
	}

	/**
	 * 生成签名
	 * 
	 * 签名算法：
	 * 1. 将 Token、Timestamp、Nonce、Encrypt（消息加密串）四个参数进行字典序排序
	 * 2. 将四个参数字符串拼接成一个字符串
	 * 3. 对拼接后的字符串进行 SHA1 哈希
	 * 4. 得到的哈希值即为签名（小写十六进制字符串）
	 *
	 * @param token - Token，由企业微信后台配置
	 * @param timestamp - 时间戳字符串
	 * @param nonce - 随机字符串
	 * @param encrypt - 加密的消息内容（Base64编码的密文）
	 * @returns 40位小写十六进制 SHA1 签名
	 */
	static generateSignature(
		token: string,
		timestamp: string,
		nonce: string,
		encrypt: string,
	): string {
		// 步骤1：字典序排序
		const arr = [token, timestamp, nonce, encrypt].sort();
		
		// 步骤2：拼接字符串
		const str = arr.join('');
		
		// 步骤3：SHA1 哈希
		const signature = createHash('sha1').update(str).digest('hex');
		
		return signature;
	}

	/**
	 * 验证签名
	 * 
	 * 验证收到的签名是否有效，防止消息被篡改
	 *
	 * @param signature - 待验证的签名（msg_signature参数）
	 * @param token - Token，由企业微信后台配置
	 * @param timestamp - 时间戳字符串
	 * @param nonce - 随机字符串
	 * @param encrypt - 加密的消息内容（Base64编码的密文）
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
		
		// 使用恒定时间比较，防止时序攻击
		if (signature.length !== expectedSignature.length) {
			return false;
		}
		
		let result = 0;
		for (let i = 0; i < signature.length; i++) {
			result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
		}
		
		return result === 0;
	}
}

/**
 * 解析 XML 消息
 * 
 * 企业微信的消息都是 XML 格式，需要手动解析
 * XML 格式示例：
 * ```xml
 * <xml>
 *   <ToUserName><![CDATA[toUser]]></ToUserName>
 *   <FromUserName><![CDATA[fromUser]]></FromUserName>
 *   <CreateTime>1348831860</CreateTime>
 *   <MsgType><![CDATA[text]]></MsgType>
 *   <Content><![CDATA[this is a test]]></Content>
 *   <MsgId>1234567890123456</MsgId>
 * </xml>
 * ```
 *
 * @param xml - XML 字符串
 * @returns 解析后的键值对对象
 */
export function parseXML(xml: string): Record<string, string> {
	const result: Record<string, string> = {};

	// 使用正则表达式提取 XML 标签内容
	// 匹配两种格式：
	// 1. <tag><![CDATA[value]]></tag>
	// 2. <tag>value</tag>
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
 * 
 * 将键值对对象转换为企业微信标准的 XML 格式
 * 所有值都使用 CDATA 包裹，防止特殊字符导致 XML 解析错误
 * 
 * @param data - 键值对对象
 * @returns XML 字符串
 */
export function generateXML(data: Record<string, string>): string {
	let xml = '<xml>';
	for (const [key, value] of Object.entries(data)) {
		// 使用 CDATA 包裹值，防止特殊字符（如 <, >, &）导致 XML 解析错误
		xml += `<${key}><![CDATA[${value}]]></${key}>`;
	}
	xml += '</xml>';
	return xml;
}

/**
 * 生成被动回复消息的 XML
 * 
 * 用于回复用户消息，支持多种消息类型
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90241
 * 
 * 注意：
 * - ToUserName 和 FromUserName 的值与收到的消息是相反的
 * - CreateTime 是当前时间戳（秒）
 * - 被动回复消息需要在5秒内返回，否则企业微信会重试
 *
 * @param toUser - 接收方 UserID（通常是发送消息的成员UserID）
 * @param fromUser - 发送方（通常是企业应用的 CorpID）
 * @param msgType - 消息类型（text/image/voice/video/news）
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
 * 
 * 用于加密模式下的被动回复消息
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90930
 * 
 * 流程：
 * 1. 对消息明文（XML格式）进行加密
 * 2. 生成时间戳和随机字符串
 * 3. 计算消息签名（msg_signature）
 * 4. 将加密内容、签名、时间戳、随机数组装成 XML 返回
 * 
 * 返回的 XML 格式：
 * ```xml
 * <xml>
 *   <Encrypt><![CDATA[加密后的消息]]></Encrypt>
 *   <MsgSignature><![CDATA[消息签名]]></MsgSignature>
 *   <TimeStamp>时间戳</TimeStamp>
 *   <Nonce><![CDATA[随机字符串]]></Nonce>
 * </xml>
 * ```
 *
 * @param crypto - WeComCrypto 实例
 * @param token - Token，由企业微信后台配置
 * @param messageXML - 要加密的消息 XML 字符串（明文）
 * @param node - n8n 节点实例，用于错误处理
 * @returns 加密后的响应 XML 字符串
 */
export function generateEncryptedResponseXML(
	crypto: WeComCrypto,
	token: string,
	messageXML: string,
	node: INode,
): string {
	// 步骤1：加密消息内容
	const encrypt = crypto.encrypt(messageXML, node);

	// 步骤2：生成时间戳和随机字符串
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const nonce = randomBytes(8).toString('hex');

	// 步骤3：生成签名
	const signature = WeComCrypto.generateSignature(token, timestamp, nonce, encrypt);

	// 步骤4：构建响应 XML
	let xml = '<xml>';
	xml += `<Encrypt><![CDATA[${encrypt}]]></Encrypt>`;
	xml += `<MsgSignature><![CDATA[${signature}]]></MsgSignature>`;
	xml += `<TimeStamp>${timestamp}</TimeStamp>`;
	xml += `<Nonce><![CDATA[${nonce}]]></Nonce>`;
	xml += '</xml>';

	return xml;
}
