import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { createHash } from 'crypto';
import { weComApiRequest } from './transport';

/** 企业微信分块上传固定分块大小：2MiB */
export const UPLOAD_BLOCK_SIZE = 2 * 1024 * 1024;

/** 单次 Base64 上传上限：10MiB，超过后需走分块上传 */
export const SINGLE_UPLOAD_LIMIT = 10 * 1024 * 1024;

/** 分块上传并发数，官方建议不超过 10 */
const UPLOAD_CONCURRENCY = 4;

const rotl = (value: number, bits: number): number => (value << bits) | (value >>> (32 - bits));

/** 以小端序输出 SHA-1 中间状态（与官方 file_block_digest 直接输出 SHA_CTX.h0~h4 内存一致） */
function stateToHex(state: Uint32Array): string {
	const bytes = Buffer.alloc(20);
	for (let i = 0; i < 5; i++) bytes.writeUInt32LE(state[i], i * 4);
	return bytes.toString('hex');
}

function sha1Compress(state: Uint32Array, block: Buffer, offset: number, words: Uint32Array): void {
	for (let i = 0; i < 16; i++) words[i] = block.readUInt32BE(offset + i * 4);
	for (let i = 16; i < 80; i++) {
		words[i] = rotl(words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16], 1);
	}
	let [a, b, c, d, e] = state;
	for (let i = 0; i < 80; i++) {
		let f: number;
		let k: number;
		if (i < 20) {
			f = (b & c) | (~b & d);
			k = 0x5a827999;
		} else if (i < 40) {
			f = b ^ c ^ d;
			k = 0x6ed9eba1;
		} else if (i < 60) {
			f = (b & c) | (b & d) | (c & d);
			k = 0x8f1bbcdc;
		} else {
			f = b ^ c ^ d;
			k = 0xca62c1d6;
		}
		const temp = (rotl(a, 5) + f + e + k + words[i]) >>> 0;
		e = d;
		d = c;
		c = rotl(b, 30) >>> 0;
		b = a;
		a = temp;
	}
	state[0] = (state[0] + a) >>> 0;
	state[1] = (state[1] + b) >>> 0;
	state[2] = (state[2] + c) >>> 0;
	state[3] = (state[3] + d) >>> 0;
	state[4] = (state[4] + e) >>> 0;
}

/**
 * 计算分块上传所需的 block_sha 列表
 * 每个 2MiB 分块 update 后记录 SHA-1 中间状态；最后一块记录整个文件的 SHA-1。
 * 官方说明：https://developer.work.weixin.qq.com/document/path/98004
 */
export function computeBlockSha(data: Buffer): string[] {
	const blockCount = Math.max(1, Math.ceil(data.length / UPLOAD_BLOCK_SIZE));
	const state = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
	const words = new Uint32Array(80);
	const result: string[] = [];
	for (let index = 0; index < blockCount - 1; index++) {
		const start = index * UPLOAD_BLOCK_SIZE;
		// 2MiB 是 64 字节的整数倍，因此前面的分块都可以完整压缩，无需填充
		for (let offset = start; offset < start + UPLOAD_BLOCK_SIZE; offset += 64) {
			sha1Compress(state, data, offset, words);
		}
		result.push(stateToHex(state));
	}
	result.push(createHash('sha1').update(data).digest('hex'));
	return result;
}

/**
 * 执行完整的分块上传流程：初始化 → 并发上传分块 → 完成
 * 命中秒传时直接返回初始化结果。
 *
 * 微盘：/cgi-bin/wedrive/file_upload_init、/cgi-bin/wedrive/file_upload_part、/cgi-bin/wedrive/file_upload_finish
 * 文档：/cgi-bin/wedoc/file_upload_init、/cgi-bin/wedoc/file_upload_part、/cgi-bin/wedoc/file_upload_finish
 *
 * @param apiPrefix 接口前缀，例如 /cgi-bin/wedrive 或 /cgi-bin/wedoc
 * @param initBody 初始化请求中除 size、block_sha 以外的业务字段
 */
export async function chunkedUpload(
	this: IExecuteFunctions,
	apiPrefix: string,
	initBody: IDataObject,
	data: Buffer,
): Promise<IDataObject> {
	const init = await weComApiRequest.call(this, 'POST', `${apiPrefix}/file_upload_init`, {
		...initBody,
		size: data.length,
		block_sha: computeBlockSha(data),
	});
	if (init.hit_exist === true || !init.upload_key) return { ...init, uploadMethod: 'instant' };

	const uploadKey = init.upload_key as string;
	const blockCount = Math.ceil(data.length / UPLOAD_BLOCK_SIZE);
	let next = 0;
	const worker = async (): Promise<void> => {
		while (next < blockCount) {
			const index = next++;
			const chunk = data.subarray(index * UPLOAD_BLOCK_SIZE, (index + 1) * UPLOAD_BLOCK_SIZE);
			await weComApiRequest.call(this, 'POST', `${apiPrefix}/file_upload_part`, {
				upload_key: uploadKey,
				index: index + 1,
				file_base64_content: chunk.toString('base64'),
			});
		}
	};
	await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, blockCount) }, worker));

	const finish = await weComApiRequest.call(this, 'POST', `${apiPrefix}/file_upload_finish`, {
		upload_key: uploadKey,
	});
	return { ...finish, uploadMethod: 'chunked', blockCount };
}
