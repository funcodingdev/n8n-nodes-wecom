import type {
	ICredentialsDecrypted,
	INodeCredentialTestResult,
} from 'n8n-workflow';

/**
 * 接收消息凭证没有可供服务端主动校验的 API；在本地验证其必填项和 AESKey 格式。
 * 企业微信会在保存回调 URL 时通过 GET 验证完成真实性校验。
 */
export async function weComReceiveApiTest(
	credential: ICredentialsDecrypted,
): Promise<INodeCredentialTestResult> {
	const data = credential.data ?? {};
	const corpId = String(data.corpId ?? '').trim();
	const token = String(data.token ?? '').trim();
	const encodingAESKey = String(data.encodingAESKey ?? '').trim();
	const errors: string[] = [];

	if (!corpId) errors.push('企业 ID 不能为空');
	if (!token) errors.push('Token 不能为空');
	if (!/^[A-Za-z0-9+/]{43}$/.test(encodingAESKey)) {
		errors.push('EncodingAESKey 必须是 43 位 Base64 字符串');
	} else if (Buffer.from(`${encodingAESKey}=`, 'base64').length !== 32) {
		errors.push('EncodingAESKey 解码后必须是 32 字节');
	}

	return errors.length
		? { status: 'Error', message: errors.join('；') }
		: {
			status: 'OK',
			message: '凭证格式有效；企业微信将在保存回调 URL 时完成签名验证',
		};
}
