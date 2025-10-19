import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendMarkdownDescription } from './sendMarkdown';
import { sendImageDescription } from './sendImage';
import { sendFileDescription } from './sendFile';
import { sendVoiceDescription } from './sendVoice';
import { sendVideoDescription } from './sendVideo';
import { sendTextCardDescription } from './sendTextCard';
import { sendNewsDescription } from './sendNews';
import { sendMpNewsDescription } from './sendMpNews';
import { sendMiniprogramNoticeDescription } from './sendMiniprogramNotice';
import { sendTaskCardDescription } from './sendTaskCard';
import { sendTemplateCardDescription } from './sendTemplateCard';
import { updateTemplateCardDescription } from './updateTemplateCard';
import { recallMessageDescription } from './recallMessage';
import { sendSchoolNoticeDescription } from './sendSchoolNotice';

const showOnlyForMessage = {
	resource: ['message'],
};

export const messageDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMessage,
		},
		options: [
			],
		default: '',
	},
	...sendTextDescription,
	...sendMarkdownDescription,
	...sendImageDescription,
	...sendVoiceDescription,
	...sendVideoDescription,
	...sendFileDescription,
	...sendTextCardDescription,
	...sendNewsDescription,
	...sendMpNewsDescription,
	...sendMiniprogramNoticeDescription,
	...sendTaskCardDescription,
	...sendTemplateCardDescription,
	...recallMessageDescription,
	...updateTemplateCardDescription,
	...sendSchoolNoticeDescription,
];
