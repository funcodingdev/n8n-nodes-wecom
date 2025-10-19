import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export async function executePushMessage(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let result: IDataObject = {};

			if (operation === 'receiveText') {
				// 接收文本消息
				const messageDataStr = this.getNodeParameter('messageData', i) as string;
				const messageData = JSON.parse(messageDataStr);
				
				result = {
					msgType: 'text',
					fromUser: messageData.FromUserName,
					toUser: messageData.ToUserName,
					content: messageData.Content,
					msgId: messageData.MsgId,
					createTime: messageData.CreateTime,
					agentId: messageData.AgentID,
					raw: messageData,
				};

			} else if (operation === 'receiveImage') {
				// 接收图片消息
				const messageDataStr = this.getNodeParameter('messageData', i) as string;
				const messageData = JSON.parse(messageDataStr);
				
				result = {
					msgType: 'image',
					fromUser: messageData.FromUserName,
					toUser: messageData.ToUserName,
					picUrl: messageData.PicUrl,
					mediaId: messageData.MediaId,
					msgId: messageData.MsgId,
					createTime: messageData.CreateTime,
					agentId: messageData.AgentID,
					raw: messageData,
				};

			} else if (operation === 'receiveVoice') {
				// 接收语音消息
				const messageDataStr = this.getNodeParameter('messageData', i) as string;
				const messageData = JSON.parse(messageDataStr);
				
				result = {
					msgType: 'voice',
					fromUser: messageData.FromUserName,
					toUser: messageData.ToUserName,
					mediaId: messageData.MediaId,
					format: messageData.Format,
					msgId: messageData.MsgId,
					createTime: messageData.CreateTime,
					agentId: messageData.AgentID,
					raw: messageData,
				};

			} else if (operation === 'receiveVideo') {
				// 接收视频消息
				const messageDataStr = this.getNodeParameter('messageData', i) as string;
				const messageData = JSON.parse(messageDataStr);
				
				result = {
					msgType: 'video',
					fromUser: messageData.FromUserName,
					toUser: messageData.ToUserName,
					mediaId: messageData.MediaId,
					thumbMediaId: messageData.ThumbMediaId,
					msgId: messageData.MsgId,
					createTime: messageData.CreateTime,
					agentId: messageData.AgentID,
					raw: messageData,
				};

			} else if (operation === 'receiveLocation') {
				// 接收位置消息
				const messageDataStr = this.getNodeParameter('messageData', i) as string;
				const messageData = JSON.parse(messageDataStr);
				
				result = {
					msgType: 'location',
					fromUser: messageData.FromUserName,
					toUser: messageData.ToUserName,
					locationX: messageData.Location_X,
					locationY: messageData.Location_Y,
					scale: messageData.Scale,
					label: messageData.Label,
					msgId: messageData.MsgId,
					createTime: messageData.CreateTime,
					agentId: messageData.AgentID,
					appType: messageData.AppType,
					raw: messageData,
				};

			} else if (operation === 'receiveLink') {
				// 接收链接消息
				const messageDataStr = this.getNodeParameter('messageData', i) as string;
				const messageData = JSON.parse(messageDataStr);
				
				result = {
					msgType: 'link',
					fromUser: messageData.FromUserName,
					toUser: messageData.ToUserName,
					title: messageData.Title,
					description: messageData.Description,
					url: messageData.Url,
					picUrl: messageData.PicUrl,
					msgId: messageData.MsgId,
					createTime: messageData.CreateTime,
					agentId: messageData.AgentID,
					raw: messageData,
				};

			} else if (operation === 'receiveEvent') {
				// 接收事件推送
				const eventType = this.getNodeParameter('eventType', i) as string;
				const eventDataStr = this.getNodeParameter('eventData', i) as string;
				const eventData = JSON.parse(eventDataStr);
				
				result = {
					msgType: 'event',
					eventType,
					fromUser: eventData.FromUserName,
					toUser: eventData.ToUserName,
					createTime: eventData.CreateTime,
					event: eventData.Event,
					changeType: eventData.ChangeType,
					eventKey: eventData.EventKey,
					data: eventData,
					raw: eventData,
				};

			} else {
				throw new NodeOperationError(
					this.getNode(),
					`不支持的操作: ${operation}`,
					{ itemIndex: i },
				);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

