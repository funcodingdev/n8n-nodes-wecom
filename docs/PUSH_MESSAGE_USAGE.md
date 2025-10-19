# 企业微信消息推送功能使用指南

## 概述

消息推送功能允许你在 n8n 工作流中接收和处理企业微信服务器推送的各类消息和事件。此功能**无需配置API凭证**，适用于构建被动接收消息的应用场景。

## 功能特性

### 支持的消息类型

1. **文本消息** - 接收用户发送的文本内容
2. **图片消息** - 接收用户发送的图片
3. **语音消息** - 接收用户发送的语音
4. **视频消息** - 接收用户发送的视频
5. **位置消息** - 接收用户发送的地理位置信息
6. **链接消息** - 接收用户发送的链接

### 支持的事件类型

1. **成员变更事件** - 通讯录成员的创建、更新、删除
2. **部门变更事件** - 通讯录部门的创建、更新、删除
3. **标签变更事件** - 通讯录标签的创建、更新、删除
4. **菜单事件** - 用户点击自定义菜单
5. **扫码事件** - 用户扫码操作
6. **拍照发图事件** - 用户拍照或选择图片
7. **地理位置事件** - 用户上报地理位置
8. **进入应用事件** - 用户进入应用
9. **批量任务完成事件** - 异步任务完成通知

## 使用方法

### 1. 添加企业微信节点

在 n8n 工作流中添加"企业微信"节点。

### 2. 选择消息推送资源

在节点配置中：
- **资源 (Resource)**: 选择 `消息推送`
- **操作 (Operation)**: 根据需要选择对应的消息或事件类型

### 3. 配置消息数据

根据选择的操作类型，提供相应的消息数据（JSON格式）。

## 使用示例

### 示例 1: 接收文本消息

**配置**:
- 资源: `消息推送`
- 操作: `接收文本消息`
- 消息内容: 
```json
{
  "ToUserName": "企业ID",
  "FromUserName": "UserID",
  "CreateTime": 1712345678,
  "MsgType": "text",
  "Content": "你好，这是一条测试消息",
  "MsgId": "1234567890123456",
  "AgentID": 1000002
}
```

**输出结果**:
```json
{
  "msgType": "text",
  "fromUser": "UserID",
  "toUser": "企业ID",
  "content": "你好，这是一条测试消息",
  "msgId": "1234567890123456",
  "createTime": 1712345678,
  "agentId": 1000002,
  "raw": { /* 原始消息数据 */ }
}
```

### 示例 2: 接收图片消息

**配置**:
- 资源: `消息推送`
- 操作: `接收图片消息`
- 消息内容:
```json
{
  "ToUserName": "企业ID",
  "FromUserName": "UserID",
  "CreateTime": 1712345678,
  "MsgType": "image",
  "PicUrl": "https://example.com/image.jpg",
  "MediaId": "MEDIA_ID",
  "MsgId": "1234567890123456",
  "AgentID": 1000002
}
```

**输出结果**:
```json
{
  "msgType": "image",
  "fromUser": "UserID",
  "toUser": "企业ID",
  "picUrl": "https://example.com/image.jpg",
  "mediaId": "MEDIA_ID",
  "msgId": "1234567890123456",
  "createTime": 1712345678,
  "agentId": 1000002,
  "raw": { /* 原始消息数据 */ }
}
```

### 示例 3: 接收成员变更事件

**配置**:
- 资源: `消息推送`
- 操作: `接收事件推送`
- 事件类型: `成员变更事件`
- 事件内容:
```json
{
  "ToUserName": "企业ID",
  "FromUserName": "sys",
  "CreateTime": 1712345678,
  "MsgType": "event",
  "Event": "change_contact",
  "ChangeType": "create_user",
  "UserID": "zhangsan",
  "Name": "张三",
  "Department": "1,2",
  "Mobile": "13800000000",
  "Position": "产品经理",
  "Gender": "1",
  "Email": "zhangsan@example.com"
}
```

**输出结果**:
```json
{
  "msgType": "event",
  "eventType": "change_contact",
  "fromUser": "sys",
  "toUser": "企业ID",
  "createTime": 1712345678,
  "event": "change_contact",
  "changeType": "create_user",
  "eventKey": null,
  "data": { /* 详细事件数据 */ },
  "raw": { /* 原始事件数据 */ }
}
```

### 示例 4: 接收位置消息

**配置**:
- 资源: `消息推送`
- 操作: `接收位置消息`
- 消息内容:
```json
{
  "ToUserName": "企业ID",
  "FromUserName": "UserID",
  "CreateTime": 1712345678,
  "MsgType": "location",
  "Location_X": 23.134521,
  "Location_Y": 113.358803,
  "Scale": 20,
  "Label": "广州市海珠区新港中路397号",
  "MsgId": "1234567890123456",
  "AgentID": 1000002,
  "AppType": "wxwork"
}
```

**输出结果**:
```json
{
  "msgType": "location",
  "fromUser": "UserID",
  "toUser": "企业ID",
  "locationX": 23.134521,
  "locationY": 113.358803,
  "scale": 20,
  "label": "广州市海珠区新港中路397号",
  "msgId": "1234567890123456",
  "createTime": 1712345678,
  "agentId": 1000002,
  "appType": "wxwork",
  "raw": { /* 原始消息数据 */ }
}
```

## 工作流集成示例

### 场景 1: 文本消息自动回复

```
Webhook 节点 → 企业微信(消息推送-接收文本) → IF 节点(判断关键词) → 企业微信(消息-发送文本)
```

### 场景 2: 成员入职自动欢迎

```
Webhook 节点 → 企业微信(消息推送-接收事件) → IF 节点(判断事件类型) → 企业微信(消息-发送欢迎消息)
```

### 场景 3: 图片识别处理

```
Webhook 节点 → 企业微信(消息推送-接收图片) → 下载素材 → AI图片识别 → 企业微信(消息-发送结果)
```

## 最佳实践

1. **错误处理**: 启用"Continue On Fail"选项，确保单条消息处理失败不影响后续消息
2. **数据验证**: 在处理消息前验证数据格式和必要字段
3. **日志记录**: 记录接收到的消息便于问题排查
4. **安全性**: 在实际应用中需要验证消息来源的真实性

## 注意事项

1. 此功能专门用于接收企业微信推送的消息，需要在企业微信后台配置回调URL
2. 消息数据需要按照企业微信官方文档的格式提供
3. 原始消息数据会保存在输出的 `raw` 字段中
4. 某些字段可能为 `null` 或 `undefined`，需要在工作流中做好空值处理

## 参考文档

- [企业微信官方文档 - 接收消息](https://developer.work.weixin.qq.com/document/path/90238)
- [企业微信官方文档 - 接收事件](https://developer.work.weixin.qq.com/document/path/90240)

