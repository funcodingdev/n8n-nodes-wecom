# n8n-nodes-wecom

这是一个 n8n 社区节点，让你可以在 [n8n](https://n8n.io/) 工作流中使用企业微信（WeChat Work）API。

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

1. 添加"企业微信"节点到工作流
2. 根据使用的功能选择对应的凭证：

   **消息推送（群机器人）：**
   - 点击"Credential to connect with"
   - 选择"创建新凭证 - 企业微信群机器人 Webhook API"
   - 填入群机器人的 Webhook URL

   **应用消息、通讯录、素材管理等：**
   - 点击"Credential to connect with"
   - 选择"创建新凭证 - 企业微信 API"
   - 填入以下信息：
     - **企业 ID** - 你的企业 CorpID
     - **应用 Secret** - 应用的 Secret
     - **应用 ID** - 应用的 AgentID

   **消息接收（Trigger 节点）：**
   - 添加"企业微信消息接收"触发器节点
   - 点击"Credential to connect with"
   - 选择"创建新凭证 - 企业微信消息接收 API"
   - 填入以下信息：
     - **企业 ID** - 你的企业 CorpID
     - **Token** - 你将在企业微信后台设置的 Token（两边必须一致）
     - **EncodingAESKey** - 你将在企业微信后台设置的密钥（两边必须一致，43位字符）
   - 复制节点的 Webhook URL
   - 在企业微信应用管理后台配置接收消息时，使用**相同的** Token 和 EncodingAESKey

## 已实现功能

### 📥 消息接收（Trigger 节点）

> 📖 [官方文档：接收消息与事件](https://developer.work.weixin.qq.com/document/path/90238)

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

#### 高级功能账号管理

- ✅ [分配高级功能账号](https://developer.work.weixin.qq.com/document/path/99516)
- ✅ [取消高级功能账号](https://developer.work.weixin.qq.com/document/path/99517)
- ✅ [获取高级功能账号列表](https://developer.work.weixin.qq.com/document/path/99518)

#### 文档素材管理

- ✅ [上传文档图片](https://developer.work.weixin.qq.com/document/path/99933)

## 参考资源

- [企业微信开发文档](https://developer.work.weixin.qq.com/document/)
- [n8n 官方文档](https://docs.n8n.io/)
- [n8n 社区节点开发文档](https://docs.n8n.io/integrations/creating-nodes/overview/)
- [n8n 社区节点开发示例](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)

## 许可证

[MIT](LICENSE.md)
