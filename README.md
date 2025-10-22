# n8n-nodes-wecom

这是一个 n8n 社区节点，让你可以在 [n8n](https://n8n.io/) 工作流中使用企业微信（WeChat Work）API。

## 📦 节点分类

本插件按照企业微信官方文档的分类结构，提供以下节点：

### 1. 企业微信-基础

包含企业微信的基础通信和管理功能：

- **通讯录管理** - 成员、部门、标签管理
- **应用消息** - 发送各类应用消息
- **群聊会话** - 群聊管理和消息发送
- **消息推送** - 群机器人 Webhook 推送
- **企业互联** - 企业互联和上下游管理
- **素材管理** - 素材上传和管理

### 2. 企业微信-办公

包含企业微信的协同办公功能：

- **日程管理** - 日历和日程管理
- **会议管理** - 会议预约、会议控制、录制管理
- **邮件管理** - 企业邮箱、邮件群组、公共邮箱
- **文档管理** - 在线文档、表格、智能表格
- **微盘管理** - 微盘空间和文件管理

### 3. 企业微信消息接收（Trigger）

接收企业微信的消息和事件推送

### 4. 企业微信-连接微信

包含企业微信连接微信的功能：

- **微信客服** - 客服账号、接待人员、消息收发、统计管理

## 隐私与安全

**本插件完全基于企业微信官方 API 开发，直连企业微信服务器，不经过任何第三方服务器。**

- ✅ **数据直连**：所有 API 请求直接发送到企业微信官方服务器 (`qyapi.weixin.qq.com`)
- ✅ **无数据缓存**：插件不存储、不缓存任何企业数据或用户信息
- ✅ **无第三方依赖**：不依赖任何第三方数据服务或分析服务
- ✅ **开源透明**：源代码完全开源，可随时审查和验证
- ✅ **本地运行**：所有数据处理均在你的 n8n 实例中进行

你的企业数据安全完全由你的 n8n 实例和企业微信官方平台保障。

## 安装

在 n8n 中通过社区节点管理界面搜索 `n8n-nodes-wecom` 进行安装，或使用命令行：

```bash
npm install n8n-nodes-wecom
```

详细安装指南请参考 [n8n 社区节点文档](https://docs.n8n.io/integrations/community-nodes/installation/)。

## 凭证配置

### 消息推送功能（群机器人Webhook需要）

**消息推送**功能用于通过群机器人 Webhook 发送消息到企业微信群聊

#### 配置步骤

1. 在企业微信群聊中，点击右上角"..."菜单
2. 选择"群机器人" > "添加机器人"
3. 创建一个机器人并复制 Webhook 地址
4. 在 n8n 中配置"企业微信群机器人 Webhook"凭证，填入 Webhook 地址

### 获取企业微信凭证（消息发送、通讯录、素材管理等功能需要）

1. 登录 [企业微信管理后台](https://work.weixin.qq.com/)
2. 进入"我的企业" > "企业信息"，复制 **企业ID (CorpID)**
3. 进入"应用管理" > 选择或创建一个应用
4. 复制 **AgentId**（应用ID）
5. 点击"查看Secret"，复制 **Secret**

### 在 n8n 中配置

根据使用的节点类型选择对应的凭证：

#### 企业微信-基础 节点

1. 添加"企业微信-基础"节点到工作流
2. 根据选择的资源类型配置凭证：

   **通讯录、应用消息、群聊会话、企业互联、素材管理：**
   - 点击"Credential to connect with"
   - 选择"创建新凭证 - 企业微信 API"
   - 填入以下信息：
     - **企业 ID** - 你的企业 CorpID
     - **应用 Secret** - 应用的 Secret
     - **应用 ID** - 应用的 AgentID

   **消息推送（群机器人）：**
   - 点击"Credential to connect with"
   - 选择"创建新凭证 - 企业微信群机器人 Webhook API"
   - 填入群机器人的 Webhook URL

#### 企业微信-办公 节点

1. 添加"企业微信-办公"节点到工作流
2. 点击"Credential to connect with"
3. 选择"创建新凭证 - 企业微信 API"
4. 填入企业凭证信息（同上）

#### 企业微信-连接微信 节点

1. 添加"企业微信-连接微信"节点到工作流
2. 点击"Credential to connect with"
3. 选择"创建新凭证 - 企业微信 API"
4. 填入企业凭证信息（同上）

#### 企业微信消息接收 Trigger 节点

1. 添加"企业微信消息接收"触发器节点
2. 点击"Credential to connect with"
3. 选择"创建新凭证 - 企业微信消息接收 API"
4. 填入以下信息：
   - **企业 ID** - 你的企业 CorpID
   - **Token** - 你将在企业微信后台设置的 Token（两边必须一致）
   - **EncodingAESKey** - 你将在企业微信后台设置的密钥（两边必须一致，43位字符）
5. 复制节点的 Webhook URL
6. 在企业微信应用管理后台配置接收消息时，使用**相同的** Token 和 EncodingAESKey

**被动回复消息配置：**

如果需要在接收到用户消息后自动回复，可以启用"被动回复消息"功能：

1. 在触发器节点中，启用"被动回复消息"选项
2. 选择回复消息类型（文本、图片、语音、视频、图文）
3. 配置对应的字段名称
4. 在工作流中通过后续节点设置回复内容到指定字段

**注意事项：**

- 被动回复消息会自动进行加密和签名，无需手动处理
- 如果未在工作流中设置相应字段，文本消息会返回默认内容"感谢您的消息，我们已收到！"
- 媒体类型消息必须先通过素材管理接口上传获得 media_id，否则会报错
- 图文消息需要提供包含 Title、Url 等字段的数组
- 被动回复失败时会在输出数据的 `_passiveReplyError` 字段中记录错误信息

## 已实现功能

以下功能按照企业微信官方文档分类组织：

---

## 一、基础功能（企业微信-基础 节点）

### 📥 消息接收（Trigger 节点）

> 📖 [官方文档：接收消息与事件](https://developer.work.weixin.qq.com/document/path/90238)

**接收消息功能：**

- ✅ [接收企业微信应用消息回调](https://developer.work.weixin.qq.com/document/path/90238)
- ✅ [接收文本消息](https://developer.work.weixin.qq.com/document/path/90239)
- ✅ [接收图片消息](https://developer.work.weixin.qq.com/document/path/90239)
- ✅ [接收语音消息](https://developer.work.weixin.qq.com/document/path/90239)
- ✅ [接收视频消息](https://developer.work.weixin.qq.com/document/path/90239)
- ✅ [接收位置消息](https://developer.work.weixin.qq.com/document/path/90239)
- ✅ [接收链接消息](https://developer.work.weixin.qq.com/document/path/90239)
- ✅ [接收事件推送](https://developer.work.weixin.qq.com/document/path/90240)（成员变更、部门变更等）
- ✅ URL 验证
- ✅ 消息加解密
- ✅ 签名验证

**被动回复消息功能：**

> 📖 [官方文档：被动回复消息](https://developer.work.weixin.qq.com/document/path/90241)

- ✅ [被动回复文本消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复图片消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复语音消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复视频消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ [被动回复图文消息](https://developer.work.weixin.qq.com/document/path/90241)
- ✅ 自动加密和签名
- ✅ 支持从工作流输出中读取回复内容

**回调机制参考文档：**

- 📖 [回调机制说明](https://developer.work.weixin.qq.com/document/path/92520)
- 📖 [回调机制示例代码](https://developer.work.weixin.qq.com/document/path/92521)

### 📩 消息推送（群机器人）

> 📖 [官方文档：消息推送配置说明](https://developer.work.weixin.qq.com/document/path/99110)

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

### 📨 应用消息发送

> 📖 [官方文档：发送应用消息](https://developer.work.weixin.qq.com/document/path/90236)

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
- ✅ [发送学校通知](https://developer.work.weixin.qq.com/document/path/91609)（家校应用）
- ✅ [撤回应用消息](https://developer.work.weixin.qq.com/document/path/94867)
- ✅ [更新模板卡片消息](https://developer.work.weixin.qq.com/document/path/94888)

### 💬 群聊会话

> 📖 [官方文档：应用发送消息到群聊会话](https://developer.work.weixin.qq.com/document/path/90244)

- ✅ [创建群聊会话](https://developer.work.weixin.qq.com/document/path/90245)
- ✅ [获取群聊会话信息](https://developer.work.weixin.qq.com/document/path/98914)
- ✅ [修改群聊会话](https://developer.work.weixin.qq.com/document/path/98913)（修改群名、群主、添加/删除成员）
- ✅ [发送消息到群聊](https://developer.work.weixin.qq.com/document/path/90248)
  - 发送文本消息到群聊
  - 发送图片消息到群聊
  - 发送文件消息到群聊
  - 发送 Markdown 消息到群聊
  - 发送图文消息到群聊

### 👥 通讯录管理

> 📖 [官方文档：通讯录管理](https://developer.work.weixin.qq.com/document/path/90193)

#### 成员管理

- ✅ [创建成员](https://developer.work.weixin.qq.com/document/path/90195)
- ✅ [读取成员信息](https://developer.work.weixin.qq.com/document/path/90196)
- ✅ [更新成员](https://developer.work.weixin.qq.com/document/path/90197)
- ✅ [删除成员](https://developer.work.weixin.qq.com/document/path/90198)
- ✅ [批量删除成员](https://developer.work.weixin.qq.com/document/path/90199)
- ✅ [获取部门成员列表](https://developer.work.weixin.qq.com/document/path/90200)
- ✅ [获取部门成员详情](https://developer.work.weixin.qq.com/document/path/90201)
- ✅ [获取成员ID列表](https://developer.work.weixin.qq.com/document/path/96067)
- ✅ [手机号获取userid](https://developer.work.weixin.qq.com/document/path/95402)
- ✅ [邮箱获取userid](https://developer.work.weixin.qq.com/document/path/95895)
- ✅ [邀请成员](https://developer.work.weixin.qq.com/document/path/90975)
- ✅ [获取加入企业二维码](https://developer.work.weixin.qq.com/document/path/91714)

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

> 📖 [官方文档：账号 ID](https://developer.work.weixin.qq.com/document/path/98728)

- ✅ [用户ID转OpenID](https://developer.work.weixin.qq.com/document/path/90202)
- ✅ [OpenID转用户ID](https://developer.work.weixin.qq.com/document/path/90202)
- ✅ [临时外部联系人ID转换](https://developer.work.weixin.qq.com/document/path/98729)

#### 异步导入接口

> 📖 [官方文档：异步导入接口](https://developer.work.weixin.qq.com/document/path/90979)

- ✅ [增量更新成员](https://developer.work.weixin.qq.com/document/path/90980)
- ✅ [全量覆盖成员](https://developer.work.weixin.qq.com/document/path/90981)
- ✅ [全量覆盖部门](https://developer.work.weixin.qq.com/document/path/90982)
- ✅ [获取异步任务结果](https://developer.work.weixin.qq.com/document/path/90983)

#### 异步导出接口

> 📖 [官方文档：异步导出接口](https://developer.work.weixin.qq.com/document/path/94850)

- ✅ [导出成员](https://developer.work.weixin.qq.com/document/path/94849)
- ✅ [导出成员详情](https://developer.work.weixin.qq.com/document/path/94851)
- ✅ [导出部门](https://developer.work.weixin.qq.com/document/path/94852)
- ✅ [导出标签成员](https://developer.work.weixin.qq.com/document/path/94853)
- ✅ [获取导出结果](https://developer.work.weixin.qq.com/document/path/94854)

### 📦 素材管理

> 📖 [官方文档：素材管理](https://developer.work.weixin.qq.com/document/path/91054)

- ✅ [上传临时素材](https://developer.work.weixin.qq.com/document/path/90253)
- ✅ [上传图片](https://developer.work.weixin.qq.com/document/path/90256)
- ✅ [异步上传临时素材](https://developer.work.weixin.qq.com/document/path/96219)
- ✅ [获取临时素材](https://developer.work.weixin.qq.com/document/path/90254)
- ✅ [获取高清语音素材](https://developer.work.weixin.qq.com/document/path/90255)
- ✅ 上传永久素材
- ✅ 获取永久素材

### 🔗 企业互联

> 📖 [官方文档：企业互联](https://developer.work.weixin.qq.com/document/path/93360)

#### 企业互联基础接口

- ✅ [获取应用共享信息](https://developer.work.weixin.qq.com/document/path/93403)
- ✅ [获取下级/下游企业的access_token](https://developer.work.weixin.qq.com/document/path/93359)
- ✅ [获取下级/下游企业小程序session](https://developer.work.weixin.qq.com/document/path/93355)

#### 上下游基础接口

> 📖 [官方文档：上下游](https://developer.work.weixin.qq.com/document/path/97213)

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

### ⚙️ 系统

> 📖 [官方文档：获取企业微信服务器IP段](https://developer.work.weixin.qq.com/document/path/92520)

- ✅ [获取企业微信接口IP段](https://developer.work.weixin.qq.com/document/path/92520)
- ✅ [获取企业微信回调IP段](https://developer.work.weixin.qq.com/document/path/92521)

**用途说明：**

这些接口用于获取企业微信服务器的IP地址段，可用于：

- **安全配置**：将获取到的IP段添加到防火墙白名单，只允许企业微信服务器访问
- **接口调用安全**：配置API接口IP段白名单，防止非法调用
- **回调安全**：配置回调服务器IP段白名单，确保只接收来自企业微信官方服务器的回调请求
- **网络隔离**：在专网或VPN环境中，只开放对企业微信服务器IP段的访问权限

---

## 二、办公功能（企业微信-办公 节点）

### 📧 邮件管理

> 📖 [官方文档：邮件](https://developer.work.weixin.qq.com/document/path/95486)

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

### 📄 文档管理

#### 管理文档

- ✅ [新建文档](https://developer.work.weixin.qq.com/document/path/97460)（文档/表格/智能表格）
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
- ✅ [修改文档查看规则](https://developer.work.weixin.qq.com/document/path/97778)
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

### 📅 日程管理

> 📖 [官方文档：日程](https://developer.work.weixin.qq.com/document/path/93647)

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

### 🎥 会议管理

> 📖 [官方文档：会议](https://developer.work.weixin.qq.com/document/path/99104)

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

### 💾 微盘管理

> 📖 [官方文档：微盘](https://developer.work.weixin.qq.com/document/path/93654)

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

---

## 三、连接微信功能（企业微信-连接微信 节点）

### 📱 微信客服

> 📖 [官方文档：微信客服](https://developer.work.weixin.qq.com/document/path/94638)

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
- ✅ [「升级服务」配置](https://developer.work.weixin.qq.com/document/path/94674)
- ✅ [获取客户基础信息](https://developer.work.weixin.qq.com/document/path/95159)

#### 统计管理

- ✅ [获取「客户数据统计」企业汇总数据](https://developer.work.weixin.qq.com/document/path/95489)
- ✅ [获取「客户数据统计」接待人员明细数据](https://developer.work.weixin.qq.com/document/path/95490)

#### 机器人管理

- ✅ [知识库分组管理](https://developer.work.weixin.qq.com/document/path/95971)
- ✅ [知识库问答管理](https://developer.work.weixin.qq.com/document/path/95972)

---

## 参考资源

- [企业微信开发文档](https://developer.work.weixin.qq.com/document/)
- [n8n 官方文档](https://docs.n8n.io/)
- [n8n 社区节点开发文档](https://docs.n8n.io/integrations/creating-nodes/overview/)
- [n8n 社区节点开发示例](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)

## 许可证

[MIT](LICENSE.md)
