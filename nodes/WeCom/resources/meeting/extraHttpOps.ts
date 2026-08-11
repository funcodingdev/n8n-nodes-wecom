import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 会议域补全 HTTP 操作（主能力已结构化；此处保留空表兼容） */
export type MeetingExtraHttpOp = ExtraHttpOp & {
	needsMeetingId?: boolean;
	needsRecordFileId?: boolean;
};

export const meetingExtraHttpOps: MeetingExtraHttpOp[] = [];

export const meetingExtraHttpOpsById: Record<string, MeetingExtraHttpOp> = Object.fromEntries(
	meetingExtraHttpOps.map((o) => [o.id, o]),
);

export const meetingExtraHttpOpsOptionValues = meetingExtraHttpOps.map((o) => o.id);
export const meetingExtraOpsNeedMeetingId = meetingExtraHttpOps
	.filter((o) => o.needsMeetingId)
	.map((o) => o.id);
export const meetingExtraOpsNeedRecordFileId = meetingExtraHttpOps
	.filter((o) => o.needsRecordFileId)
	.map((o) => o.id);

export function getMeetingExtraHttpOpOptions() {
	return extraHttpOpOptions(meetingExtraHttpOps);
}

export const meetingExtraHttpOpsDescription: INodeProperties[] = [];
