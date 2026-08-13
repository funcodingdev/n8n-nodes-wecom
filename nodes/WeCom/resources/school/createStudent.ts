import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['createStudent'],
};

export const createStudentDescription: INodeProperties[] = [
	{
		displayName: '学生 UserID',
		name: 'student_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '学校内唯一，1–64 个 UTF-8 字节；必须以数字或字母开头，只能包含数字、字母、下划线、连字符、@ 和点',
	},
	{
		displayName: '学生姓名',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '学生姓名，长度为1~32个字符',
	},
	{
		displayName: '班级 ID 列表',
		name: 'department',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: '1,2',
		typeOptions: { rows: 2 },
		description:
			'学生所在班级，最多 20 个正整数；与下方 JSON 合并；支持逗号、中文逗号、竖线或换行分隔',
	},
	{
		displayName: '班级 ID 列表 JSON',
		name: 'departmentJson',
		type: 'json',
		displayOptions: {
			show: showOnly,
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 [1,2] 或 [{"departmentid":1}]',
	},
	{
		displayName: '学生手机号',
		name: 'mobile',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
	},
	{
		displayName: '是否发起邀请',
		name: 'to_invite',
		type: 'boolean',
		displayOptions: {
			show: showOnly,
		},
		default: true,
		description: '是否发起邀请，默认为true，仅验证的学校才能发起邀请',
	},
];
