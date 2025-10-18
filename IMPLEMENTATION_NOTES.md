# 企业微信发送应用消息接口完整实现说明

## 概述

本次更新完全实现了企业微信官方文档（https://developer.work.weixin.qq.com/document/path/90236）中定义的所有发送应用消息接口。

## 实现的消息类型

根据官方文档，企业微信应用消息支持 12 种消息类型，本次实现已全部覆盖：

### 1. ✅ 文本消息 (text) - 已实现
- 文件：`sendText.ts`
- 功能：发送纯文本消息
- 特性：支持消息去重、ID转译、保密消息

### 2. ✅ Markdown消息 (markdown) - 已实现
- 文件：`sendMarkdown.ts`
- 功能：发送Markdown格式的消息
- 特性：支持Markdown语法格式化

### 3. ✅ 图片消息 (image) - 已实现
- 文件：`sendImage.ts`
- 功能：发送图片消息
- 特性：支持Media ID或直接上传文件

### 4. ✅ 语音消息 (voice) - 新增
- 文件：`sendVoice.ts`
- 功能：发送语音消息
- 特性：支持Media ID或直接上传文件（AMR、MP3格式）
- 字段：media_id, safe, enable_id_trans, enable_duplicate_check

### 5. ✅ 视频消息 (video) - 新增
- 文件：`sendVideo.ts`
- 功能：发送视频消息
- 特性：支持Media ID或直接上传文件（MP4格式）
- 字段：media_id, title, description, safe, enable_id_trans, enable_duplicate_check

### 6. ✅ 文件消息 (file) - 已实现
- 文件：`sendFile.ts`
- 功能：发送文件消息
- 特性：支持Media ID或直接上传文件

### 7. ✅ 文本卡片消息 (textcard) - 新增
- 文件：`sendTextCard.ts`
- 功能：发送带标题、描述和跳转链接的卡片消息
- 字段：title, description, url, btntxt, enable_id_trans, enable_duplicate_check

### 8. ✅ 图文消息 (news) - 新增
- 文件：`sendNews.ts`
- 功能：发送图文消息，支持1-8条图文
- 字段：articles (title, description, url, picurl)
- 特性：适合发送多条图文链接

### 9. ✅ 图文消息（mpnews） - 新增
- 文件：`sendMpNews.ts`
- 功能：发送富文本图文消息
- 字段：articles (title, thumb_media_id, author, content_source_url, content, digest)
- 特性：支持HTML内容，适合富文本展示

### 10. ✅ 小程序通知消息 (miniprogram_notice) - 新增
- 文件：`sendMiniprogramNotice.ts`
- 功能：发送小程序通知消息
- 字段：appid, page, title, description, emphasis_first_item, content_item
- 特性：支持小程序跳转和内容键值对

### 11. ✅ 任务卡片消息 (taskcard) - 新增
- 文件：`sendTaskCard.ts`
- 功能：发送带按钮的任务卡片消息
- 字段：title, description, url, task_id, btn (key, name, replace_name, color, is_bold)
- 特性：支持交互式按钮，可以实现任务确认等功能

### 12. ✅ 模板卡片消息 (template_card) - 新增
- 文件：`sendTemplateCard.ts`
- 功能：发送模板卡片消息，支持多种卡片类型
- 卡片类型：
  - `text_notice` - 文本通知型
  - `news_notice` - 图文展示型
  - `button_interaction` - 按钮交互型
  - `vote_interaction` - 投票选择型
  - `multiple_interaction` - 多项选择型
- 特性：最灵活的卡片消息类型，支持复杂的交互和展示

## 技术实现细节

### 文件结构
```
nodes/WeCom/resources/message/
├── index.ts                    # 消息资源入口，导出所有消息类型
├── execute.ts                  # 执行逻辑，处理所有消息类型的发送
├── sendText.ts                 # 文本消息定义
├── sendMarkdown.ts             # Markdown消息定义
├── sendImage.ts                # 图片消息定义
├── sendVoice.ts                # 语音消息定义（新增）
├── sendVideo.ts                # 视频消息定义（新增）
├── sendFile.ts                 # 文件消息定义
├── sendTextCard.ts             # 文本卡片消息定义（新增）
├── sendNews.ts                 # 图文消息定义（新增）
├── sendMpNews.ts               # 图文消息（mpnews）定义（新增）
├── sendMiniprogramNotice.ts    # 小程序通知消息定义（新增）
├── sendTaskCard.ts             # 任务卡片消息定义（新增）
└── sendTemplateCard.ts         # 模板卡片消息定义（新增）
```

### 代码特性

1. **完整的类型定义**
   - 所有字段都有 TypeScript 类型定义
   - 使用 n8n 的 INodeProperties 接口定义参数

2. **用户友好的界面**
   - 所有字段都有中文描述
   - 支持条件显示（displayOptions）
   - 提供默认值和验证

3. **灵活的输入方式**
   - 媒体消息支持 Media ID 或直接上传
   - 复杂结构支持 fixedCollection 或 JSON 输入
   - 支持 n8n 表达式

4. **完善的错误处理**
   - 参数验证
   - 文件上传错误处理
   - API 错误处理

5. **遵循官方文档**
   - 所有字段名称与官方文档一致
   - 支持所有可选参数
   - 实现所有特性（去重、ID转译、保密消息等）

## 使用示例

### 发送文本卡片消息
```javascript
{
  "touser": "zhangsan",
  "title": "系统通知",
  "description": "您有一个新的任务待处理",
  "url": "https://example.com/task/123",
  "btntxt": "查看详情"
}
```

### 发送图文消息
```javascript
{
  "touser": "@all",
  "articles": [
    {
      "title": "产品更新公告",
      "description": "我们发布了新版本",
      "url": "https://example.com/news/1",
      "picurl": "https://example.com/image.jpg"
    }
  ]
}
```

### 发送任务卡片
```javascript
{
  "touser": "zhangsan",
  "title": "请审批",
  "description": "李四提交了请假申请",
  "task_id": "task_001",
  "buttons": [
    {
      "key": "approve",
      "name": "同意",
      "color": "blue"
    },
    {
      "key": "reject",
      "name": "拒绝",
      "color": "red"
    }
  ]
}
```

## 测试建议

1. **基础消息测试**
   - 测试文本、Markdown、图片、文件消息
   - 验证接收人配置（单人、多人、@all、部门、标签）

2. **媒体消息测试**
   - 测试语音消息（AMR、MP3格式）
   - 测试视频消息（MP4格式，带标题和描述）
   - 测试文件上传功能

3. **卡片消息测试**
   - 测试文本卡片（跳转链接）
   - 测试图文消息（多条图文）
   - 测试任务卡片（按钮交互）

4. **高级功能测试**
   - 测试小程序通知消息
   - 测试模板卡片（各种卡片类型）
   - 测试消息去重功能
   - 测试ID转译功能

## 兼容性

- ✅ 完全兼容企业微信官方 API
- ✅ 支持所有文档中的参数和选项
- ✅ 支持最新的模板卡片功能
- ✅ 向后兼容现有的消息类型

## 参考文档

- [企业微信发送应用消息接口](https://developer.work.weixin.qq.com/document/path/90236)
- [n8n 节点开发文档](https://docs.n8n.io/integrations/creating-nodes/)

## 更新日期

2025-10-18

