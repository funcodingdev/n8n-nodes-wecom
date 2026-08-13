import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['modDocMemberRule'] };
const authOptions = [
	{ name: '只读', value: 1 },
	{ name: '可编辑（仅智能表格）', value: 2 },
	{ name: '管理员', value: 7 },
];

function memberValues(includeAuth: boolean): INodeProperties[] {
	const values: INodeProperties[] = [
		{
			displayName: 'ID 类型',
			name: 'id_type',
			type: 'options',
			options: [
				{ name: '企业内成员 UserID', value: 'userid' },
				{ name: '外部用户临时 ID', value: 'tmp_external_userid' },
			],
			default: 'userid',
		},
		{
			displayName: '成员UserID',
			name: 'userid',
			type: 'string',
			required: true,
			displayOptions: { show: { id_type: ['userid'] } },
			default: '',
		},
		{
			displayName: '外部用户临时ID',
			name: 'tmp_external_userid',
			type: 'string',
			required: true,
			displayOptions: { show: { id_type: ['tmp_external_userid'] } },
			default: '',
		},
	];
	if (includeAuth) {
		values.push({
			displayName: '权限',
			name: 'auth',
			type: 'options',
			options: authOptions,
			default: 1,
			description: '管理员权限最多可设置 3 人',
		});
	}
	return values;
}

function memberCollection(
	name: string,
	displayName: string,
	placeholder: string,
	includeAuth: boolean,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder,
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: memberValues(includeAuth),
			},
		],
	};
}

export const modDocMemberRuleDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName:
			'企业微信官方接口的通知范围仅支持按人配置；更新和删除各最多 100 人，不支持部门。',
		name: 'docMemberNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
	},
	memberCollection('addMemberCollection', '添加通知范围', '添加成员', true),
	memberCollection('updateMemberCollection', '更新成员权限', '更新成员', true),
	memberCollection('delMemberCollection', '删除通知范围', '删除成员', false),
];
