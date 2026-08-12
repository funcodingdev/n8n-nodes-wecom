import { createHmac, timingSafeEqual } from 'node:crypto';

const NATIVE_HITL_EVENT_KEY_PREFIX = 'n8n_hitl_v1';
export const NATIVE_HITL_CONTEXT_HEADER = 'x-n8n-wecom-hitl-context';
export const NATIVE_HITL_CONTEXT_SIGNATURE_HEADER = 'x-n8n-wecom-hitl-signature';

interface NativeHitlEventPayload {
	resumeUrl: string;
	taskId: string;
}

export interface NativeHitlCallbackContext {
	approved: boolean;
	respondedBy: string;
	responseCode: string;
	taskId: string;
}

export type NativeHitlEventKeyResult =
	| { recognized: false }
	| { recognized: true; valid: false; reason: string }
	| {
			recognized: true;
			valid: true;
			payload: NativeHitlEventPayload & { approved: boolean };
	  };

function sign(value: string, token: string): string {
	return createHmac('sha256', token).update(value).digest('base64url');
}

function signaturesMatch(actual: string, expected: string): boolean {
	const actualBuffer = Buffer.from(actual);
	const expectedBuffer = Buffer.from(expected);

	return (
		actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
	);
}

export function createNativeHitlEventKey(resumeUrl: string, taskId: string, token: string): string {
	const encodedPayload = Buffer.from(JSON.stringify({ resumeUrl, taskId }), 'utf8').toString(
		'base64url',
	);
	const eventKey = `${NATIVE_HITL_EVENT_KEY_PREFIX}.${encodedPayload}.${sign(encodedPayload, token)}`;

	if (Buffer.byteLength(eventKey, 'utf8') > 1024) {
		throw new Error('原生审批按钮 key 超过企业微信 1024 字节限制，请缩短 n8n 公网地址');
	}

	return eventKey;
}

export function parseNativeHitlEventKey(
	eventKey: string,
	callbackTaskId: string,
	token: string,
	callbackUrl: string,
): NativeHitlEventKeyResult {
	if (!eventKey.startsWith(`${NATIVE_HITL_EVENT_KEY_PREFIX}.`)) {
		return { recognized: false };
	}

	const parts = eventKey.split('.');
	if (parts.length !== 3) {
		return { recognized: true, valid: false, reason: '原生审批 EventKey 格式无效' };
	}

	const [, encodedPayload, providedSignature] = parts;
	if (!signaturesMatch(providedSignature, sign(encodedPayload, token))) {
		return { recognized: true, valid: false, reason: '原生审批 EventKey 签名无效' };
	}

	let payload: NativeHitlEventPayload;
	try {
		payload = JSON.parse(
			Buffer.from(encodedPayload, 'base64url').toString('utf8'),
		) as NativeHitlEventPayload;
	} catch {
		return { recognized: true, valid: false, reason: '原生审批 EventKey 载荷无效' };
	}

	if (!payload.resumeUrl || !payload.taskId || payload.taskId !== callbackTaskId) {
		return { recognized: true, valid: false, reason: '原生审批 TaskId 不匹配' };
	}

	let resumeUrl: URL;
	let triggerUrl: URL;
	try {
		resumeUrl = new URL(payload.resumeUrl);
		triggerUrl = new URL(callbackUrl);
	} catch {
		return { recognized: true, valid: false, reason: '原生审批恢复地址无效' };
	}

	const approvedValue = resumeUrl.searchParams.get('approved');
	if (
		resumeUrl.origin !== triggerUrl.origin ||
		!resumeUrl.searchParams.has('signature') ||
		resumeUrl.searchParams.get('taskId') !== payload.taskId ||
		(approvedValue !== 'true' && approvedValue !== 'false')
	) {
		return { recognized: true, valid: false, reason: '原生审批恢复地址不可信' };
	}

	return {
		recognized: true,
		valid: true,
		payload: {
			...payload,
			approved: approvedValue === 'true',
		},
	};
}

export function createNativeHitlContextHeaders(
	context: NativeHitlCallbackContext,
	token: string,
): Record<string, string> {
	const encodedContext = Buffer.from(JSON.stringify(context), 'utf8').toString('base64url');

	return {
		[NATIVE_HITL_CONTEXT_HEADER]: encodedContext,
		[NATIVE_HITL_CONTEXT_SIGNATURE_HEADER]: sign(encodedContext, token),
	};
}

export function parseNativeHitlContext(
	encodedContext: string | undefined,
	providedSignature: string | undefined,
	token: string,
): NativeHitlCallbackContext | undefined {
	if (
		!encodedContext ||
		!providedSignature ||
		!signaturesMatch(providedSignature, sign(encodedContext, token))
	) {
		return undefined;
	}

	try {
		const context = JSON.parse(
			Buffer.from(encodedContext, 'base64url').toString('utf8'),
		) as NativeHitlCallbackContext;

		if (typeof context.approved !== 'boolean' || !context.respondedBy || !context.taskId) {
			return undefined;
		}

		return context;
	} catch {
		return undefined;
	}
}
