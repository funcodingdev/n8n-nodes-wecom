# n8n-nodes-wecom

[![npm version](https://img.shields.io/npm/v/n8n-nodes-wecom.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-wecom) [![GitHub release](https://img.shields.io/github/v/release/funcodingdev/n8n-nodes-wecom?include_prereleases&style=flat-square)](https://github.com/funcodingdev/n8n-nodes-wecom/releases)

这是一个 n8n 社区节点，让你可以在 [n8n](https://n8n.io/) 工作流中使用企业微信（WeChat Work）API。

## ⚠️ 重要提示

> **关于版本更新与稳定性**
>
> 本插件的设计初衷是提供**简单、稳定**的企业微信集成体验。我们以 N8N 官方原生节点（如 Telegram、Notion等）为标准，力求交互逻辑清晰直观。
>
> **开发原则：**
> 我们会审慎评估每一次代码变更，尽量维持现有节点结构和参数的稳定性，避免对生产环境造成不必要的影响。
>
> **注意事项：**
> 在极少数情况下，为了修复重大缺陷或适配企业微信 API 的关键变更，可能会引入必要的调整。
>
> **建议：**
> 生产环境更新前，请查看 [Release 日志](https://github.com/funcodingdev/n8n-nodes-wecom/releases)。如果涉及 Breaking Changes（破坏性变更），我们会显著标记。
>
> **文档说明：**
> 本文档旨在概括插件支持的核心功能。由于企业微信接口众多且更新频繁，本文档可能无法覆盖所有参数细节。遇有疑问，请优先参考 [企业微信官方 API 文档](https://developer.work.weixin.qq.com/document/path/90664)。

## 🤝 交流与支持

遇到问题或有功能建议？欢迎查阅 [企业微信官方文档](https://developer.work.weixin.qq.com/document/path/90664) 或加入我们的交流群。

### 💬 加入社区

|                          方式 1：扫码直接入群                          |                     方式 2：联系作者邀请                     |
| :--------------------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="./wechat_group_qrcode.jpg" width="200" alt="微信群二维码" /> | <img src="./wechat_qrcode.jpg" width="200" alt="作者微信" /> |
|                                 (推荐)                                 |               若群码失效，请备注 **n8n** 拉你                |

### 参与贡献

我们非常欢迎社区贡献！如果你发现了 bug、有新功能建议或想要改进代码：

- **提交 Issue**：[GitHub Issues](https://github.com/funcodingdev/n8n-nodes-wecom/issues) - 报告问题或提出功能建议
- **提交 Pull Request**：[GitHub Pull Requests](https://github.com/funcodingdev/n8n-nodes-wecom/pulls) - 贡献代码改进

无论是代码贡献、文档改进还是功能建议，我们都非常感谢！

---

## 🧩 节点分类

本插件按照企业微信官方文档的分类结构，提供以下节点：

### 1. 企业微信-基础

包含企业微信的基础通信和管理功能：

- **通讯录管理** - 成员、部门、标签管理
- **应用消息** - 发送各类应用消息
- **群聊会话** - 群聊管理和消息发送
- **消息推送** - 群机器人 Webhook 推送
- **企业互联** - 企业互联和上下游管理
- **素材管理** - 素材上传和管理
- **电子发票** - 电子发票查询和状态管理
- **第三方应用授权** - 获取第三方应用凭证
- **第三方应用接口调用许可** - 接口调用许可管理
- **第三方应用收银台** - 第三方应用收银台
- **第三方应用推广二维码** - 第三方应用推广二维码
- **账号 ID** - 自建应用与第三方应用的对接

### 2. 企业微信-办公

包含企业微信的协同办公功能：

- **日程管理** - 日历和日程管理
- **会议管理** - 会议预约、会议控制、录制管理
- **直播管理** - 直播创建、观看、统计管理
- **邮件管理** - 企业邮箱、邮件群组、公共邮箱
- **文档管理** - 在线文档、表格、智能表格
- **微盘管理** - 微盘空间和文件管理
- **打卡管理** - 打卡规则、打卡记录、排班管理
- **审批管理** - 审批模板、审批申请、假期管理
- **汇报管理** - 汇报记录、汇报统计
- **人事助手** - 员工花名册信息管理
- **会议室管理** - 会议室和会议室预定管理
- **紧急通知** - 语音电话等紧急通知

### 3. 企业微信-连接微信

包含企业微信连接微信的功能：

- **客户联系** - 客户管理、标签、继承、客户群、朋友圈、群发等
- **微信客服** - 客服账号、接待人员、消息收发、统计管理
- **家校应用** - 健康上报、上课直播、班级收款

### 4. 企业微信消息接收触发器

接收企业微信的消息和事件推送（支持普通接收和被动回复两种模式）

### 5. 企业微信第三方应用指令回调触发器

接收企业微信第三方应用的指令回调事件（授权、通讯录变更、ticket变化等）

## 🔒 隐私与安全

**本插件完全基于企业微信官方 API 开发，直连企业微信服务器，不经过任何第三方服务器。**

- ✅ **数据直连**：默认所有 API 请求直接发送到企业微信官方服务器 (`qyapi.weixin.qq.com`)
- ✅ **API 代理**：支持配置自定义 API Base URL，适用于需要通过代理访问企业微信 API 的网络环境（默认直连）
- ✅ **无数据缓存**：插件不存储、不缓存任何企业数据或用户信息
- ✅ **无第三方依赖**：不依赖任何第三方数据服务或分析服务
- ✅ **开源透明**：源代码完全开源，可随时审查和验证
- ✅ **本地运行**：所有数据处理均在你的 n8n 实例中进行

你的企业数据安全完全由你的 n8n 实例和企业微信官方平台保障。

## 📦 安装

在 n8n 中通过社区节点管理界面搜索 `n8n-nodes-wecom` 进行安装，或使用命令行：

```bash
npm install n8n-nodes-wecom
```

详细安装指南请参考 [n8n 社区节点文档](https://docs.n8n.io/integrations/community-nodes/installation/)。

## 🔑 凭证配置

### 消息推送凭证（WebHook URL）

**消息推送**功能用于通过群机器人 Webhook 发送消息到企业微信群聊

#### 配置步骤

1. 在企业微信群聊中，点击右上角"..."菜单
2. 选择"群机器人" > "添加机器人"
3. 创建一个机器人并复制 Webhook 地址
4. 在 n8n 中配置"企业微信群机器人 Webhook"凭证，填入 Webhook 地址

### 获取企业微信请求凭证（消息发送、通讯录、素材管理等功能需要）

1. 登录 [企业微信管理后台](https://work.weixin.qq.com/)
2. 进入"我的企业" > "企业信息"，复制 **企业ID (CorpID)**
3. 进入"应用管理" > 选择或创建一个应用
4. 复制 **AgentId**（应用ID）
5. 点击"查看Secret"，复制 **Secret**

### 获取企业微信消息接收凭证

1. 登录 [企业微信管理后台](https://work.weixin.qq.com/)
2. 进入"我的企业" > "企业信息"，复制 **企业ID (CorpID)**
3. 进入"应用管理" > 选择或创建一个应用
4. 启用 **API接收消息**，设置Token、EncodingAESKey
5. 在 n8n 中创建"企业微信消息接收触发器"节点：
   - 配置凭证（企业ID、Token、EncodingAESKey）
   - **Path** 表示 Webhook URL 的路径，建议使用应用 ID
   - 保存节点后，查看生成的 Webhook URL（例如：`https://your-n8n.com/webhook/1000001`）
6. 将 Webhook URL 填入企业微信后台的**接收消息服务器配置**中

**重要提示**：

- 企业微信每个应用只能配置一个接收消息 URL
- 多个工作流可以使用同一个凭证（同一应用ID），它们会共享同一个 Webhook URL 接收消息
- 不同应用请创建不同的凭证，使用不同的应用ID

### 获取企业微信第三方应用指令回调凭证

1. 登录 [企业微信服务商后台](https://open.work.weixin.qq.com/)
2. 进入"应用管理" > "第三方应用"，选择或创建一个第三方应用
3. 复制 **第三方应用ID (SuiteID)**（以ww或wx开头）
4. 在"应用详情" > "开发信息"中，设置**指令回调URL**，配置Token、EncodingAESKey
5. 在 n8n 中创建"企业微信第三方应用指令回调触发器"节点：
   - 配置凭证（第三方应用ID、Token、EncodingAESKey）
   - **Path** 表示 Webhook URL 的路径，建议使用应用相关的唯一标识（例如：`suite/receive`）
   - 保存节点后，查看生成的 Webhook URL（例如：`https://your-n8n.com/webhook/suite/receive`）
6. 将 Webhook URL 填入企业微信服务商后台的**指令回调URL**配置中

**重要提示**：

- 第三方应用的指令回调使用SuiteID作为receiveid（而不是CorpID）
- 服务商收到推送后必须返回字符串 "success"，否则企业微信会把返回内容当作错误信息
- 支持的事件类型：授权变更、通讯录变更、Suite Ticket推送、应用变更等

## ✨ 已实现功能

以下功能按照企业微信官方文档分类组织：

---

## 一、基础功能（企业微信-基础 节点）

### 消息接收（触发器节点）

> [官方文档：接收消息与事件](https://developer.work.weixin.qq.com/document/path/90238)

**接收消息功能：**

- ✅ [接收企业微信应用消息回调](https://developer.work.weixin.qq.com/document/path/90238)
- ✅ [接收文本消息](https://developer.work.weixin.qq.com/document/path/90239)（包含 Content 字段）
- ✅ [接收图片消息](https://developer.work.weixin.qq.com/document/path/90239)（包含 PicUrl、MediaId 字段）
- ✅ [接收语音消息](https://developer.work.weixin.qq.com/document/path/90239)（包含 MediaId、Format 字段）
- ✅ [接收视频消息](https://developer.work.weixin.qq.com/document/path/90239)（包含 MediaId、ThumbMediaId 字段）
- ✅ [接收位置消息](https://developer.work.weixin.qq.com/document/path/90239)（包含 Location_X、Location_Y、Scale、Label、AppType 字段）
- ✅ [接收链接消息](https://developer.work.weixin.qq.com/document/path/90239)（包含 Title、Description、Url、PicUrl 字段）
- ✅ [接收事件推送](https://developer.work.weixin.qq.com/document/path/90240)（成员变更、部门变更等）
- ✅ [接口许可失效通知](https://developer.work.weixin.qq.com/document/path/90600)（当许可账号失效的企业成员访问应用时触发）
- ✅ URL 验证
- ✅ 消息加解密
- ✅ 签名验证

**被动回复消息功能：**

> [官方文档：被动回复消息](https://developer.work.weixin.qq.com/document/path/90241)

使用「企业微信消息接收（被动回复）触发器」+ 「企业微信-基础」节点的「被动回复」功能实现：

- ✅ [被动回复文本消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复图片消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复语音消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复视频消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复图文消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复模板卡片更新消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ 自动加密和签名
- ✅ 支持从工作流输出中读取回复内容

**工作流配置示例：**

```
[企业微信消息接收(被动回复)触发器] → [中间处理节点(可选)] → [企业微信-基础 (被动回复)]
```

> ⚠️ **重要提示**：
>
> - 被动回复节点**必须是工作流的最后一个节点**
> - 必须在**5秒内**返回响应，否则企业微信会认为请求失败
> - 请确保工作流处理时间足够快

**回调机制参考文档：**

- [回调机制说明](https://developer.work.weixin.qq.com/document/path/92520)
- [回调机制示例代码](https://developer.work.weixin.qq.com/document/path/92521)

**第三方应用指令回调功能：**

> [官方文档：第三方应用回调事件](https://developer.work.weixin.qq.com/document/path/91116)

使用「企业微信第三方应用指令回调触发器」接收第三方应用的指令回调事件：

- ✅ [接收授权成功通知](https://developer.work.weixin.qq.com/document/path/91118)
- ✅ [接收变更授权通知](https://developer.work.weixin.qq.com/document/path/91119)
- ✅ [接收取消授权通知](https://developer.work.weixin.qq.com/document/path/91120)
- ✅ [接收Suite Ticket推送](https://developer.work.weixin.qq.com/document/path/91117)
- ✅ [接收成员通知事件](https://developer.work.weixin.qq.com/document/path/91121)
- ✅ [接收部门通知事件](https://developer.work.weixin.qq.com/document/path/91122)
- ✅ [接收标签通知事件](https://developer.work.weixin.qq.com/document/path/91123)
- ✅ [接收共享应用事件回调](https://developer.work.weixin.qq.com/document/path/91124)
- ✅ [接收重置永久授权码通知](https://developer.work.weixin.qq.com/document/path/95437)
- ✅ [接收应用管理员变更通知](https://developer.work.weixin.qq.com/document/path/91125)
- ✅ [接收授权组织架构权限通知](https://developer.work.weixin.qq.com/document/path/91126)
- ✅ [接收获客助手权限变更通知](https://developer.work.weixin.qq.com/document/path/91127)
- ✅ [接收支付成功通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收退款结果通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收自动激活回调通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收下单成功通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收改单通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收支付成功通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收退款通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收应用版本变更通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收取消订单通知](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [接收注册完成回调事件](https://developer.work.weixin.qq.com/document/path/90585)
- ✅ [接收扫描推广二维码事件](https://developer.work.weixin.qq.com/document/path/98071)
- ✅ URL 验证
- ✅ 消息加解密（使用SuiteID作为receiveid）
- ✅ 签名验证
- ✅ 自动返回 "success" 响应（授权相关事件需在1000ms内响应）

**重要提示**：

- 第三方应用的指令回调使用SuiteID作为receiveid（而不是CorpID）
- 服务商收到推送后必须返回字符串 "success"，否则企业微信会把返回内容当作错误信息
- 授权相关事件（create_auth、change_auth、cancel_auth、reset_permanent_code）的响应必须在1000ms内完成
- 收到取消授权事件后，应当确保删除该企业所有相关的数据

### 消息推送（群机器人）

> [官方文档：消息推送配置说明](https://developer.work.weixin.qq.com/document/path/99110)

- ✅ 发送文本消息
- ✅ 发送 Markdown 消息
- ✅ 发送 Markdown V2 消息
- ✅ 发送图片消息
- ✅ 发送图文消息
- ✅ 发送文件消息
- ✅ 发送语音消息
- ✅ 发送模板卡片消息
  - 文本通知模板卡片
  - 图文展示模板卡片

### 应用消息发送

> [官方文档：发送应用消息](https://developer.work.weixin.qq.com/document/path/90236)

- ✅ 发送文本消息
- ✅ 发送 Markdown 消息
- ✅ 发送图片消息
- ✅ 发送语音消息
- ✅ 发送视频消息
- ✅ 发送文件消息
- ✅ 发送文本卡片消息
- ✅ 发送图文消息（news）
- ✅ 发送图文消息（mpnews）
- ✅ 发送小程序通知消息
- ✅ 发送任务卡片消息
- ✅ 发送模板卡片消息
- ✅ 发送并等待审批（n8n AI Tool Human Review，支持 URL 按钮和企业微信原生回调）
- ✅ [发送学校通知](https://developer.work.weixin.qq.com/document/path/91609)（家校应用）
- ✅ [撤回应用消息](https://developer.work.weixin.qq.com/document/path/94867)
- ✅ [更新模板卡片消息](https://developer.work.weixin.qq.com/document/path/94888)

#### AI 工具人工审批

在支持 Human Review for AI Tool Calls 的 n8n 版本中，将 WeCom 节点作为 AI Tool 连接到 Human Review 节点，选择“发送并等待审批”。节点会向企业微信发送含“通过/拒绝”按钮的模板卡片，并暂停工作流，直到有人操作或超过配置的等待时间。

审批方式：

- **URL 按钮**：按钮直接访问 n8n 生成并签名的恢复链接，不需要配置企业微信接收消息回调；无法校验实际点击人。
- **企业微信原生回调**：用户直接在企业微信内操作，通过 [`template_card_event`](https://developer.work.weixin.qq.com/document/path/90240) 返回实际审批成员 `FromUserName`，并在成功恢复工作流后以[被动回复](https://developer.work.weixin.qq.com/document/path/90241)将当前卡片更新为“已通过”或“已拒绝”。

原生回调配置：

1. 创建“企业微信消息接收触发器”，填写企业微信应用后台“接收消息”中的 URL、Token 和 EncodingAESKey，并激活工作流。
2. 保持触发器的“自动恢复原生 HITL 审批”开启。即使事件筛选未选择模板卡片事件，签名有效的 HITL 回调仍会自动恢复；选择“模板卡片事件-按钮点击”可同时在触发器输出中查看结果。
3. 在 Human Review 企业微信节点选择“企业微信原生回调”，并选择与触发器相同的“企业微信消息接收 API”凭证。
4. n8n 的 Trigger Webhook 与 waiting Webhook 必须使用同一个公网 HTTPS Origin；自托管实例应正确配置 `WEBHOOK_URL`。

原生按钮的 EventKey 包含经过消息接收 Token 签名的 n8n 恢复载荷；Trigger 会再次校验 n8n Origin、TaskId 和 waiting URL 签名参数后才执行中继。首次有效响应决定审批结果，重复点击不会再次恢复工作流。

### 群聊会话

> [官方文档：应用发送消息到群聊会话](https://developer.work.weixin.qq.com/document/path/90244)

- ✅ [创建群聊会话](https://developer.work.weixin.qq.com/document/path/90245)
- ✅ [获取群聊会话信息](https://developer.work.weixin.qq.com/document/path/98914)
- ✅ [修改群聊会话](https://developer.work.weixin.qq.com/document/path/98913)
- ✅ [发送消息到群聊](https://developer.work.weixin.qq.com/document/path/90248)
  - 发送文本消息到群聊（支持 `@群成员` / `@所有人`）
  - 发送图片消息到群聊
  - 发送文件消息到群聊
  - 发送 Markdown 消息到群聊
  - 发送图文消息到群聊

### 通讯录管理

> [官方文档：通讯录管理](https://developer.work.weixin.qq.com/document/path/90193)

#### 成员管理

- ✅ [创建成员](https://developer.work.weixin.qq.com/document/path/90195)
- ✅ [读取成员信息](https://developer.work.weixin.qq.com/document/path/90196)
- ✅ [更新成员](https://developer.work.weixin.qq.com/document/path/90197)
- ✅ [删除成员](https://developer.work.weixin.qq.com/document/path/90198)
- ✅ [批量删除成员](https://developer.work.weixin.qq.com/document/path/90199)
- ✅ [获取部门成员列表](https://developer.work.weixin.qq.com/document/path/90200)
- ✅ [获取部门成员详情](https://developer.work.weixin.qq.com/document/path/90201)
- ✅ [获取成员ID列表](https://developer.work.weixin.qq.com/document/path/96067)
- ✅ [userid与openid互换](https://developer.work.weixin.qq.com/document/path/90202)
- ✅ [登录二次验证](https://developer.work.weixin.qq.com/document/path/91623)
- ✅ [邀请成员](https://developer.work.weixin.qq.com/document/path/90975)
- ✅ [获取加入企业二维码](https://developer.work.weixin.qq.com/document/path/91714)
- ✅ [手机号获取userid](https://developer.work.weixin.qq.com/document/path/95402)
- ✅ [邮箱获取userid](https://developer.work.weixin.qq.com/document/path/95895)
- ✅ [临时外部联系人ID转换](https://developer.work.weixin.qq.com/document/path/98729)

#### 部门管理

- ✅ [创建部门](https://developer.work.weixin.qq.com/document/path/90205)
- ✅ [更新部门](https://developer.work.weixin.qq.com/document/path/90206)
- ✅ [删除部门](https://developer.work.weixin.qq.com/document/path/90207)
- ✅ [获取部门列表](https://developer.work.weixin.qq.com/document/path/90208)
- ✅ [获取子部门ID列表](https://developer.work.weixin.qq.com/document/path/95350)
- ✅ [获取单个部门详情](https://developer.work.weixin.qq.com/document/path/95351)

#### 标签管理

- ✅ [创建标签](https://developer.work.weixin.qq.com/document/path/90210)
- ✅ [更新标签名字](https://developer.work.weixin.qq.com/document/path/90211)
- ✅ [删除标签](https://developer.work.weixin.qq.com/document/path/90212)
- ✅ [获取标签成员](https://developer.work.weixin.qq.com/document/path/90213)
- ✅ [增加标签成员](https://developer.work.weixin.qq.com/document/path/90214)
- ✅ [删除标签成员](https://developer.work.weixin.qq.com/document/path/90215)
- ✅ [获取标签列表](https://developer.work.weixin.qq.com/document/path/90216)

#### 账号ID转换

> [官方文档：账号 ID](https://developer.work.weixin.qq.com/document/path/98728)

- ✅ [用户ID转OpenID](https://developer.work.weixin.qq.com/document/path/90202)
- ✅ [OpenID转用户ID](https://developer.work.weixin.qq.com/document/path/90202)
- ✅ [临时外部联系人ID转换](https://developer.work.weixin.qq.com/document/path/98729)
- ✅ [corpid转换（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [userid转换（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [external_userid转换（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [external_userid转换（客户群成员）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [unionid转换（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [external_userid查询pending_id（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [客户标签ID转换（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [微信客服ID转换（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [ID迁移完成状态设置（第三方应用）](https://developer.work.weixin.qq.com/document/path/95890)

#### 异步导入接口

> [官方文档：异步导入接口](https://developer.work.weixin.qq.com/document/path/90979)

- ✅ [增量更新成员](https://developer.work.weixin.qq.com/document/path/90980)
- ✅ [全量覆盖成员](https://developer.work.weixin.qq.com/document/path/90981)
- ✅ [全量覆盖部门](https://developer.work.weixin.qq.com/document/path/90982)
- ✅ [获取异步任务结果](https://developer.work.weixin.qq.com/document/path/90983)

#### 异步导出接口

> [官方文档：异步导出接口](https://developer.work.weixin.qq.com/document/path/94850)

- ✅ [导出成员](https://developer.work.weixin.qq.com/document/path/94849)
- ✅ [导出成员详情](https://developer.work.weixin.qq.com/document/path/94851)
- ✅ [导出部门](https://developer.work.weixin.qq.com/document/path/94852)
- ✅ [导出标签成员](https://developer.work.weixin.qq.com/document/path/94853)
- ✅ [获取导出结果](https://developer.work.weixin.qq.com/document/path/94854)

### 素材管理

> [官方文档：素材管理](https://developer.work.weixin.qq.com/document/path/91054)

- ✅ [上传临时素材](https://developer.work.weixin.qq.com/document/path/90253)
- ✅ [上传图片](https://developer.work.weixin.qq.com/document/path/90256)
- ✅ [异步上传临时素材](https://developer.work.weixin.qq.com/document/path/96219)
- ✅ [获取临时素材](https://developer.work.weixin.qq.com/document/path/90254)
- ✅ [获取高清语音素材](https://developer.work.weixin.qq.com/document/path/90255)

### 企业互联

> [官方文档：企业互联](https://developer.work.weixin.qq.com/document/path/93360)

#### 企业互联基础接口

- ✅ [获取应用共享信息](https://developer.work.weixin.qq.com/document/path/93403)
- ✅ [获取下级/下游企业的access_token](https://developer.work.weixin.qq.com/document/path/93359)
- ✅ [获取下级/下游企业小程序session](https://developer.work.weixin.qq.com/document/path/93355)

#### 上下游基础接口

> [官方文档：上下游](https://developer.work.weixin.qq.com/document/path/97213)

- ✅ [获取应用共享信息](https://developer.work.weixin.qq.com/document/path/95813)
- ✅ [获取下级/下游企业的access_token](https://developer.work.weixin.qq.com/document/path/95816)
- ✅ [获取下级/下游企业小程序session](https://developer.work.weixin.qq.com/document/path/95817)
- ✅ [上下游关联客户信息-已添加客户](https://developer.work.weixin.qq.com/document/path/95818)
- ✅ [上下游关联客户信息-未添加客户](https://developer.work.weixin.qq.com/document/path/97357)

#### 上下游通讯录管理

- ✅ [获取上下游信息](https://developer.work.weixin.qq.com/document/path/95820)
- ✅ [批量导入上下游联系人](https://developer.work.weixin.qq.com/document/path/95821)
- ✅ [获取异步任务结果](https://developer.work.weixin.qq.com/document/path/95823)
- ✅ [移除企业](https://developer.work.weixin.qq.com/document/path/95822)
- ✅ [查询成员自定义id](https://developer.work.weixin.qq.com/document/path/97441)
- ✅ [获取下级企业加入的上下游](https://developer.work.weixin.qq.com/document/path/97442)

#### 上下游规则

- ✅ [获取对接规则id列表](https://developer.work.weixin.qq.com/document/path/95631)
- ✅ [删除对接规则](https://developer.work.weixin.qq.com/document/path/95632)
- ✅ [获取对接规则详情](https://developer.work.weixin.qq.com/document/path/95633)
- ✅ [新增对接规则](https://developer.work.weixin.qq.com/document/path/95634)
- ✅ [更新对接规则](https://developer.work.weixin.qq.com/document/path/95635)

### 系统

> [官方文档：获取企业微信服务器IP段](https://developer.work.weixin.qq.com/document/path/92520)

- ✅ [获取企业微信接口IP段](https://developer.work.weixin.qq.com/document/path/92520)
- ✅ [获取企业微信回调IP段](https://developer.work.weixin.qq.com/document/path/92521)

### 电子发票

> [官方文档：电子发票](https://developer.work.weixin.qq.com/document/path/90283)

- ✅ [查询电子发票](https://developer.work.weixin.qq.com/document/path/90284)
- ✅ [更新发票状态](https://developer.work.weixin.qq.com/document/path/90285)
- ✅ [批量更新发票状态](https://developer.work.weixin.qq.com/document/path/90286)
- ✅ [批量查询电子发票](https://developer.work.weixin.qq.com/document/path/90287)

### 第三方应用授权

> [官方文档：应用授权](https://developer.work.weixin.qq.com/document/path/90600)

- ✅ [获取第三方应用凭证](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [获取预授权码](https://developer.work.weixin.qq.com/document/path/90601)
- ✅ [设置授权配置](https://developer.work.weixin.qq.com/document/path/90602)
- ✅ [获取企业永久授权码](https://developer.work.weixin.qq.com/document/path/100776)
- ✅ [获取企业授权信息](https://developer.work.weixin.qq.com/document/path/100779)
- ✅ [获取企业凭证](https://developer.work.weixin.qq.com/document/path/90605)
- ✅ [获取应用二维码](https://developer.work.weixin.qq.com/document/path/95430)
- ✅ [明文corpid转换为加密corpid](https://developer.work.weixin.qq.com/document/path/95890)
- ✅ [获取应用权限详情](https://developer.work.weixin.qq.com/document/path/99052)
- ✅ [获取应用管理员列表](https://developer.work.weixin.qq.com/document/path/100073)
- ✅ [获取订单列表](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [获取订单详情](https://developer.work.weixin.qq.com/document/path/90600)
- ✅ [延长试用期](https://developer.work.weixin.qq.com/document/path/90600)

### 第三方应用接口调用许可

> [官方文档：接口调用许可](https://developer.work.weixin.qq.com/document/path/95652)

- ✅ [下单购买账号](https://developer.work.weixin.qq.com/document/path/95644)
- ✅ [下单续期账号](https://developer.work.weixin.qq.com/document/path/95646)
- ✅ [获取订单列表](https://developer.work.weixin.qq.com/document/path/95647)
- ✅ [获取订单详情](https://developer.work.weixin.qq.com/document/path/95648)
- ✅ [获取订单中的账号列表](https://developer.work.weixin.qq.com/document/path/95649)
- ✅ [取消订单](https://developer.work.weixin.qq.com/document/path/96106)
- ✅ [下单购买多企业账号](https://developer.work.weixin.qq.com/document/path/98892)
- ✅ [获取多企业订单详情](https://developer.work.weixin.qq.com/document/path/98893)

### 第三方应用收银台

> [官方文档：第三方应用收银台](https://developer.work.weixin.qq.com/document/path/97654)

- ✅ [创建收款订单](https://developer.work.weixin.qq.com/document/path/98045)
- ✅ [取消收款订单](https://developer.work.weixin.qq.com/document/path/98046)
- ✅ [获取收款订单列表](https://developer.work.weixin.qq.com/document/path/98053)
- ✅ [获取收款订单详情](https://developer.work.weixin.qq.com/document/path/98054)
- ✅ [获取发票列表](https://developer.work.weixin.qq.com/document/path/99436)
- ✅ [标记开票状态](https://developer.work.weixin.qq.com/document/path/99437)
- ✅ [签名算法](https://developer.work.weixin.qq.com/document/path/98768)
- ✅ [使用余额支付订单](https://developer.work.weixin.qq.com/document/path/99415)

### 第三方应用推广二维码

> [官方文档：第三方应用推广二维码](https://developer.work.weixin.qq.com/document/path/90578)

- ✅ [获取注册码](https://developer.work.weixin.qq.com/document/path/90581)
- ✅ [查询注册状态](https://developer.work.weixin.qq.com/document/path/90582)
- ✅ [设置授权应用可见范围](https://developer.work.weixin.qq.com/document/path/90583)
- ✅ [设置通讯录同步完成](https://developer.work.weixin.qq.com/document/path/90584)
- ✅ [激活账号](https://developer.work.weixin.qq.com/document/path/95553)
- ✅ [获取激活码详情](https://developer.work.weixin.qq.com/document/path/95552)
- ✅ [获取企业的账号列表](https://developer.work.weixin.qq.com/document/path/95544)
- ✅ [获取成员的激活详情](https://developer.work.weixin.qq.com/document/path/95555)
- ✅ [账号继承](https://developer.work.weixin.qq.com/document/path/95673)
- ✅ [分配激活码给下游/下级企业](https://developer.work.weixin.qq.com/document/path/96059)
- ✅ [获取应用的接口许可状态](https://developer.work.weixin.qq.com/document/path/95844)
- ✅ [设置企业的许可自动激活状态](https://developer.work.weixin.qq.com/document/path/95873)
- ✅ [查询企业的许可自动激活状态](https://developer.work.weixin.qq.com/document/path/95874)
- ✅ [充值账户余额查询](https://developer.work.weixin.qq.com/document/path/100137)
- ✅ [民生优惠条件查询](https://developer.work.weixin.qq.com/document/path/96515)

**接口调用许可事件通知：**

- ✅ [接口许可失效通知](https://developer.work.weixin.qq.com/document/path/95716)
- ✅ [支付成功通知](https://developer.work.weixin.qq.com/document/path/95804)
- ✅ [退款结果通知](https://developer.work.weixin.qq.com/document/path/95805)
- ✅ [自动激活回调通知](https://developer.work.weixin.qq.com/document/path/95994)

---

## 二、办公功能（企业微信-办公 节点）

### 邮件管理

> [官方文档：邮件](https://developer.work.weixin.qq.com/document/path/95486)

#### 发送邮件

- ✅ [发送普通邮件](https://developer.work.weixin.qq.com/document/path/97445)
- ✅ [发送日程邮件](https://developer.work.weixin.qq.com/document/path/97854)
- ✅ [发送会议邮件](https://developer.work.weixin.qq.com/document/path/97855)

#### 获取接收的邮件

- ✅ [获取收件箱邮件列表](https://developer.work.weixin.qq.com/document/path/97369)
- ✅ [获取邮件内容](https://developer.work.weixin.qq.com/document/path/97979)

#### 管理应用邮箱账号

- ✅ [更新应用邮箱账号](https://developer.work.weixin.qq.com/document/path/97373)
- ✅ [查询应用邮箱账号](https://developer.work.weixin.qq.com/document/path/97991)

#### 管理邮件群组

- ✅ [创建邮件群组](https://developer.work.weixin.qq.com/document/path/95510)
- ✅ [更新邮件群组](https://developer.work.weixin.qq.com/document/path/97995)
- ✅ [删除邮件群组](https://developer.work.weixin.qq.com/document/path/97996)
- ✅ [获取邮件群组详情](https://developer.work.weixin.qq.com/document/path/97997)
- ✅ [模糊搜索邮件群组](https://developer.work.weixin.qq.com/document/path/97998)

#### 管理公共邮箱

- ✅ [创建公共邮箱](https://developer.work.weixin.qq.com/document/path/95511)
- ✅ [更新公共邮箱](https://developer.work.weixin.qq.com/document/path/98000)
- ✅ [删除公共邮箱](https://developer.work.weixin.qq.com/document/path/98001)
- ✅ [获取公共邮箱详情](https://developer.work.weixin.qq.com/document/path/98002)
- ✅ [模糊搜索公共邮箱](https://developer.work.weixin.qq.com/document/path/98003)

#### 客户端专用密码

- ✅ [获取客户端专用密码列表](https://developer.work.weixin.qq.com/document/path/100183)
- ✅ [删除客户端专用密码](https://developer.work.weixin.qq.com/document/path/100184)

#### 邮件高级功能账号管理

- ✅ [分配高级功能账号](https://developer.work.weixin.qq.com/document/path/99316)
- ✅ [取消高级功能账号](https://developer.work.weixin.qq.com/document/path/99317)
- ✅ [获取高级功能账号列表](https://developer.work.weixin.qq.com/document/path/99318)
- ✅ [禁用/启用邮箱账号](https://developer.work.weixin.qq.com/document/path/95512)

#### 其他邮件客户端登录设置

- ✅ [获取用户功能属性](https://developer.work.weixin.qq.com/document/path/95513)
- ✅ [更改用户功能属性](https://developer.work.weixin.qq.com/document/path/98008)
- ✅ [获取邮件未读数](https://developer.work.weixin.qq.com/document/path/95514)

### 文档管理

#### 管理文档

- ✅ [新建文档](https://developer.work.weixin.qq.com/document/path/97460)
- ✅ [重命名文档](https://developer.work.weixin.qq.com/document/path/97736)
- ✅ [删除文档](https://developer.work.weixin.qq.com/document/path/97735)
- ✅ [获取文档基础信息](https://developer.work.weixin.qq.com/document/path/97734)
- ✅ [分享文档](https://developer.work.weixin.qq.com/document/path/97733)

#### 编辑文档

- ✅ [编辑文档内容](https://developer.work.weixin.qq.com/document/path/97626)
- ✅ [编辑表格内容](https://developer.work.weixin.qq.com/document/path/97628)

#### 编辑智能表格内容

- ✅ [添加子表](https://developer.work.weixin.qq.com/document/path/99896)
- ✅ [删除子表](https://developer.work.weixin.qq.com/document/path/99899)
- ✅ [更新子表](https://developer.work.weixin.qq.com/document/path/99898)
- ✅ [添加视图](https://developer.work.weixin.qq.com/document/path/99900)
- ✅ [删除视图](https://developer.work.weixin.qq.com/document/path/99901)
- ✅ [更新视图](https://developer.work.weixin.qq.com/document/path/99902)
- ✅ [添加字段](https://developer.work.weixin.qq.com/document/path/99904)
- ✅ [删除字段](https://developer.work.weixin.qq.com/document/path/99905)
- ✅ [更新字段](https://developer.work.weixin.qq.com/document/path/99906)
- ✅ [添加记录](https://developer.work.weixin.qq.com/document/path/99907)
- ✅ [删除记录](https://developer.work.weixin.qq.com/document/path/99908)
- ✅ [更新记录](https://developer.work.weixin.qq.com/document/path/99909)
- ✅ [接收外部数据到智能表格](https://developer.work.weixin.qq.com/document/path/101239/)

#### 获取文档数据

- ✅ [获取文档数据](https://developer.work.weixin.qq.com/document/path/97659)
- ✅ [获取表格行列信息](https://developer.work.weixin.qq.com/document/path/97711)
- ✅ [获取表格数据](https://developer.work.weixin.qq.com/document/path/97661)

#### 获取智能表格数据

- ✅ [查询子表](https://developer.work.weixin.qq.com/document/path/99911)
- ✅ [查询视图](https://developer.work.weixin.qq.com/document/path/99913)
- ✅ [查询字段](https://developer.work.weixin.qq.com/document/path/99914)
- ✅ [查询记录](https://developer.work.weixin.qq.com/document/path/99915)

#### 设置文档权限

- ✅ [获取文档权限信息](https://developer.work.weixin.qq.com/document/path/97461)
- ✅ [修改文档加入规则](https://developer.work.weixin.qq.com/document/path/97778)
- ✅ [修改文档通知范围及权限](https://developer.work.weixin.qq.com/document/path/97781)
- ✅ [修改文档安全设置](https://developer.work.weixin.qq.com/document/path/97782)
- ✅ [管理智能表格内容权限](https://developer.work.weixin.qq.com/document/path/99935)

#### 管理收集表

- ✅ [创建收集表](https://developer.work.weixin.qq.com/document/path/97462)
- ✅ [编辑收集表](https://developer.work.weixin.qq.com/document/path/97816)
- ✅ [获取收集表信息](https://developer.work.weixin.qq.com/document/path/97817)
- ✅ [收集表的统计信息查询](https://developer.work.weixin.qq.com/document/path/97818)
- ✅ [读取收集表答案](https://developer.work.weixin.qq.com/document/path/97819)

#### 文档高级功能账号管理

- ✅ [分配高级功能账号](https://developer.work.weixin.qq.com/document/path/99516)
- ✅ [取消高级功能账号](https://developer.work.weixin.qq.com/document/path/99517)
- ✅ [获取高级功能账号列表](https://developer.work.weixin.qq.com/document/path/99518)

#### 文档素材管理

- ✅ [上传文档图片](https://developer.work.weixin.qq.com/document/path/99933)

### 日程管理

> [官方文档：日程](https://developer.work.weixin.qq.com/document/path/93647)

#### 管理日历

- ✅ [创建日历](https://developer.work.weixin.qq.com/document/path/93647)
- ✅ [更新日历](https://developer.work.weixin.qq.com/document/path/97716)
- ✅ [获取日历详情](https://developer.work.weixin.qq.com/document/path/97717)
- ✅ [删除日历](https://developer.work.weixin.qq.com/document/path/97718)

#### 管理日程

- ✅ [创建日程](https://developer.work.weixin.qq.com/document/path/93648)
- ✅ [更新日程](https://developer.work.weixin.qq.com/document/path/97720)
- ✅ [更新重复日程](https://developer.work.weixin.qq.com/document/path/96204)
- ✅ [新增日程参与者](https://developer.work.weixin.qq.com/document/path/97721)
- ✅ [删除日程参与者](https://developer.work.weixin.qq.com/document/path/97722)
- ✅ [获取日历下的日程列表](https://developer.work.weixin.qq.com/document/path/97723)
- ✅ [获取日程详情](https://developer.work.weixin.qq.com/document/path/97724)
- ✅ [取消日程](https://developer.work.weixin.qq.com/document/path/97725)

### 会议管理

> [官方文档：会议](https://developer.work.weixin.qq.com/document/path/99104)

#### 预约会议基础管理

- ✅ [创建预约会议](https://developer.work.weixin.qq.com/document/path/99104)
- ✅ [修改预约会议](https://developer.work.weixin.qq.com/document/path/99047)
- ✅ [取消预约会议](https://developer.work.weixin.qq.com/document/path/99048)
- ✅ [获取会议详情](https://developer.work.weixin.qq.com/document/path/99049)
- ✅ [获取成员会议ID列表](https://developer.work.weixin.qq.com/document/path/99050)

#### 会议统计管理

- ✅ [获取会议发起记录](https://developer.work.weixin.qq.com/document/path/99651)

#### 预约会议高级管理

- ✅ [创建预约会议（高级）](https://developer.work.weixin.qq.com/document/path/98148)
- ✅ [修改预约会议（高级）](https://developer.work.weixin.qq.com/document/path/98154)
- ✅ [获取会议受邀成员列表](https://developer.work.weixin.qq.com/document/path/98160)
- ✅ [更新会议受邀成员列表](https://developer.work.weixin.qq.com/document/path/98162)
- ✅ [获取实时会中成员列表](https://developer.work.weixin.qq.com/document/path/98157)
- ✅ [获取已参会成员列表](https://developer.work.weixin.qq.com/document/path/98156)

#### 会中控制管理

- ✅ [静音成员](https://developer.work.weixin.qq.com/document/path/98184)
- ✅ [移出成员](https://developer.work.weixin.qq.com/document/path/98181)
- ✅ [结束会议](https://developer.work.weixin.qq.com/document/path/98187)

#### 录制管理

- ✅ [获取会议录制列表](https://developer.work.weixin.qq.com/document/path/98192)
- ✅ [获取会议录制地址](https://developer.work.weixin.qq.com/document/path/98196)

#### 会议高级功能账号管理

- ✅ [分配高级功能账号](https://developer.work.weixin.qq.com/document/path/99508)
- ✅ [取消高级功能账号](https://developer.work.weixin.qq.com/document/path/99509)
- ✅ [获取高级功能账号列表](https://developer.work.weixin.qq.com/document/path/99510)

### 直播管理

> [官方文档：直播](https://developer.work.weixin.qq.com/document/path/93633)

- ✅ [创建预约直播](https://developer.work.weixin.qq.com/document/path/93637)
- ✅ [修改预约直播](https://developer.work.weixin.qq.com/document/path/93640)
- ✅ [取消预约直播](https://developer.work.weixin.qq.com/document/path/93638)
- ✅ [删除直播回放](https://developer.work.weixin.qq.com/document/path/93874)
- ✅ [在微信中观看直播或回放](https://developer.work.weixin.qq.com/document/path/93641)
- ✅ [获取成员直播ID列表](https://developer.work.weixin.qq.com/document/path/93634)
- ✅ [获取直播详情](https://developer.work.weixin.qq.com/document/path/93635)
- ✅ [获取直播观看明细](https://developer.work.weixin.qq.com/document/path/93636)
- ✅ [获取跳转小程序商城的直播观众信息](https://developer.work.weixin.qq.com/document/path/94442)

### 微盘管理

> [官方文档：微盘](https://developer.work.weixin.qq.com/document/path/93654)

#### 空间管理

- ✅ [创建空间](https://developer.work.weixin.qq.com/document/path/93654)
- ✅ [重命名空间](https://developer.work.weixin.qq.com/document/path/93656)
- ✅ [删除空间](https://developer.work.weixin.qq.com/document/path/97884)
- ✅ [获取空间信息](https://developer.work.weixin.qq.com/document/path/93655)
- ✅ [添加空间成员](https://developer.work.weixin.qq.com/document/path/93658)
- ✅ [移除空间成员](https://developer.work.weixin.qq.com/document/path/93659)
- ✅ [空间安全设置](https://developer.work.weixin.qq.com/document/path/97886)
- ✅ [获取空间邀请链接](https://developer.work.weixin.qq.com/document/path/97967)

#### 文件管理

- ✅ [获取文件列表](https://developer.work.weixin.qq.com/document/path/93657)
- ✅ [上传文件](https://developer.work.weixin.qq.com/document/path/93662)
- ✅ [下载文件](https://developer.work.weixin.qq.com/document/path/93663)
- ✅ [创建文件夹](https://developer.work.weixin.qq.com/document/path/97970)
- ✅ [重命名文件](https://developer.work.weixin.qq.com/document/path/97971)
- ✅ [移动文件](https://developer.work.weixin.qq.com/document/path/97972)
- ✅ [删除文件](https://developer.work.weixin.qq.com/document/path/97973)
- ✅ [获取文件信息](https://developer.work.weixin.qq.com/document/path/97974)

#### 文件权限管理

- ✅ [添加文件成员](https://developer.work.weixin.qq.com/document/path/97975)
- ✅ [移除文件成员](https://developer.work.weixin.qq.com/document/path/97976)
- ✅ [文件分享设置](https://developer.work.weixin.qq.com/document/path/97977)
- ✅ [获取文件分享链接](https://developer.work.weixin.qq.com/document/path/97978)
- ✅ [获取文件权限信息](https://developer.work.weixin.qq.com/document/path/97979)
- ✅ [文件安全设置](https://developer.work.weixin.qq.com/document/path/97980)

### 打卡管理

> [官方文档：打卡](https://developer.work.weixin.qq.com/document/path/90262)

- ✅ [获取企业所有打卡规则](https://developer.work.weixin.qq.com/document/path/93384)
- ✅ [获取员工打卡规则](https://developer.work.weixin.qq.com/document/path/90263)
- ✅ [获取打卡记录数据](https://developer.work.weixin.qq.com/document/path/90262)
- ✅ [获取打卡日报数据](https://developer.work.weixin.qq.com/document/path/93374)
- ✅ [获取打卡月报数据](https://developer.work.weixin.qq.com/document/path/93387)
- ✅ [获取打卡人员排班信息](https://developer.work.weixin.qq.com/document/path/93380)
- ✅ [为打卡人员排班](https://developer.work.weixin.qq.com/document/path/93385)
- ✅ [为打卡人员补卡](https://developer.work.weixin.qq.com/document/path/95803)
- ✅ [添加打卡记录](https://developer.work.weixin.qq.com/document/path/99647)
- ✅ [录入打卡人员人脸信息](https://developer.work.weixin.qq.com/document/path/93378)
- ✅ [获取设备打卡数据](https://developer.work.weixin.qq.com/document/path/94126)
- ✅ [管理打卡规则](https://developer.work.weixin.qq.com/document/path/98041)

### 审批管理

> [官方文档：审批](https://developer.work.weixin.qq.com/document/path/91854)

- ✅ [获取审批模板详情](https://developer.work.weixin.qq.com/document/path/91982)
- ✅ [提交审批申请](https://developer.work.weixin.qq.com/document/path/91853)
- ✅ [批量获取审批单号](https://developer.work.weixin.qq.com/document/path/91816)
- ✅ [获取审批申请详情](https://developer.work.weixin.qq.com/document/path/91983)
- ✅ [获取企业假期管理配置](https://developer.work.weixin.qq.com/document/path/93375)
- ✅ [获取成员假期余额](https://developer.work.weixin.qq.com/document/path/93376)
- ✅ [修改成员假期余额](https://developer.work.weixin.qq.com/document/path/93377)
- ✅ [创建审批模板](https://developer.work.weixin.qq.com/document/path/97437)
- ✅ [更新审批模板](https://developer.work.weixin.qq.com/document/path/97438)

### 汇报管理

> [官方文档：汇报](https://developer.work.weixin.qq.com/document/path/93496)

- ✅ [批量获取汇报记录单号](https://developer.work.weixin.qq.com/document/path/93393)
- ✅ [获取汇报记录详情](https://developer.work.weixin.qq.com/document/path/93394)
- ✅ [获取汇报统计数据](https://developer.work.weixin.qq.com/document/path/93395)
- ✅ [下载微盘文件](https://developer.work.weixin.qq.com/document/path/98021)

### 人事助手

> [官方文档：人事助手](https://developer.work.weixin.qq.com/document/path/99130)

- ✅ [获取员工字段配置](https://developer.work.weixin.qq.com/document/path/99131)
- ✅ [获取员工花名册信息](https://developer.work.weixin.qq.com/document/path/99132)
- ✅ [更新员工花名册信息](https://developer.work.weixin.qq.com/document/path/99133)

### 会议室管理

> [官方文档：会议室](https://developer.work.weixin.qq.com/document/path/93618)

- ✅ [会议室管理](https://developer.work.weixin.qq.com/document/path/93619)
- ✅ [会议室预定管理](https://developer.work.weixin.qq.com/document/path/93620)
- ✅ [批量获取申请单ID](https://developer.work.weixin.qq.com/document/path/99883)
- ✅ [获取申请单详细信息](https://developer.work.weixin.qq.com/document/path/99885)
- ✅ [设置审批单审批信息](https://developer.work.weixin.qq.com/document/path/99880)

### 紧急通知应用

> [官方文档：紧急通知](https://developer.work.weixin.qq.com/document/path/91623)

- ✅ [发起语音电话](https://developer.work.weixin.qq.com/document/path/91627)
- ✅ [获取接听状态](https://developer.work.weixin.qq.com/document/path/91628)

---

## 三、连接微信功能（企业微信-连接微信 节点）

### 客户联系

> [官方文档：客户联系](https://developer.work.weixin.qq.com/document/path/92109)

#### 企业服务人员管理

- ✅ [获取配置了客户联系功能的成员列表](https://developer.work.weixin.qq.com/document/path/92571)

#### 客户管理

- ✅ [获取客户列表](https://developer.work.weixin.qq.com/document/path/92113)
- ✅ [获取客户详情](https://developer.work.weixin.qq.com/document/path/92114)
- ✅ [批量获取客户详情](https://developer.work.weixin.qq.com/document/path/92994)
- ✅ [修改客户备注信息](https://developer.work.weixin.qq.com/document/path/92115)

#### 客户标签管理

- ✅ [获取企业标签库](https://developer.work.weixin.qq.com/document/path/92117)
- ✅ [添加企业客户标签](https://developer.work.weixin.qq.com/document/path/92117)
- ✅ [编辑企业客户标签](https://developer.work.weixin.qq.com/document/path/92117)
- ✅ [删除企业客户标签](https://developer.work.weixin.qq.com/document/path/92117)
- ✅ [编辑客户企业标签](https://developer.work.weixin.qq.com/document/path/92118)

#### 在职继承

- ✅ [分配在职成员的客户](https://developer.work.weixin.qq.com/document/path/92125)
- ✅ [查询客户接替状态](https://developer.work.weixin.qq.com/document/path/94088)
- ✅ [分配在职成员的客户群](https://developer.work.weixin.qq.com/document/path/95703)

#### 离职继承

- ✅ [获取待分配的离职成员列表](https://developer.work.weixin.qq.com/document/path/92124)
- ✅ [分配离职成员的客户](https://developer.work.weixin.qq.com/document/path/94081)
- ✅ [查询客户接替状态](https://developer.work.weixin.qq.com/document/path/94082)
- ✅ [分配离职成员的客户群](https://developer.work.weixin.qq.com/document/path/92127)

#### 客户群管理

- ✅ [获取客户群列表](https://developer.work.weixin.qq.com/document/path/92120)
- ✅ [获取客户群详情](https://developer.work.weixin.qq.com/document/path/92122)
- ✅ [客户群opengid转换](https://developer.work.weixin.qq.com/document/path/94822)

#### 联系我与客户入群方式

- ✅ [配置客户联系「联系我」方式](https://developer.work.weixin.qq.com/document/path/92228)
- ✅ [获取企业已配置的「联系我」方式](https://developer.work.weixin.qq.com/document/path/92228)
- ✅ [更新企业已配置的「联系我」方式](https://developer.work.weixin.qq.com/document/path/92228)
- ✅ [删除企业已配置的「联系我」方式](https://developer.work.weixin.qq.com/document/path/92228)
- ✅ [配置客户群进群方式](https://developer.work.weixin.qq.com/document/path/92229)
- ✅ [获取客户群进群方式配置](https://developer.work.weixin.qq.com/document/path/92229)
- ✅ [更新客户群进群方式配置](https://developer.work.weixin.qq.com/document/path/92229)
- ✅ [删除客户群进群方式配置](https://developer.work.weixin.qq.com/document/path/92229)

#### 客户朋友圈

> [官方文档：客户朋友圈概述](https://developer.work.weixin.qq.com/document/path/93506)

- ✅ [企业发表内容到客户的朋友圈](https://developer.work.weixin.qq.com/document/path/95094)
- ✅ [停止发表企业朋友圈](https://developer.work.weixin.qq.com/document/path/97612)
- ✅ [获取客户朋友圈全部的发表记录](https://developer.work.weixin.qq.com/document/path/93333)
- ✅ [获取客户朋友圈企业发表的列表](https://developer.work.weixin.qq.com/document/path/93333)

#### 消息推送

- ✅ [创建企业群发](https://developer.work.weixin.qq.com/document/path/92135)
- ✅ [提醒成员群发](https://developer.work.weixin.qq.com/document/path/97610)
- ✅ [停止企业群发](https://developer.work.weixin.qq.com/document/path/97611)
- ✅ [获取企业的全部群发记录](https://developer.work.weixin.qq.com/document/path/93338)
- ✅ [发送新客户欢迎语](https://developer.work.weixin.qq.com/document/path/92137)
- ✅ [添加入群欢迎语素材](https://developer.work.weixin.qq.com/document/path/92366)
- ✅ [编辑入群欢迎语素材](https://developer.work.weixin.qq.com/document/path/92366)
- ✅ [获取入群欢迎语素材](https://developer.work.weixin.qq.com/document/path/92366)
- ✅ [删除入群欢迎语素材](https://developer.work.weixin.qq.com/document/path/92366)

#### 统计管理

- ✅ [获取「联系客户统计」数据](https://developer.work.weixin.qq.com/document/path/92132)
- ✅ [获取「群聊数据统计」数据](https://developer.work.weixin.qq.com/document/path/92133)

#### 其他接口

- ✅ [管理商品图册](https://developer.work.weixin.qq.com/document/path/95096)
- ✅ [管理聊天敏感词](https://developer.work.weixin.qq.com/document/path/95097)
- ✅ [上传附件资源](https://developer.work.weixin.qq.com/document/path/95098)
- ✅ [获客助手](https://developer.work.weixin.qq.com/document/path/97297)
- ✅ [获取已服务的外部联系人](https://developer.work.weixin.qq.com/document/path/99434)

### 微信客服

> [官方文档：微信客服](https://developer.work.weixin.qq.com/document/path/94638)

#### 客服账号管理

- ✅ [添加客服账号](https://developer.work.weixin.qq.com/document/path/94662)
- ✅ [删除客服账号](https://developer.work.weixin.qq.com/document/path/94663)
- ✅ [修改客服账号](https://developer.work.weixin.qq.com/document/path/94664)
- ✅ [获取客服账号列表](https://developer.work.weixin.qq.com/document/path/94661)
- ✅ [获取客服账号链接](https://developer.work.weixin.qq.com/document/path/94665)

#### 接待人员管理

- ✅ [添加接待人员](https://developer.work.weixin.qq.com/document/path/94646)
- ✅ [删除接待人员](https://developer.work.weixin.qq.com/document/path/94647)
- ✅ [获取接待人员列表](https://developer.work.weixin.qq.com/document/path/94645)

#### 会话分配与消息收发

- ✅ [分配客服会话](https://developer.work.weixin.qq.com/document/path/94669)
- ✅ [发送消息](https://developer.work.weixin.qq.com/document/path/94677)
- ✅ [发送欢迎语等事件响应消息](https://developer.work.weixin.qq.com/document/path/95122)
- ✅ [读取消息](https://developer.work.weixin.qq.com/document/path/94670)
- ✅ [「升级服务」配置](https://developer.work.weixin.qq.com/document/path/94674)
- ✅ [获取客户基础信息](https://developer.work.weixin.qq.com/document/path/95159)

#### 统计管理

- ✅ [获取「客户数据统计」企业汇总数据](https://developer.work.weixin.qq.com/document/path/95489)
- ✅ [获取「客户数据统计」接待人员明细数据](https://developer.work.weixin.qq.com/document/path/95490)

#### 机器人管理

- ✅ [知识库分组管理](https://developer.work.weixin.qq.com/document/path/95971)
- ✅ [知识库问答管理](https://developer.work.weixin.qq.com/document/path/95972)

### 家校应用

#### 健康上报

- ✅ [获取健康上报使用统计](https://developer.work.weixin.qq.com/document/path/93676)
- ✅ [获取健康上报任务ID列表](https://developer.work.weixin.qq.com/document/path/93677)
- ✅ [获取健康上报任务详情](https://developer.work.weixin.qq.com/document/path/93678)
- ✅ [获取用户填写答案](https://developer.work.weixin.qq.com/document/path/93679)

#### 上课直播

- ✅ [获取老师直播ID列表](https://developer.work.weixin.qq.com/document/path/93739)
- ✅ [获取直播详情](https://developer.work.weixin.qq.com/document/path/93740)
- ✅ [获取观看直播统计（旧版）](https://developer.work.weixin.qq.com/document/path/93741)
- ✅ [获取未观看直播统计（旧版）](https://developer.work.weixin.qq.com/document/path/93742)
- ✅ [删除直播回放](https://developer.work.weixin.qq.com/document/path/93743)
- ✅ [获取观看直播统计V2](https://developer.work.weixin.qq.com/document/path/95793)
- ✅ [获取未观看直播统计V2](https://developer.work.weixin.qq.com/document/path/95795)

#### 班级收款

- ✅ [获取学生付款结果](https://developer.work.weixin.qq.com/document/path/94470)
- ✅ [获取订单详情](https://developer.work.weixin.qq.com/document/path/94471)

#### 家校沟通 - 基础接口

- ✅ [获取「学校通知」二维码](https://developer.work.weixin.qq.com/document/path/92320)
- ✅ [管理「学校通知」的关注模式](https://developer.work.weixin.qq.com/document/path/92318)
- ✅ [发送「学校通知」](https://developer.work.weixin.qq.com/document/path/92321)
- ✅ [管理「班级群创建方式」](https://developer.work.weixin.qq.com/document/path/92430)
- ✅ [外部联系人openid转换](https://developer.work.weixin.qq.com/document/path/92323)
- ✅ [获取可使用的家长范围](https://developer.work.weixin.qq.com/document/path/94895)

#### 家校沟通 - 网页授权登录

- ✅ [开始开发](https://developer.work.weixin.qq.com/document/path/91856)
- ✅ [构造网页授权链接](https://developer.work.weixin.qq.com/document/path/91857)
- ✅ [获取访问用户身份](https://developer.work.weixin.qq.com/document/path/91707)
- ✅ [获取家校访问用户身份](https://developer.work.weixin.qq.com/document/path/95791)

#### 家校沟通 - 学生与家长管理

- ✅ [创建学生](https://developer.work.weixin.qq.com/document/path/92325)
- ✅ [删除学生](https://developer.work.weixin.qq.com/document/path/92326)
- ✅ [更新学生](https://developer.work.weixin.qq.com/document/path/92327)
- ✅ [批量创建学生](https://developer.work.weixin.qq.com/document/path/92328)
- ✅ [批量删除学生](https://developer.work.weixin.qq.com/document/path/92329)
- ✅ [批量更新学生](https://developer.work.weixin.qq.com/document/path/92330)
- ✅ [创建家长](https://developer.work.weixin.qq.com/document/path/92331)
- ✅ [删除家长](https://developer.work.weixin.qq.com/document/path/92332)
- ✅ [更新家长](https://developer.work.weixin.qq.com/document/path/92333)
- ✅ [批量创建家长](https://developer.work.weixin.qq.com/document/path/92334)
- ✅ [批量删除家长](https://developer.work.weixin.qq.com/document/path/92335)
- ✅ [批量更新家长](https://developer.work.weixin.qq.com/document/path/92336)
- ✅ [读取学生或家长](https://developer.work.weixin.qq.com/document/path/92337)
- ✅ [获取部门学生详情](https://developer.work.weixin.qq.com/document/path/92338)
- ✅ [设置家校通讯录自动同步模式](https://developer.work.weixin.qq.com/document/path/92345)
- ✅ [获取部门家长详情](https://developer.work.weixin.qq.com/document/path/92446)

#### 家校沟通 - 部门管理

- ✅ [创建部门](https://developer.work.weixin.qq.com/document/path/92340)
- ✅ [更新部门](https://developer.work.weixin.qq.com/document/path/92341)
- ✅ [删除部门](https://developer.work.weixin.qq.com/document/path/92342)
- ✅ [获取部门列表](https://developer.work.weixin.qq.com/document/path/92343)
- ✅ [标准年级对照表](https://developer.work.weixin.qq.com/document/path/92344)
- ✅ [修改自动升年级的配置](https://developer.work.weixin.qq.com/document/path/92949)

#### 家校沟通 - 通讯录变更回调

- ✅ [成员变更事件](https://developer.work.weixin.qq.com/document/path/92032)
- ✅ [部门变更事件](https://developer.work.weixin.qq.com/document/path/92052)

### 政民沟通

#### 配置网格结构

- ✅ [添加网格](https://developer.work.weixin.qq.com/document/path/94478)
- ✅ [编辑网格](https://developer.work.weixin.qq.com/document/path/94479)
- ✅ [删除网格](https://developer.work.weixin.qq.com/document/path/94480)
- ✅ [获取网格列表](https://developer.work.weixin.qq.com/document/path/94481)
- ✅ [获取用户负责及参与的网格列表](https://developer.work.weixin.qq.com/document/path/94482)

#### 配置事件类别

- ✅ [添加事件类别](https://developer.work.weixin.qq.com/document/path/94536)
- ✅ [修改事件类别](https://developer.work.weixin.qq.com/document/path/94537)
- ✅ [删除事件类别](https://developer.work.weixin.qq.com/document/path/94538)
- ✅ [获取事件类别列表](https://developer.work.weixin.qq.com/document/path/94540)

#### 巡查上报

- ✅ [概述](https://developer.work.weixin.qq.com/document/path/93520)
- ✅ [获取配置的网格及网格负责人](https://developer.work.weixin.qq.com/document/path/93531)
- ✅ [获取单位巡查上报数据统计](https://developer.work.weixin.qq.com/document/path/93532)
- ✅ [获取个人巡查上报数据统计](https://developer.work.weixin.qq.com/document/path/93533)
- ✅ [获取上报事件分类统计](https://developer.work.weixin.qq.com/document/path/93534)
- ✅ [获取巡查上报事件列表](https://developer.work.weixin.qq.com/document/path/93536)
- ✅ [获取巡查上报的事件详情信息](https://developer.work.weixin.qq.com/document/path/93535)

#### 居民上报

- ✅ [概述](https://developer.work.weixin.qq.com/document/path/93513)
- ✅ [获取配置的网格及网格负责人](https://developer.work.weixin.qq.com/document/path/93514)
- ✅ [获取单位居民上报数据统计](https://developer.work.weixin.qq.com/document/path/93515)
- ✅ [获取个人居民上报数据统计](https://developer.work.weixin.qq.com/document/path/93516)
- ✅ [获取上报事件分类统计](https://developer.work.weixin.qq.com/document/path/93517)
- ✅ [获取居民上报事件列表](https://developer.work.weixin.qq.com/document/path/93518)
- ✅ [获取居民上报的事件详情信息](https://developer.work.weixin.qq.com/document/path/93519)

---

## 📚 参考资源

- [企业微信开发文档](https://developer.work.weixin.qq.com/document/)
- [企业微信API全局错误码](https://developer.work.weixin.qq.com/document/path/90313)
- [常见问题 - FAQ](https://developer.work.weixin.qq.com/document/path/90315)
- [n8n 官方文档](https://docs.n8n.io/)
- [n8n 社区节点开发文档](https://docs.n8n.io/integrations/creating-nodes/overview/)
- [n8n 社区节点开发示例](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)

## 📄 许可证

[MIT](LICENSE.md)
