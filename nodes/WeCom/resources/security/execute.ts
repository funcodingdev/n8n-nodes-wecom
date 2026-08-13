import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import {
	asObject,
	dateRange,
	enumNumber,
	fail,
	integerInRange,
	optionalText,
	requiredText,
	stringList,
} from './utils';

const FILE_OPERATION_TYPES = [
	101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
	117, 118, 119, 121, 124, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 139, 140,
	142, 10001, 10002,
] as const;
const FILE_OPERATION_SOURCES = [
	401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 450, 451, 452,
] as const;
const MEMBER_OPERATION_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15, 16, 17, 20, 21] as const;
const ADMIN_OPERATION_TYPES = [2, 3, 7, 8, 11, 12, 13] as const;

function optionalList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	max = 100,
): string[] {
	return stringList(context, value, label, itemIndex, 0, max);
}

function normalizeMac(context: IExecuteFunctions, value: string, itemIndex: number): string {
	if (!/^(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/.test(value)) {
		fail(context, `MAC 地址格式无效: ${value}`, itemIndex);
	}
	return value.replace(/-/g, ':').toUpperCase();
}

function deviceType(context: IExecuteFunctions, value: unknown, itemIndex: number): number {
	return enumNumber(context, value, '设备类型', itemIndex, [1, 2, 3]);
}

async function runOperation(
	context: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject> {
	if (operation === 'getFileOperRecord') {
		const { startTime, endTime } = dateRange(
			context,
			context.getNodeParameter('start_time', itemIndex),
			context.getNodeParameter('end_time', itemIndex),
			itemIndex,
			14,
		);
		const body: IDataObject = { start_time: startTime, end_time: endTime };
		const userids = optionalList(
			context,
			[
				context.getNodeParameter('userid_list_text', itemIndex, ''),
				context.getNodeParameter('userid_list', itemIndex, []),
			],
			'用户 ID 列表',
			itemIndex,
		);
		if (userids.length) body.userid_list = userids;
		const filter = asObject(context.getNodeParameter('operation_type', itemIndex, {}));
		const operationFilter: IDataObject = {};
		if (filter.type !== undefined) {
			operationFilter.type = enumNumber(
				context,
				filter.type,
				'文件操作类型',
				itemIndex,
				FILE_OPERATION_TYPES,
			);
		}
		if (filter.source !== undefined) {
			operationFilter.source = enumNumber(
				context,
				filter.source,
				'文件操作来源',
				itemIndex,
				FILE_OPERATION_SOURCES,
			);
		}
		if (Object.keys(operationFilter).length) body.operation = operationFilter;
		const cursor = optionalText(
			context,
			context.getNodeParameter('cursor', itemIndex, ''),
			'游标',
			itemIndex,
		);
		if (cursor) body.cursor = cursor;
		body.limit = integerInRange(
			context,
			context.getNodeParameter('limit', itemIndex, 100),
			'限制条数',
			itemIndex,
			1,
			1000,
		);
		return await weComApiRequest.call(
			context,
			'POST',
			'/cgi-bin/security/get_file_oper_record',
			body,
		);
	}

	if (operation === 'importDevice') {
		const raw = asObject(context.getNodeParameter('device_list', itemIndex, {}));
		const source = Array.isArray(raw.device) ? raw.device : [];
		if (source.length < 1 || source.length > 100) {
			fail(context, '设备列表数量必须为 1–100 个', itemIndex);
		}
		const devices = source.map((entry, deviceIndex) => {
			const device = asObject(entry);
			const system = requiredText(
				context,
				device.system,
				`第 ${deviceIndex + 1} 个设备的系统类型`,
				itemIndex,
				16,
			);
			if (!['Windows', 'Mac'].includes(system)) {
				fail(context, `第 ${deviceIndex + 1} 个设备的系统类型只能是 Windows 或 Mac`, itemIndex);
			}
			const macs = stringList(
				context,
				device.mac_addr ?? [],
				`第 ${deviceIndex + 1} 个设备的 MAC 地址`,
				itemIndex,
				system === 'Windows' ? 1 : 0,
				100,
				17,
			).map((mac) => normalizeMac(context, mac, itemIndex));
			const normalized: IDataObject = { system };
			if (macs.length) normalized.mac_addr = [...new Set(macs)];
			if (system === 'Windows') {
				const motherboard = optionalText(
					context,
					device.motherboard_uuid,
					'主板 UUID',
					itemIndex,
					256,
				);
				const disks = stringList(
					context,
					device.harddisk_uuid ?? [],
					'硬盘序列号',
					itemIndex,
					0,
					100,
					256,
				);
				const domain = optionalText(context, device.domain, 'Windows 域名', itemIndex, 256);
				const pcName = optionalText(context, device.pc_name, '计算机名', itemIndex, 256);
				if (motherboard) normalized.motherboard_uuid = motherboard;
				if (disks.length) normalized.harddisk_uuid = disks;
				if (domain) normalized.domain = domain;
				if (pcName) normalized.pc_name = pcName;
			} else {
				normalized.seq_no = requiredText(
					context,
					device.seq_no,
					`第 ${deviceIndex + 1} 个 Mac 设备的序列号`,
					itemIndex,
					256,
				);
			}
			return normalized;
		});
		return await weComApiRequest.call(
			context,
			'POST',
			'/cgi-bin/security/trustdevice/import',
			{ device_list: devices },
		);
	}

	if (operation === 'getDeviceList') {
		const body: IDataObject = {
			type: deviceType(context, context.getNodeParameter('type', itemIndex), itemIndex),
			limit: integerInRange(
				context,
				context.getNodeParameter('limit', itemIndex, 100),
				'限制条数',
				itemIndex,
				1,
				100,
			),
		};
		const cursor = optionalText(
			context,
			context.getNodeParameter('cursor', itemIndex, ''),
			'游标',
			itemIndex,
		);
		if (cursor) body.cursor = cursor;
		return await weComApiRequest.call(context, 'POST', '/cgi-bin/security/trustdevice/list', body);
	}

	if (operation === 'getDeviceByUser') {
		return await weComApiRequest.call(context, 'POST', '/cgi-bin/security/trustdevice/get_by_user', {
			last_login_userid: requiredText(
				context,
				context.getNodeParameter('last_login_userid', itemIndex, '') ||
					context.getNodeParameter('last_login_userid_selected', itemIndex, ''),
				'成员 UserID',
				itemIndex,
			),
			type: deviceType(context, context.getNodeParameter('type', itemIndex), itemIndex),
		});
	}

	if (['deleteDevice', 'approveDevice', 'rejectDevice'].includes(operation)) {
		const deviceCodes = stringList(
			context,
			context.getNodeParameter('device_code_list', itemIndex, []),
			'设备编码列表',
			itemIndex,
			1,
			100,
		);
		const endpoint = {
			deleteDevice: '/cgi-bin/security/trustdevice/delete',
			approveDevice: '/cgi-bin/security/trustdevice/approve',
			rejectDevice: '/cgi-bin/security/trustdevice/reject',
		}[operation] as string;
		const body: IDataObject = { device_code_list: deviceCodes };
		if (operation === 'deleteDevice') {
			body.type = deviceType(context, context.getNodeParameter('type', itemIndex), itemIndex);
		}
		return await weComApiRequest.call(
			context,
			'POST',
			endpoint,
			body,
		);
	}

	if (operation === 'getScreenOperRecord') {
		const { startTime, endTime } = dateRange(
			context,
			context.getNodeParameter('start_time', itemIndex),
			context.getNodeParameter('end_time', itemIndex),
			itemIndex,
			14,
		);
		const body: IDataObject = { start_time: startTime, end_time: endTime };
		const userids = optionalList(
			context,
			[
				context.getNodeParameter('userid_list_text', itemIndex, ''),
				context.getNodeParameter('userid_list', itemIndex, []),
			],
			'用户 ID 列表',
			itemIndex,
		);
		if (userids.length) body.userid_list = userids;
		const departments = optionalList(
			context,
			[
				context.getNodeParameter('department_id_list', itemIndex, ''),
				context.getNodeParameter('department_id_list_selected', itemIndex, []),
			],
			'部门 ID 列表',
			itemIndex,
		).map((id) => integerInRange(context, id, '部门 ID', itemIndex, 1, 4294967295));
		if (departments.length) body.department_id_list = [...new Set(departments)];
		const screenType = Number(context.getNodeParameter('screen_shot_type', itemIndex, 0));
		if (screenType !== 0) {
			body.screen_shot_type = enumNumber(
				context,
				screenType,
				'截屏内容类型',
				itemIndex,
				[1, 2, 3, 4, 5, 6],
			);
		}
		const cursor = optionalText(
			context,
			context.getNodeParameter('cursor', itemIndex, ''),
			'游标',
			itemIndex,
		);
		if (cursor) body.cursor = cursor;
		body.limit = integerInRange(
			context,
			context.getNodeParameter('limit', itemIndex, 100),
			'限制条数',
			itemIndex,
			1,
			1000,
		);
		return await weComApiRequest.call(
			context,
			'POST',
			'/cgi-bin/security/get_screen_oper_record',
			body,
		);
	}

	if (operation === 'getVipList') {
		const body: IDataObject = {
			limit: integerInRange(
				context,
				context.getNodeParameter('limit', itemIndex, 100),
				'限制条数',
				itemIndex,
				1,
				200,
			),
		};
		const cursor = optionalText(
			context,
			context.getNodeParameter('cursor', itemIndex, ''),
			'游标',
			itemIndex,
		);
		if (cursor) body.cursor = cursor;
		return await weComApiRequest.call(context, 'POST', '/cgi-bin/security/vip/list', body);
	}

	if (['submitBatchAddVipJob', 'submitBatchDelVipJob'].includes(operation)) {
		const typed = context.getNodeParameter('vip_userids', itemIndex, '');
		const selected = context.getNodeParameter('userid_list', itemIndex, []);
		const userids = stringList(
			context,
			[typed, ...(Array.isArray(selected) ? selected : [selected])],
			'成员 UserID 列表',
			itemIndex,
			1,
			100,
		);
		const endpoint =
			operation === 'submitBatchAddVipJob'
				? '/cgi-bin/security/vip/submit_batch_add_job'
				: '/cgi-bin/security/vip/submit_batch_del_job';
		return await weComApiRequest.call(
			context,
			'POST',
			endpoint,
			{ userid_list: userids },
		);
	}

	if (['batchAddVipJobResult', 'batchDelVipJobResult'].includes(operation)) {
		const jobid = requiredText(
			context,
			context.getNodeParameter('jobid', itemIndex),
			'任务 ID',
			itemIndex,
			256,
		);
		const endpoint =
			operation === 'batchAddVipJobResult'
				? '/cgi-bin/security/vip/batch_add_job_result'
				: '/cgi-bin/security/vip/batch_del_job_result';
		return await weComApiRequest.call(
			context,
			'POST',
			endpoint,
			{ jobid },
		);
	}

	if (['getMemberOperLog', 'getAdminOperLog'].includes(operation)) {
		const { startTime, endTime } = dateRange(
			context,
			context.getNodeParameter('start_time', itemIndex),
			context.getNodeParameter('end_time', itemIndex),
			itemIndex,
			7,
			true,
		);
		const body: IDataObject = { start_time: startTime, end_time: endTime };
		const operationType = Number(context.getNodeParameter('oper_type', itemIndex, 0));
		if (operationType !== 0) {
			body.oper_type = enumNumber(
				context,
				operationType,
				'操作类型',
				itemIndex,
				operation === 'getMemberOperLog' ? MEMBER_OPERATION_TYPES : ADMIN_OPERATION_TYPES,
			);
		}
		const userid = optionalText(
			context,
			context.getNodeParameter('userid', itemIndex, '') ||
				context.getNodeParameter('userid_selected', itemIndex, ''),
			'操作者 UserID',
			itemIndex,
			128,
		);
		if (userid) body.userid = userid;
		const cursor = optionalText(
			context,
			context.getNodeParameter('cursor', itemIndex, ''),
			'游标',
			itemIndex,
		);
		if (cursor) body.cursor = cursor;
		body.limit = integerInRange(
			context,
			context.getNodeParameter('limit', itemIndex, 400),
			'限制条数',
			itemIndex,
			1,
			400,
		);
		const endpoint =
			operation === 'getMemberOperLog'
				? '/cgi-bin/security/member_oper_log/list'
				: '/cgi-bin/security/admin_oper_log/list';
		return await weComApiRequest.call(
			context,
			'POST',
			endpoint,
			body,
		);
	}

	if (operation === 'getServerDomainIp') {
		return await weComApiRequest.call(context, 'GET', '/cgi-bin/security/get_server_domain_ip');
	}

	fail(context, `不支持的安全管理操作: ${operation}`, itemIndex);
}

export async function executeSecurity(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	for (let i = 0; i < items.length; i++) {
		try {
			const responseData = await runOperation(this, operation, i);
			returnData.push({ json: responseData, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}
	return returnData;
}
