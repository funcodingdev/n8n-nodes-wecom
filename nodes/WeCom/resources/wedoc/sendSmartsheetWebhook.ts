import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['sendSmartsheetWebhook'] };

export const sendSmartsheetWebhookDescription: INodeProperties[] = [
	{
		displayName: 'Webhook地址',
		name: 'webhook_url',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/smartsheet/webhook?...',
		description:
			'智能表格「接收外部数据」生成的地址；为空则从输入项的 webhook_url / webhookUrl / url 读取',
	},
	{
		displayName: '写入模式',
		name: 'webhook_mode',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '新增记录 add_records', value: 'add' },
			{ name: '更新记录 update_records', value: 'update' },
			{ name: '完整 JSON', value: 'json' },
		],
		default: 'json',
	},
	{
		displayName: '记录列表JSON',
		name: 'records_json',
		type: 'json',
		displayOptions: {
			show: { ...showOnly, webhook_mode: ['add', 'update'] },
		},
		default: '[]',
		description:
			'记录数组。新增示例：[{"values":{"FIELD_ID":[{"type":"text","text":"内容"}]}}]；更新需含 record_id',
	},
	{
		displayName: 'JSON 请求体',
		name: 'payload_json',
		type: 'json',
		typeOptions: { rows: 10 },
		displayOptions: { show: { ...showOnly, webhook_mode: ['json'] } },
		default: `{
  "add_records": [
    {
      "values": {
        "FIELD_ID": [
          {
            "type": "text",
            "text": "文本内容"
          }
        ]
      }
    }
  ]
}`,
		description: '完整请求体，须含 add_records 或 update_records',
	},
	{
		displayName: '说明',
		name: 'sendSmartsheetWebhookNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
		description:
			'也可在输入数据中提供 webhook_url。内容必须为 UTF-8，字段值结构见智能表格「接收外部数据」示例。',
	},
];
