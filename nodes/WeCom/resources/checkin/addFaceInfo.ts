import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddFaceInfo = {
	resource: ['checkin'],
	operation: ['addFaceInfo'],
};

export const addFaceInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddFaceInfo,
		},
		default: '',
		description: 'User ID of the employee',
		hint: '员工的UserID',
	},
	{
		displayName: '人脸图片Media ID',
		name: 'mediaid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddFaceInfo,
		},
		default: '',
		description: 'Media ID of the face image',
		hint: '人脸图片的MediaID',
	},
];

