# n8n 企业微信节点 · UI 总览图

> 由 `scripts/dump-ui-tree.mjs` 根据编译后节点 description 自动生成，请勿手改。
>
> 生成命令：`npm run build && node scripts/dump-ui-tree.mjs`

交互路径：`节点 → 资源(Resource) → 操作(Operation) → 参数(Parameters)`

```
n8n 节点面板
│
├─ 企业微信(WeCom)-基础
│  type: weComBase
│  配置顺序: Credential → Resource → Operation → Parameters
│
│  ├─ 资源 · 通讯录管理  (contact)  · 38 ops
│  │   ├─ [成员管理]
│  │   │   ├─ 创建成员  (createUser)
│  │   │   ├─ 读取成员  (getUser)
│  │   │   ├─ 更新成员  (updateUser)
│  │   │   ├─ 删除成员  (deleteUser)
│  │   │   ├─ 批量删除成员  (batchDeleteUser)
│  │   │   ├─ 获取部门成员  (listUsers)
│  │   │   ├─ 获取部门成员详情  (listUsersDetail)
│  │   │   ├─ UserID转OpenID  (convertToOpenid)
│  │   │   ├─ OpenID转UserID  (convertToUserid)
│  │   │   ├─ 登录二次验证  (authSucc)
│  │   │   ├─ 邀请成员  (inviteUser)
│  │   │   ├─ 获取加入企业二维码  (getJoinQrCode)
│  │   │   ├─ 手机号获取userid  (getUserIdByMobile)
│  │   │   ├─ 邮箱获取userid  (getUserIdByEmail)
│  │   │   ├─ 获取成员ID列表  (listUserIds)
│  │   │   └─ 临时外部联系人ID转换  (convertTmpExternalUserId)
│  │   ├─ [部门管理]
│  │   │   ├─ 创建部门  (createDepartment)
│  │   │   ├─ 更新部门  (updateDepartment)
│  │   │   ├─ 删除部门  (deleteDepartment)
│  │   │   ├─ 获取部门列表  (getDepartment)
│  │   │   ├─ 获取子部门ID列表  (getSubDepartmentIds)
│  │   │   └─ 获取单个部门详情  (getDepartmentDetail)
│  │   ├─ [标签管理]
│  │   │   ├─ 创建标签  (createTag)
│  │   │   ├─ 更新标签名字  (updateTag)
│  │   │   ├─ 删除标签  (deleteTag)
│  │   │   ├─ 获取标签成员  (getTag)
│  │   │   ├─ 增加标签成员  (addTagUsers)
│  │   │   ├─ 删除标签成员  (delTagUsers)
│  │   │   └─ 获取标签列表  (getTagList)
│  │   ├─ [异步导入]
│  │   │   ├─ 增量更新成员  (batchSyncUser)
│  │   │   ├─ 全量覆盖成员  (batchReplaceUser)
│  │   │   ├─ 全量覆盖部门  (batchReplaceDepartment)
│  │   │   └─ 获取异步任务结果  (getAsyncResult)
│  │   └─ [异步导出]
│  │       ├─ 导出成员  (exportSimpleUser)
│  │       ├─ 导出成员详情  (exportUser)
│  │       ├─ 导出部门  (exportDepartment)
│  │       ├─ 导出标签成员  (exportTagUser)
│  │       └─ 获取导出结果  (getExportResult)
│
│  ├─ 资源 · 应用消息  (message)  · 15 ops
│  │   ├─ [基础消息]
│  │   │   ├─ 发送文本消息  (sendText)
│  │   │   ├─ 发送图片消息  (sendImage)
│  │   │   ├─ 发送语音消息  (sendVoice)
│  │   │   ├─ 发送视频消息  (sendVideo)
│  │   │   └─ 发送文件消息  (sendFile)
│  │   ├─ [卡片消息]
│  │   │   ├─ 发送文本卡片消息  (sendTextCard)
│  │   │   ├─ 发送图文消息（News）  (sendNews)
│  │   │   ├─ 发送图文消息（Mpnews）  (sendMpNews)
│  │   │   ├─ 发送 Markdown 消息  (sendMarkdown)
│  │   │   ├─ 发送小程序通知消息  (sendMiniprogramNotice)
│  │   │   ├─ 发送任务卡片消息  (sendTaskCard)
│  │   │   ├─ 发送模板卡片消息  (sendTemplateCard)
│  │   │   └─ 发送学校通知  (sendSchoolNotice)
│  │   └─ [消息操作]
│  │       ├─ 撤回应用消息  (recallMessage)
│  │       └─ 更新模板卡片消息  (updateTemplateCard)
│
│  ├─ 资源 · 群聊会话  (appChat)  · 12 ops
│  │   ├─ [群聊管理]
│  │   │   ├─ 创建群聊会话  (createAppChat)
│  │   │   ├─ 获取群聊会话  (getAppChat)
│  │   │   └─ 修改群聊会话  (updateAppChat)
│  │   └─ [消息发送]
│  │       ├─ 发送文本消息  (sendText)
│  │       ├─ 发送图片消息  (sendImage)
│  │       ├─ 发送语音消息  (sendVoice)
│  │       ├─ 发送视频消息  (sendVideo)
│  │       ├─ 发送文件消息  (sendFile)
│  │       ├─ 发送文本卡片消息  (sendTextCard)
│  │       ├─ 发送 Markdown 消息  (sendMarkdown)
│  │       ├─ 发送图文消息  (sendNews)
│  │       └─ 发送图文消息 (mpnews)  (sendMpNews)
│
│  ├─ 资源 · 消息推送  (pushMessage)  · 9 ops
│  │   ├─ [媒体文件]
│  │   │   └─ 上传媒体文件  (uploadMedia)
│  │   └─ [消息推送]
│  │       ├─ 发送文本消息  (sendText)
│  │       ├─ 发送 Markdown 消息  (sendMarkdown)
│  │       ├─ 发送 Markdown V2 消息  (sendMarkdownV2)
│  │       ├─ 发送图片消息  (sendImage)
│  │       ├─ 发送语音消息  (sendVoice)
│  │       ├─ 发送视频消息  (sendFile)
│  │       ├─ 发送图文消息  (sendNews)
│  │       └─ 发送模板卡片消息  (sendTemplateCard)
│
│  ├─ 资源 · 被动回复  (passiveReply)  · 1 ops
│  │   └─ [消息接收与发送]
│  │       └─ 被动回复  (reply)
│
│  ├─ 资源 · 智能机器人被动回复  (aibotPassiveReply)  · 4 ops
│  │   └─ [智能机器人被动回复]
│  │       ├─ 回复欢迎语  (replyWelcome)
│  │       ├─ 回复用户消息  (replyMessage)
│  │       ├─ 更新模板卡片  (updateTemplateCard)
│  │       └─ 主动回复消息  (activeReply)
│
│  ├─ 资源 · 企业互联  (linkedcorp)  · 18 ops
│  │   ├─ [基础信息]
│  │   │   ├─ 获取上下游信息  (getChainInfo)
│  │   │   └─ 获取下级企业加入的上下游  (getSubCorpChainList)
│  │   ├─ [认证与访问]
│  │   │   ├─ 获取下级/下游企业的Access_token  (getLinkedCorpToken)
│  │   │   ├─ 获取下级/下游企业小程序Session  (getMiniProgramSession)
│  │   │   └─ 获取应用共享信息  (getAppShareInfo)
│  │   ├─ [客户管理]
│  │   │   ├─ 上下游关联客户信息-已添加客户  (getLinkedCustomer)
│  │   │   ├─ 批量导入上下游联系人  (batchImportChainContact)
│  │   │   └─ 获取异步任务结果  (getChainAsyncResult)
│  │   ├─ [对接规则]
│  │   │   ├─ 获取对接规则ID列表  (getChainRuleList)
│  │   │   ├─ 获取对接规则详情  (getChainRuleDetail)
│  │   │   ├─ 新增对接规则  (addChainRule)
│  │   │   ├─ 更新对接规则  (updateChainRule)
│  │   │   └─ 删除对接规则  (deleteChainRule)
│  │   ├─ [其他操作]
│  │   │   ├─ 查询成员自定义ID  (getCustomUserId)
│  │   │   └─ 移除企业  (removeChainCorp)
│  │   └─ [上下游]
│  │       ├─ 获取企业信息  (corpGetChainCorpinfo)
│  │       ├─ 获取企业分组  (corpGetChainGroup)
│  │       └─ unionid转pending_id  (unionidToPendingId)
│
│  ├─ 资源 · 素材管理  (material)  · 6 ops
│  │   └─ [素材管理]
│  │       ├─ 上传临时素材  (uploadTemp)
│  │       ├─ 上传图片  (uploadImage)
│  │       ├─ 获取临时素材  (getTemp)
│  │       ├─ 获取高清语音素材  (getHighQualityVoice)
│  │       ├─ 异步上传临时素材  (uploadTempAsync)
│  │       └─ 查询异步任务结果  (getUploadByUrlResult)
│
│  ├─ 资源 · 系统信息  (system)  · 12 ops
│  │   ├─ [基础]
│  │   │   ├─ 获取接口IP段  (getApiDomainIp)
│  │   │   ├─ 获取回调IP段  (getCallbackIp)
│  │   │   └─ 获取AccessToken  (getAccessToken)
│  │   ├─ [身份验证]
│  │   │   ├─ 获取二次验证信息  (authGetTfaInfo)
│  │   │   ├─ 获取访问用户敏感信息  (authGetuserdetail)
│  │   │   ├─ 获取访问用户身份  (authGetuserinfo)
│  │   │   ├─ 获取成员身份  (userGetuserinfo)
│  │   │   └─ 二次验证成功  (userTfaSucc)
│  │   ├─ [JS-SDK]
│  │   │   ├─ 获取企业 jsapi_ticket  (ticketGet)
│  │   │   └─ 获取应用 jsapi_ticket  (getJsapiTicket)
│  │   ├─ [系统]
│  │   │   └─ 获取 launch_code  (getLaunchCode)
│  │   └─ [小程序]
│  │       └─ 登录凭证校验  (miniprogramJscode2session)
│
│  ├─ 资源 · 电子发票  (invoice)  · 4 ops
│  │   ├─ [发票查询]
│  │   │   ├─ 查询电子发票  (getInvoiceInfo)
│  │   │   └─ 批量查询电子发票  (batchGetInvoiceInfo)
│  │   └─ [发票状态]
│  │       ├─ 更新发票状态  (updateInvoiceStatus)
│  │       └─ 批量更新发票状态  (batchUpdateInvoiceStatus)
│
│  ├─ 资源 · 应用管理  (agent)  · 12 ops
│  │   └─ [应用管理]
│  │       ├─ 获取应用  (getAgent)
│  │       ├─ 获取应用列表  (listAgents)
│  │       ├─ 设置应用  (setAgent)
│  │       ├─ 创建菜单  (createMenu)
│  │       ├─ 获取菜单  (getMenu)
│  │       ├─ 删除菜单  (deleteMenu)
│  │       ├─ 设置工作台模版  (setWorkbenchTemplate)
│  │       ├─ 获取工作台模版  (getWorkbenchTemplate)
│  │       ├─ 设置用户工作台数据  (setWorkbenchData)
│  │       ├─ 批量设置用户工作台数据  (batchSetWorkbenchData)
│  │       ├─ 获取用户工作台数据  (getWorkbenchData)
│  │       └─ 获取应用共享信息  (listAppShareInfo)
│
│  ├─ 资源 · 第三方应用授权  (appAuth)  · 13 ops
│  │   └─ [第三方应用授权]
│  │       ├─ 获取第三方应用凭证  (getSuiteToken)
│  │       ├─ 获取预授权码  (getPreAuthCode)
│  │       ├─ 设置授权配置  (setSessionInfo)
│  │       ├─ 获取企业永久授权码  (getPermanentCode)
│  │       ├─ 获取企业授权信息  (getAuthInfo)
│  │       ├─ 获取企业凭证  (getCorpToken)
│  │       ├─ 获取应用二维码  (getAppQrcode)
│  │       ├─ 明文corpid转换为加密corpid  (corpidToOpencorpid)
│  │       ├─ 获取应用权限详情  (getPermissions)
│  │       ├─ 获取应用管理员列表  (getAdminList)
│  │       ├─ 获取订单列表  (getOrderList)
│  │       ├─ 获取订单详情  (getOrder)
│  │       └─ 延长试用期  (prolongTry)
│
│  ├─ 资源 · 第三方应用接口调用许可  (license)  · 27 ops
│  │   └─ [接口许可]
│  │       ├─ 下单购买账号  (createNewOrder)
│  │       ├─ 创建续期任务  (createRenewOrderJob)
│  │       ├─ 提交续期订单  (submitOrderJob)
│  │       ├─ 获取订单列表  (listOrder)
│  │       ├─ 获取订单详情  (getOrder)
│  │       ├─ 获取订单中的账号列表  (listOrderAccount)
│  │       ├─ 取消订单  (cancelOrder)
│  │       ├─ 创建多企业新购任务  (createNewOrderJob)
│  │       ├─ 提交多企业新购订单  (submitNewOrderJob)
│  │       ├─ 获取多企业新购订单提交结果  (newOrderJobResult)
│  │       ├─ 获取多企业订单详情  (getUnionOrder)
│  │       ├─ 提交余额支付订单任务  (submitPayJob)
│  │       ├─ 获取订单支付结果  (payJobResult)
│  │       ├─ 激活账号  (activeAccount)
│  │       ├─ 批量激活账号  (batchActiveAccount)
│  │       ├─ 指定账号类型激活  (activeAccountByType)
│  │       ├─ 获取激活码详情  (getActiveInfoByCode)
│  │       ├─ 批量获取激活码详情  (batchGetActiveInfoByCode)
│  │       ├─ 获取企业的账号列表  (listActivedAccount)
│  │       ├─ 获取成员的激活详情  (getActiveInfoByUser)
│  │       ├─ 账号继承  (batchTransferLicense)
│  │       ├─ 分配激活码给下游/下级企业  (batchShareActiveCode)
│  │       ├─ 获取应用的接口许可状态  (getAppLicenseInfo)
│  │       ├─ 设置企业的许可自动激活状态  (setAutoActiveStatus)
│  │       ├─ 查询企业的许可自动激活状态  (getAutoActiveStatus)
│  │       ├─ 充值账户余额查询  (getAccountBalance)
│  │       └─ 民生优惠条件查询  (supportPolicyQuery)
│
│  ├─ 资源 · 第三方应用收银台  (paytool)  · 7 ops
│  │   └─ [收银台]
│  │       ├─ 创建收款订单  (createOrder)
│  │       ├─ 取消收款订单  (cancelOrder)
│  │       ├─ 获取收款订单列表  (getOrderList)
│  │       ├─ 获取收款订单详情  (getOrderDetail)
│  │       ├─ 获取发票列表  (getInvoiceList)
│  │       ├─ 标记开票状态  (markInvoiceStatus)
│  │       └─ 获取代支付流水  (getBillList)
│
│  ├─ 资源 · 对外收款  (externalpay)  · 5 ops
│  │   ├─ [商户号]
│  │   │   ├─ 查询商户号详情  (getMerchant)
│  │   │   └─ 设置商户号使用范围  (setMchUseScope)
│  │   ├─ [收款]
│  │   │   ├─ 获取对外收款记录  (getBillList)
│  │   │   └─ 获取收款项目商户单号  (getPaymentInfo)
│  │   └─ [资金]
│  │       └─ 获取资金流水  (getFundFlow)
│
│  ├─ 资源 · 小程序对外收款  (miniapppay)  · 11 ops
│  │   ├─ [支付]
│  │   │   ├─ 小程序下单  (createOrder)
│  │   │   ├─ 查询订单  (getOrder)
│  │   │   ├─ 关闭订单  (closeOrder)
│  │   │   └─ 获取支付签名  (getSign)
│  │   ├─ [退款]
│  │   │   ├─ 申请退款  (refund)
│  │   │   └─ 查询退款  (getRefundDetail)
│  │   ├─ [账单]
│  │   │   ├─ 交易账单申请  (getBill)
│  │   │   └─ 下载账单文件  (downloadBillFile)
│  │   └─ [进件]
│  │       ├─ 提交创建对外收款账户申请  (applyMch)
│  │       ├─ 查询申请单状态  (getApplymentStatus)
│  │       └─ 提交图片  (uploadImage)
│
│  ├─ 资源 · 企业红包与向员工付款  (mchpay)  · 4 ops
│  │   ├─ [企业红包]
│  │   │   ├─ 发放企业红包  (sendRedpack)
│  │   │   └─ 查询红包记录  (queryRedpack)
│  │   └─ [向员工付款]
│  │       ├─ 付款  (payToEmployee)
│  │       └─ 查询付款记录  (queryPayToEmployee)
│
│  ├─ 资源 · 数据与智能专区  (chatdata)  · 14 ops
│  │   ├─ [基础]
│  │   │   ├─ 设置公钥  (setPublicKey)
│  │   │   ├─ 获取授权存档成员列表  (getAuthUserList)
│  │   │   ├─ 设置专区接收回调  (setReceiveCallback)
│  │   │   ├─ 设置敏感信息隐藏  (setHideSensitiveInfoConfig)
│  │   │   ├─ 获取敏感信息隐藏配置  (getHideSensitiveInfoConfig)
│  │   │   ├─ 设置日志级别  (setLogLevel)
│  │   │   ├─ 获取日志级别  (getLogLevel)
│  │   │   └─ 上传临时文件到专区  (uploadMedia)
│  │   ├─ [调用]
│  │   │   ├─ 同步调用专区程序  (syncCallProgram)
│  │   │   ├─ 创建异步调用任务  (asyncProgramTask)
│  │   │   └─ 获取异步任务结果  (asyncProgramResult)
│  │   └─ [调试]
│  │       ├─ 开启调试模式  (openDebugMode)
│  │       ├─ 关闭调试模式  (closeDebugMode)
│  │       └─ 获取调试模式状态  (checkDebugMode)
│
│  ├─ 资源 · 会话内容存档  (msgaudit)  · 5 ops
│  │   ├─ [存档]
│  │   │   └─ 获取开启成员列表  (getPermitUserList)
│  │   ├─ [同意]
│  │   │   ├─ 查询单聊同意情况  (checkSingleAgree)
│  │   │   └─ 查询群聊同意情况  (checkRoomAgree)
│  │   ├─ [群信息]
│  │   │   └─ 获取内部群信息  (getGroupChat)
│  │   └─ [机器人]
│  │       └─ 获取机器人信息  (getRobotInfo)
│
│  ├─ 资源 · 第三方应用推广二维码  (promotionQrcode)  · 4 ops
│  │   └─ [推广二维码]
│  │       ├─ 获取注册码  (getRegisterCode)
│  │       ├─ 查询注册状态  (getRegisterInfo)
│  │       ├─ 设置授权应用可见范围  (setAgentScope)
│  │       └─ 设置通讯录同步完成  (setContactSyncSuccess)
│
│  ├─ 资源 · 账号 ID  (accountId)  · 13 ops
│  │   └─ [账号ID]
│  │       ├─ userid转换  (openuseridToUserid)
│  │       ├─ userid转换（第三方应用）  (useridToOpenuserid)
│  │       ├─ external_userid转换  (fromServiceExternalUserid)
│  │       ├─ external_userid转换（第三方应用）  (getNewExternalUserid)
│  │       ├─ external_userid转换（客户群成员）  (getNewExternalUseridGroupchat)
│  │       ├─ tmp_external_userid转换  (convertTmpExternalUserid)
│  │       ├─ corpid转换（第三方应用）  (corpidToOpencorpid)
│  │       ├─ unionid转换（第三方应用）  (unionidToExternalUserid)
│  │       ├─ external_userid查询pending_id（第三方应用）  (externalUseridToPendingId)
│  │       ├─ 客户标签ID转换（第三方应用）  (externalTagidToOpenExternalTagid)
│  │       ├─ 微信客服ID转换（第三方应用）  (openKfidToNewOpenKfid)
│  │       ├─ ID迁移完成状态设置（第三方应用）  (finishOpenidMigration)
│  │       └─ 密文corpid转明文（服务商）  (opencorpidToCorpid)
│
│  ├─ 资源 · 文件解密  (file)  · 1 ops
│  │   └─ [文件解密]
│  │       └─ 解密文件  (decryptFile)
│
│  └─ 资源 · 安全管理  (security)  · 16 ops
│      ├─ [文件防泄漏]
│      │   └─ 获取文件操作记录  (getFileOperRecord)
│      ├─ [设备管理]
│      │   ├─ 导入可信企业设备  (importDevice)
│      │   ├─ 获取设备信息  (getDeviceList)
│      │   ├─ 获取成员使用设备  (getDeviceByUser)
│      │   ├─ 删除设备  (deleteDevice)
│      │   ├─ 确认可信设备  (approveDevice)
│      │   └─ 驳回可信设备申请  (rejectDevice)
│      ├─ [截屏/录屏管理]
│      │   └─ 获取截屏操作记录  (getScreenOperRecord)
│      ├─ [高级功能账号管理]
│      │   ├─ 获取高级功能账号列表  (getVipList)
│      │   ├─ 分配高级功能账号  (submitBatchAddVipJob)
│      │   ├─ 查询分配高级功能账号结果  (batchAddVipJobResult)
│      │   ├─ 取消高级功能账号  (submitBatchDelVipJob)
│      │   └─ 查询取消高级功能账号结果  (batchDelVipJobResult)
│      ├─ [操作日志]
│      │   ├─ 获取成员操作记录  (getMemberOperLog)
│      │   └─ 获取管理端操作日志  (getAdminOperLog)
│      └─ [基础]
│          └─ 获取企业微信域名IP信息  (getServerDomainIp)
│
├─ 企业微信(WeCom)-办公
│  type: weComOffice
│  配置顺序: Credential → Resource → Operation → Parameters
│
│  ├─ 资源 · 文档  (wedoc)  · 53 ops
│  │   ├─ [管理文档]
│  │   │   ├─ 新建文档  (createDoc)
│  │   │   ├─ 重命名文档  (renameDoc)
│  │   │   ├─ 删除文档  (deleteDoc)
│  │   │   ├─ 获取文档基础信息  (getDocInfo)
│  │   │   └─ 分享文档  (shareDoc)
│  │   ├─ [管理文档内容]
│  │   │   ├─ 编辑文档内容  (modDocContent)
│  │   │   └─ 获取文档数据  (getDocData)
│  │   ├─ [管理表格内容]
│  │   │   ├─ 编辑表格内容  (modSheetContent)
│  │   │   ├─ 获取表格行列信息  (getSheetRange)
│  │   │   └─ 获取表格数据  (getSheetData)
│  │   ├─ [智能表格]
│  │   │   ├─ 添加子表  (addSmartsheetSheet)
│  │   │   ├─ 删除子表  (delSmartsheetSheet)
│  │   │   ├─ 更新子表  (updateSmartsheetSheet)
│  │   │   ├─ 添加视图  (addSmartsheetView)
│  │   │   ├─ 删除视图  (delSmartsheetView)
│  │   │   ├─ 更新视图  (updateSmartsheetView)
│  │   │   ├─ 添加字段  (addSmartsheetField)
│  │   │   ├─ 删除字段  (delSmartsheetField)
│  │   │   ├─ 更新字段  (updateSmartsheetField)
│  │   │   ├─ 添加记录  (addSmartsheetRecord)
│  │   │   ├─ 删除记录  (delSmartsheetRecord)
│  │   │   ├─ 更新记录  (updateSmartsheetRecord)
│  │   │   ├─ Webhook 写入数据  (sendSmartsheetWebhook)
│  │   │   ├─ 添加字段编组  (addFieldGroup)
│  │   │   ├─ 更新字段编组  (updateFieldGroup)
│  │   │   ├─ 删除字段编组  (deleteFieldGroups)
│  │   │   └─ 查询字段编组  (getFieldGroups)
│  │   ├─ [获取智能表格数据]
│  │   │   ├─ 查询子表  (querySmartsheetSheet)
│  │   │   ├─ 查询视图  (querySmartsheetView)
│  │   │   ├─ 查询字段  (querySmartsheetField)
│  │   │   ├─ 查询记录  (querySmartsheetRecord)
│  │   │   ├─ 获取群聊列表  (getSmartsheetGroupChatList)
│  │   │   ├─ 获取群聊会话  (getSmartsheetGroupChat)
│  │   │   └─ 修改群聊会话  (updateSmartsheetGroupChat)
│  │   ├─ [权限设置]
│  │   │   ├─ 获取文档权限信息  (getDocAuth)
│  │   │   ├─ 修改文档通知范围及权限  (modDocMemberRule)
│  │   │   ├─ 修改文档加入规则  (modDocShareScope)
│  │   │   ├─ 修改文档安全设置  (modDocSafeRule)
│  │   │   ├─ 管理智能表格内容权限  (manageSmartsheetAuth)
│  │   │   ├─ 查询内容权限规则  (getSheetPriv)
│  │   │   ├─ 创建额外权限规则  (createPrivRule)
│  │   │   ├─ 更新子表内容权限  (updateSheetPrivFull)
│  │   │   ├─ 修改权限规则成员  (modPrivRuleMember)
│  │   │   └─ 删除额外权限规则  (deletePrivRule)
│  │   ├─ [管理收集表]
│  │   │   ├─ 创建收集表  (createForm)
│  │   │   ├─ 编辑收集表  (modForm)
│  │   │   ├─ 获取收集表信息  (getFormInfo)
│  │   │   ├─ 收集表的统计信息查询  (getFormStatistic)
│  │   │   └─ 读取收集表答案  (getFormAnswer)
│  │   ├─ [高级功能账号管理]
│  │   │   ├─ 分配高级功能账号  (allocateAdvancedAccount)
│  │   │   ├─ 取消高级功能账号  (deallocateAdvancedAccount)
│  │   │   └─ 获取高级功能账号列表  (getAdvancedAccountList)
│  │   └─ [素材管理]
│  │       └─ 上传文档图片  (uploadDocImage)
│
│  ├─ 资源 · 微盘  (wefile)  · 31 ops
│  │   ├─ [空间管理]
│  │   │   ├─ 创建空间  (createSpace)
│  │   │   ├─ 删除空间  (deleteSpace)
│  │   │   ├─ 重命名空间  (renameSpace)
│  │   │   ├─ 获取空间信息  (getSpaceInfo)
│  │   │   ├─ 获取空间邀请链接  (getSpaceInviteLink)
│  │   │   └─ 空间安全设置  (spaceSecuritySettings)
│  │   ├─ [文件管理]
│  │   │   ├─ 上传文件  (uploadFile)
│  │   │   ├─ 下载文件  (downloadFile)
│  │   │   ├─ 创建文件夹  (createFolder)
│  │   │   ├─ 删除文件  (deleteFile)
│  │   │   ├─ 移动文件  (moveFile)
│  │   │   ├─ 重命名文件  (renameFile)
│  │   │   ├─ 获取文件列表  (getFileList)
│  │   │   └─ 获取文件信息  (getFileInfo)
│  │   ├─ [权限管理]
│  │   │   ├─ 添加空间成员  (addSpaceMembers)
│  │   │   ├─ 移除空间成员  (removeSpaceMembers)
│  │   │   ├─ 添加文件成员  (addFileMembers)
│  │   │   ├─ 移除文件成员  (removeFileMembers)
│  │   │   ├─ 获取文件权限信息  (getFilePermissions)
│  │   │   ├─ 文件分享设置  (fileShareSettings)
│  │   │   ├─ 获取文件分享链接  (getFileShareLink)
│  │   │   └─ 文件安全设置  (fileSecuritySettings)
│  │   ├─ [高级功能]
│  │   │   ├─ 分配高级功能账号  (assignVipAccounts)
│  │   │   ├─ 取消高级功能账号  (revokeVipAccounts)
│  │   │   ├─ 获取高级功能账号列表  (getVipAccountsList)
│  │   │   ├─ 获取专业版信息  (getProInfo)
│  │   │   └─ 获取容量信息  (getCapacity)
│  │   ├─ [分片上传]
│  │   │   ├─ 初始化分片上传  (uploadInit)
│  │   │   ├─ 上传分片  (uploadPart)
│  │   │   └─ 完成分片上传  (uploadFinish)
│  │   └─ [微盘]
│  │       └─ 获取文件权限  (wedriveGetFilePermission)
│
│  ├─ 资源 · 邮件  (mail)  · 26 ops
│  │   ├─ [邮件收发]
│  │   │   ├─ 发送普通邮件  (sendMail)
│  │   │   ├─ 发送日程邮件  (sendScheduleMail)
│  │   │   ├─ 发送会议邮件  (sendMeetingMail)
│  │   │   ├─ 获取收件箱邮件列表  (getMailList)
│  │   │   └─ 获取邮件内容  (getMailContent)
│  │   ├─ [应用邮箱]
│  │   │   ├─ 更新应用邮箱账号  (updateAppMailbox)
│  │   │   └─ 查询应用邮箱账号  (getAppMailbox)
│  │   ├─ [邮件群组]
│  │   │   ├─ 创建邮件群组  (createMailGroup)
│  │   │   ├─ 更新邮件群组  (updateMailGroup)
│  │   │   ├─ 删除邮件群组  (deleteMailGroup)
│  │   │   ├─ 获取邮件群组详情  (getMailGroup)
│  │   │   └─ 模糊搜索邮件群组  (searchMailGroup)
│  │   ├─ [公共邮箱]
│  │   │   ├─ 创建公共邮箱  (createPublicMailbox)
│  │   │   ├─ 更新公共邮箱  (updatePublicMailbox)
│  │   │   ├─ 删除公共邮箱  (deletePublicMailbox)
│  │   │   ├─ 获取公共邮箱详情  (getPublicMailbox)
│  │   │   └─ 模糊搜索公共邮箱  (searchPublicMailbox)
│  │   ├─ [客户端密码]
│  │   │   ├─ 获取客户端专用密码列表  (getClientPasswordList)
│  │   │   └─ 删除客户端专用密码  (deleteClientPassword)
│  │   ├─ [高级账号管理]
│  │   │   ├─ 分配高级功能账号  (allocateMailAdvancedAccount)
│  │   │   ├─ 取消高级功能账号  (deallocateMailAdvancedAccount)
│  │   │   ├─ 获取高级功能账号列表  (getMailAdvancedAccountList)
│  │   │   └─ 禁用/启用邮箱账号  (toggleMailboxStatus)
│  │   └─ [邮箱设置]
│  │       ├─ 获取用户功能属性  (getUserMailAttribute)
│  │       ├─ 更改用户功能属性  (updateUserMailAttribute)
│  │       └─ 获取邮件未读数  (getMailUnreadCount)
│
│  ├─ 资源 · 会议  (meeting)  · 107 ops
│  │   ├─ [预约会议管理]
│  │   │   ├─ 创建预约会议  (createMeeting)
│  │   │   ├─ 修改预约会议  (updateMeeting)
│  │   │   ├─ 取消预约会议  (cancelMeeting)
│  │   │   ├─ 获取会议详情  (getMeetingInfo)
│  │   │   ├─ 获取成员会议ID列表  (getUserMeetings)
│  │   │   └─ 获取会议发起记录  (getMeetingRecords)
│  │   ├─ [高级会议管理]
│  │   │   ├─ 创建预约会议（高级）  (createAdvancedMeeting)
│  │   │   ├─ 修改预约会议（高级）  (updateAdvancedMeeting)
│  │   │   ├─ 获取会议受邀成员列表  (getMeetingInvitees)
│  │   │   ├─ 更新会议受邀成员列表  (updateMeetingInvitees)
│  │   │   ├─ 获取实时会中成员列表  (getLiveParticipants)
│  │   │   └─ 获取已参会成员列表  (getParticipants)
│  │   ├─ [会中控制]
│  │   │   ├─ 静音成员  (muteMember)
│  │   │   ├─ 移出成员  (removeMember)
│  │   │   ├─ 结束会议  (endMeeting)
│  │   │   ├─ 设置联席主持人  (setCohost)
│  │   │   ├─ 会中设置(扩展)  (realcontrolSet)
│  │   │   ├─ 关闭屏幕共享  (rcCloseScreenShare)
│  │   │   ├─ 管理等候室成员  (rcManageWaitingRoom)
│  │   │   ├─ 设置成员昵称  (rcSetNicknames)
│  │   │   └─ 开关成员视频  (rcSwitchUserVideo)
│  │   ├─ [录制管理]
│  │   │   ├─ 获取会议录制列表  (listRecordings)
│  │   │   └─ 获取会议录制地址  (getRecordingAddress)
│  │   ├─ [高级账号管理]
│  │   │   ├─ 分配高级功能账号  (allocateMeetingAdvancedAccount)
│  │   │   ├─ 取消高级功能账号  (deallocateMeetingAdvancedAccount)
│  │   │   └─ 获取高级功能账号列表  (getMeetingAdvancedAccountList)
│  │   ├─ [报名管理]
│  │   │   ├─ 获取会议报名配置  (getEnrollConfig)
│  │   │   ├─ 修改会议报名配置  (setEnrollConfig)
│  │   │   ├─ 获取会议报名信息  (listEnroll)
│  │   │   ├─ 审批会议报名  (approveEnroll)
│  │   │   ├─ 删除报名信息  (enrollDelete)
│  │   │   ├─ 导入报名信息  (enrollImport)
│  │   │   └─ 按临时OpenID查询报名  (enrollQueryByTmpOpenid)
│  │   ├─ [Rooms]
│  │   │   ├─ 获取Rooms会议室列表  (listRooms)
│  │   │   ├─ 获取Rooms会议室详情  (getRoomInfo)
│  │   │   ├─ 预定Rooms会议室  (bookRooms)
│  │   │   ├─ 释放Rooms会议室  (releaseRooms)
│  │   │   ├─ 呼叫会议室  (roomsCall)
│  │   │   ├─ 取消呼叫  (roomsCancelCall)
│  │   │   ├─ 获取应答状态  (roomsGetResponseStatus)
│  │   │   ├─ 获取会议室下会议列表  (roomsListMeetings)
│  │   │   ├─ 获取配置项  (roomsGetConfig)
│  │   │   ├─ 获取资源库存  (roomsGetInventory)
│  │   │   ├─ 获取设备列表  (roomsListDevices)
│  │   │   └─ 获取控制器列表  (roomsListControllers)
│  │   ├─ [布局]
│  │   │   ├─ 获取布局模板列表  (listLayoutTemplate)
│  │   │   ├─ 设置默认布局  (setDefaultLayout)
│  │   │   ├─ 添加基础布局  (basicLayoutAdd)
│  │   │   ├─ 修改基础布局  (basicLayoutUpdate)
│  │   │   ├─ 添加会议背景  (layoutAddBackground)
│  │   │   ├─ 设置默认背景  (layoutSetDefaultBackground)
│  │   │   ├─ 获取背景列表  (layoutListBackground)
│  │   │   ├─ 删除会议背景  (layoutDeleteBackground)
│  │   │   └─ 批量删除背景  (layoutBatchDeleteBackground)
│  │   ├─ [电话入会]
│  │   │   ├─ 外呼  (phoneCallout)
│  │   │   ├─ 查询外呼状态  (phoneGetCalloutStatus)
│  │   │   └─ 获取临时OpenID  (phoneGetTmpOpenid)
│  │   ├─ [投票]
│  │   │   ├─ 获取投票列表  (getPollList)
│  │   │   ├─ 获取投票详情  (getPollDetail)
│  │   │   ├─ 创建投票主题  (pollCreateTheme)
│  │   │   ├─ 修改投票主题  (pollUpdateTheme)
│  │   │   ├─ 获取投票主题信息  (pollGetThemeInfo)
│  │   │   ├─ 发起投票  (pollStart)
│  │   │   ├─ 结束投票  (pollFinish)
│  │   │   └─ 删除投票  (pollDelete)
│  │   ├─ [网络研讨会]
│  │   │   ├─ 创建研讨会  (webinarCreate)
│  │   │   ├─ 获取研讨会详情  (webinarGet)
│  │   │   ├─ 修改研讨会  (webinarUpdate)
│  │   │   ├─ 取消研讨会  (webinarCancel)
│  │   │   ├─ 获取嘉宾列表  (webinarListGuest)
│  │   │   ├─ 更新嘉宾列表  (webinarUpdateGuestList)
│  │   │   ├─ 更新暖场配置  (webinarUpdateWarmUp)
│  │   │   ├─ 获取报名配置  (webinarEnrollGetConfig)
│  │   │   ├─ 修改报名配置  (webinarEnrollSetConfig)
│  │   │   ├─ 获取报名信息  (webinarEnrollList)
│  │   │   ├─ 审批报名  (webinarEnrollApprove)
│  │   │   ├─ 导入报名  (webinarEnrollImport)
│  │   │   ├─ 删除报名  (webinarEnrollDelete)
│  │   │   └─ 按临时OpenID查询报名  (webinarEnrollQueryByTmpOpenid)
│  │   ├─ [录制]
│  │   │   ├─ 删除会议录制  (recordDelete)
│  │   │   ├─ 删除单个录制文件  (recordDeleteFile)
│  │   │   ├─ 获取录制文件列表  (recordGetFileList)
│  │   │   ├─ 获取录制访问统计  (recordGetStatistics)
│  │   │   ├─ 更新分享设置  (recordUpdateSharingConfig)
│  │   │   ├─ 获取转写详情  (recordTranscriptGetDetail)
│  │   │   ├─ 获取转写段落列表  (recordTranscriptGetParagraphList)
│  │   │   └─ 搜索转写内容  (recordTranscriptSearch)
│  │   ├─ [高级布局]
│  │   │   ├─ 添加高级布局  (advLayoutAdd)
│  │   │   ├─ 修改高级布局  (advLayoutUpdate)
│  │   │   ├─ 应用高级布局  (advLayoutApply)
│  │   │   ├─ 获取布局列表  (advLayoutList)
│  │   │   ├─ 获取用户布局  (advLayoutGetUserLayout)
│  │   │   └─ 批量删除布局  (advLayoutBatchDelete)
│  │   ├─ [MRA]
│  │   │   ├─ 挂断连接  (mraHangup)
│  │   │   ├─ 查询状态  (mraQueryStatus)
│  │   │   ├─ 设置默认布局  (mraSetDefaultLayout)
│  │   │   └─ 设置举手  (mraSetRaiseHand)
│  │   ├─ [等候室]
│  │   │   ├─ 获取当前等候成员  (waitingroomCurrentUsers)
│  │   │   └─ 获取等候室成员列表  (waitingroomUserList)
│  │   ├─ [会议]
│  │   │   ├─ 设置嘉宾  (setGuests)
│  │   │   ├─ 设置邀请成员  (setInvitees)
│  │   │   ├─ 获取嘉宾列表  (getGuests)
│  │   │   ├─ 获取会议质量数据  (getQuality)
│  │   │   ├─ 检查设备是否在会中  (checkDeviceInMeeting)
│  │   │   ├─ 创建客户专属短链  (createCustomerShortUrl)
│  │   │   └─ 获取客户专属短链  (getCustomerShortUrl)
│  │   └─ [高级账号]
│  │       └─ 查询批量取消任务结果  (vipBatchDelJobResult)
│
│  ├─ 资源 · 直播  (live)  · 9 ops
│  │   ├─ [直播管理]
│  │   │   ├─ 创建预约直播  (createLiving)
│  │   │   ├─ 修改预约直播  (modifyLiving)
│  │   │   ├─ 取消预约直播  (cancelLiving)
│  │   │   └─ 删除直播回放  (deleteLivingReplayData)
│  │   ├─ [直播信息]
│  │   │   ├─ 获取成员直播ID列表  (getUserAllLivingId)
│  │   │   ├─ 获取直播详情  (getLivingInfo)
│  │   │   └─ 获取直播分享信息  (getLivingShareInfo)
│  │   ├─ [直播统计]
│  │   │   └─ 获取直播观看明细  (getLivingWatchStat)
│  │   └─ [其他]
│  │       └─ 获取直播观众临时码  (getLivingCode)
│
│  ├─ 资源 · 日程  (calendar)  · 12 ops
│  │   ├─ [日历管理]
│  │   │   ├─ 创建日历  (createCalendar)
│  │   │   ├─ 更新日历  (updateCalendar)
│  │   │   ├─ 获取日历详情  (getCalendar)
│  │   │   └─ 删除日历  (deleteCalendar)
│  │   └─ [日程管理]
│  │       ├─ 创建日程  (createSchedule)
│  │       ├─ 更新日程  (updateSchedule)
│  │       ├─ 更新重复日程  (updateRecurringSchedule)
│  │       ├─ 新增日程参与者  (addScheduleAttendees)
│  │       ├─ 删除日程参与者  (deleteScheduleAttendees)
│  │       ├─ 获取日历下的日程列表  (listCalendarSchedules)
│  │       ├─ 获取日程详情  (getSchedule)
│  │       └─ 取消日程  (cancelSchedule)
│
│  ├─ 资源 · 打卡  (checkin)  · 13 ops
│  │   ├─ [打卡规则]
│  │   │   ├─ 获取企业所有打卡规则  (getCorporationRules)
│  │   │   ├─ 获取员工打卡规则  (getUserRules)
│  │   │   └─ 管理打卡规则  (manageRules)
│  │   ├─ [打卡数据]
│  │   │   ├─ 获取打卡记录数据  (getCheckinData)
│  │   │   ├─ 获取打卡日报数据  (getDailyReport)
│  │   │   ├─ 获取打卡月报数据  (getMonthlyReport)
│  │   │   └─ 获取设备打卡数据  (getDeviceCheckinData)
│  │   ├─ [排班管理]
│  │   │   ├─ 获取打卡人员排班信息  (getScheduleList)
│  │   │   └─ 为打卡人员排班  (setScheduleList)
│  │   ├─ [打卡操作]
│  │   │   ├─ 为打卡人员补卡  (addCheckin)
│  │   │   ├─ 添加打卡记录  (addCheckinRecord)
│  │   │   └─ 录入打卡人员人脸信息  (addFaceInfo)
│  │   └─ [打卡]
│  │       └─ 清空规则数组字段  (clearCheckinOptionArrayField)
│
│  ├─ 资源 · 审批  (approval)  · 13 ops
│  │   ├─ [审批申请]
│  │   │   ├─ 提交审批申请  (submitApproval)
│  │   │   ├─ 获取审批申请详情  (getApprovalDetail)
│  │   │   ├─ 批量获取审批单号  (getApprovalSpNoList)
│  │   │   └─ 获取审批数据(旧版)  (getOpenApprovalData)
│  │   ├─ [审批模板]
│  │   │   ├─ 获取审批模板详情  (getTemplateDetail)
│  │   │   ├─ 创建审批模板  (createApprovalTemplate)
│  │   │   └─ 更新审批模板  (updateApprovalTemplate)
│  │   ├─ [假期管理]
│  │   │   ├─ 获取企业假期管理配置  (getVacationConfig)
│  │   │   ├─ 获取成员假期余额  (getVacationQuota)
│  │   │   └─ 修改成员假期余额  (setVacationQuota)
│  │   ├─ [审批]
│  │   │   └─ 获取审批数据(旧版)  (getapprovaldata)
│  │   └─ [高级功能]
│  │       ├─ 获取申请单列表  (advancedFeatureGetApplyIdList)
│  │       └─ 设置审批详情  (advancedFeatureSetApprovalDetail)
│
│  ├─ 资源 · 汇报  (journal)  · 4 ops
│  │   ├─ [汇报记录]
│  │   │   ├─ 批量获取汇报记录单号  (getRecordList)
│  │   │   └─ 获取汇报记录详情  (getRecordDetail)
│  │   ├─ [汇报统计]
│  │   │   └─ 获取汇报统计数据  (getStatistics)
│  │   └─ [汇报附件]
│  │       └─ 下载微盘文件  (downloadFile)
│
│  ├─ 资源 · 人事助手  (hr)  · 3 ops
│  │   └─ [人事助手]
│  │       ├─ 获取员工字段配置  (getFieldList)
│  │       ├─ 获取员工花名册信息  (getStaffInfo)
│  │       └─ 更新员工花名册信息  (updateStaffInfo)
│
│  ├─ 资源 · 会议室  (meetingroom)  · 5 ops
│  │   ├─ [会议室管理]
│  │   │   └─ 管理会议室  (manageMeetingroom)
│  │   ├─ [预定管理]
│  │   │   └─ 管理预定  (manageBooking)
│  │   └─ [审批管理]
│  │       ├─ 批量获取申请单ID  (getApplicationList)
│  │       ├─ 获取申请单详细信息  (getApplicationDetail)
│  │       └─ 设置审批单审批信息  (setApprovalInfo)
│
│  ├─ 资源 · 紧急通知  (emergency)  · 2 ops
│  │   └─ [紧急通知]
│  │       ├─ 发起语音电话  (makeVoiceCall)
│  │       └─ 获取接听状态  (getCallStatus)
│
│  └─ 资源 · 公费电话  (phone)  · 1 ops
│      └─ [公费电话]
│          └─ 获取公费电话拨打记录  (getDialRecord)
│
├─ 企业微信(WeCom)-连接微信
│  type: weComWechat
│  配置顺序: Credential → Resource → Operation → Parameters
│
│  ├─ 资源 · 客户联系  (externalContact)  · 104 ops
│  │   ├─ [服务人员管理]
│  │   │   └─ 获取配置了客户联系功能的成员列表  (getFollowUserList)
│  │   ├─ [客户管理]
│  │   │   ├─ 获取客户列表  (getExternalContactList)
│  │   │   ├─ 获取客户详情  (getExternalContact)
│  │   │   ├─ 批量获取客户详情  (batchGetExternalContact)
│  │   │   └─ 修改客户备注信息  (updateExternalContactRemark)
│  │   ├─ [客户标签管理]
│  │   │   ├─ 获取企业标签库  (getCorpTagList)
│  │   │   ├─ 添加企业客户标签  (addCorpTag)
│  │   │   ├─ 编辑企业客户标签  (editCorpTag)
│  │   │   ├─ 删除企业客户标签  (delCorpTag)
│  │   │   └─ 编辑客户企业标签  (markTag)
│  │   ├─ [在职继承]
│  │   │   ├─ 分配在职成员的客户  (transferCustomer)
│  │   │   ├─ 查询客户接替状态  (transferResult)
│  │   │   └─ 分配在职成员的客户群  (transferGroupChat)
│  │   ├─ [离职继承]
│  │   │   ├─ 获取待分配的离职成员列表  (getUnassignedList)
│  │   │   ├─ 分配离职成员的客户  (resignedTransferCustomer)
│  │   │   ├─ 查询离职成员客户接替状态  (resignedTransferResult)
│  │   │   └─ 分配离职成员的客户群  (resignedTransferGroupChat)
│  │   ├─ [客户群管理]
│  │   │   ├─ 获取客户群列表  (getGroupChatList)
│  │   │   ├─ 获取客户群详情  (getGroupChat)
│  │   │   └─ 客户群Opengid转换  (opengidToChatid)
│  │   ├─ [联系我方式]
│  │   │   ├─ 配置客户联系「联系我」方式  (addContactWay)
│  │   │   ├─ 获取企业已配置的「联系我」方式  (getContactWay)
│  │   │   ├─ 获取企业已配置的「联系我」列表  (listContactWay)
│  │   │   ├─ 更新企业已配置的「联系我」方式  (updateContactWay)
│  │   │   ├─ 删除企业已配置的「联系我」方式  (delContactWay)
│  │   │   └─ 结束临时会话  (closeTempChat)
│  │   ├─ [客户群进群]
│  │   │   ├─ 配置客户群进群方式  (addJoinWay)
│  │   │   ├─ 获取客户群进群方式配置  (getJoinWay)
│  │   │   ├─ 更新客户群进群方式配置  (updateJoinWay)
│  │   │   └─ 删除客户群进群方式配置  (delJoinWay)
│  │   ├─ [客户朋友圈]
│  │   │   ├─ 创建发表任务  (addMomentTask)
│  │   │   ├─ 获取任务创建结果  (getMomentTaskResult)
│  │   │   ├─ 停止发表企业朋友圈  (cancelMomentTask)
│  │   │   ├─ 获取企业全部的发表列表  (getMomentTaskList)
│  │   │   ├─ 获取客户朋友圈发表时刻的成员发送情况  (getMomentTask)
│  │   │   ├─ 获取客户朋友圈发表时选择的可见范围  (getMomentCustomerList)
│  │   │   ├─ 获取客户朋友圈发表后的可见客户列表  (getMomentSendResult)
│  │   │   └─ 获取客户朋友圈的互动数据  (getMomentComments)
│  │   ├─ [朋友圈规则]
│  │   │   ├─ 获取朋友圈规则组列表  (listMomentStrategy)
│  │   │   ├─ 获取朋友圈规则组详情  (getMomentStrategy)
│  │   │   ├─ 获取朋友圈规则组管理范围  (getMomentStrategyRange)
│  │   │   ├─ 创建朋友圈规则组  (createMomentStrategy)
│  │   │   ├─ 编辑朋友圈规则组  (editMomentStrategy)
│  │   │   └─ 删除朋友圈规则组  (deleteMomentStrategy)
│  │   ├─ [消息推送]
│  │   │   ├─ 创建企业群发  (addMsgTemplate)
│  │   │   ├─ 提醒成员群发  (remindGroupMsgSend)
│  │   │   ├─ 停止企业群发  (cancelGroupMsgSend)
│  │   │   ├─ 获取群发记录列表  (getGroupMsgListV2)
│  │   │   ├─ 获取群发成员发送任务列表  (getGroupMsgTask)
│  │   │   ├─ 获取企业群发成员执行结果  (getGroupMsgSendResult)
│  │   │   ├─ 发送新客户欢迎语  (sendWelcomeMsg)
│  │   │   ├─ 添加入群欢迎语素材  (addGroupWelcomeTemplate)
│  │   │   ├─ 编辑入群欢迎语素材  (editGroupWelcomeTemplate)
│  │   │   ├─ 获取入群欢迎语素材  (getGroupWelcomeTemplate)
│  │   │   └─ 删除入群欢迎语素材  (delGroupWelcomeTemplate)
│  │   ├─ [统计管理]
│  │   │   ├─ 获取「联系客户统计」数据  (getUserBehaviorData)
│  │   │   └─ 获取「群聊数据统计」数据  (getGroupChatStatistic)
│  │   ├─ [商品图册]
│  │   │   ├─ 创建商品图册  (addProductAlbum)
│  │   │   ├─ 获取商品图册列表  (getProductAlbumList)
│  │   │   ├─ 获取商品图册  (getProductAlbum)
│  │   │   ├─ 编辑商品图册  (updateProductAlbum)
│  │   │   └─ 删除商品图册  (deleteProductAlbum)
│  │   ├─ [敏感词管理]
│  │   │   ├─ 新建敏感词规则  (addInterceptRule)
│  │   │   ├─ 获取敏感词规则列表  (getInterceptRuleList)
│  │   │   ├─ 获取敏感词规则详情  (getInterceptRule)
│  │   │   ├─ 修改敏感词规则  (updateInterceptRule)
│  │   │   └─ 删除敏感词规则  (deleteInterceptRule)
│  │   ├─ [获客链接]
│  │   │   ├─ 查询获客助手剩余使用量  (getCustomerAcquisitionQuota)
│  │   │   ├─ 查询获客链接使用详情  (getCustomerAcquisitionStatistic)
│  │   │   ├─ 获取获客链接列表  (listCustomerAcquisitionLink)
│  │   │   ├─ 获取获客链接详情  (getCustomerAcquisitionLink)
│  │   │   ├─ 创建获客链接  (createCustomerAcquisitionLink)
│  │   │   ├─ 编辑获客链接  (updateCustomerAcquisitionLink)
│  │   │   ├─ 删除获客链接  (deleteCustomerAcquisitionLink)
│  │   │   ├─ 获取由获客链接添加的客户信息  (getCustomerAcquisitionCustomer)
│  │   │   └─ 获取成员多次收消息详情  (getCustomerAcquisitionChatInfo)
│  │   ├─ [其他接口]
│  │   │   ├─ 上传附件资源  (uploadAttachment)
│  │   │   ├─ 获取已服务的外部联系人  (getServedExternalContact)
│  │   │   └─ 生成代支付key  (createOnceKey)
│  │   ├─ [家校通知]
│  │   │   └─ 发送学校通知  (sendSchoolMessage)
│  │   ├─ [规则组标签]
│  │   │   ├─ 添加企业客户标签  (externalcontactAddStrategyTag)
│  │   │   ├─ 删除企业客户标签  (externalcontactDelStrategyTag)
│  │   │   ├─ 编辑企业客户标签  (externalcontactEditStrategyTag)
│  │   │   └─ 获取标签列表  (externalcontactGetStrategyTagList)
│  │   ├─ [客户联系]
│  │   │   ├─ external_userid转openid  (externalcontactConvertToOpenid)
│  │   │   ├─ 获取群发执行结果(旧)  (externalcontactGetGroupMsgResult)
│  │   │   └─ 分配在职成员客户(旧)  (externalcontactTransfer)
│  │   ├─ [客户规则组]
│  │   │   ├─ 创建规则组  (externalcontactCustomerStrategyCreate)
│  │   │   ├─ 删除规则组  (externalcontactCustomerStrategyDel)
│  │   │   ├─ 编辑规则组  (externalcontactCustomerStrategyEdit)
│  │   │   ├─ 获取规则组详情  (externalcontactCustomerStrategyGet)
│  │   │   ├─ 获取管理范围  (externalcontactCustomerStrategyGetRange)
│  │   │   └─ 获取规则组列表  (externalcontactCustomerStrategyList)
│  │   ├─ [学校通知]
│  │   │   ├─ 获取关注模式  (externalcontactGetSubscribeMode)
│  │   │   ├─ 获取关注二维码  (externalcontactGetSubscribeQrCode)
│  │   │   └─ 设置关注模式  (externalcontactSetSubscribeMode)
│  │   └─ [客户联系(旧)]
│  │       ├─ 创建企业群发  (crmAddMsgTemplate)
│  │       ├─ 获取客户列表  (crmGetCustomerContacts)
│  │       ├─ 获取客户详情  (crmGetExternalContact)
│  │       ├─ 获取客户列表2  (crmGetExternalContactList)
│  │       ├─ 获取群发结果  (crmGetGroupMsgResult)
│  │       ├─ 获取待分配列表  (crmGetUnassignedList)
│  │       ├─ 获取联系客户统计  (crmGetUserBehaviorData)
│  │       └─ 分配客户  (crmTransferExternalContact)
│
│  ├─ 资源 · 微信客服  (kf)  · 21 ops
│  │   ├─ [客服账号管理]
│  │   │   ├─ 添加客服账号  (addKfAccount)
│  │   │   ├─ 删除客服账号  (delKfAccount)
│  │   │   ├─ 修改客服账号  (updateKfAccount)
│  │   │   ├─ 获取客服账号列表  (listKfAccount)
│  │   │   └─ 获取客服账号链接  (getKfAccountLink)
│  │   ├─ [接待人员管理]
│  │   │   ├─ 添加接待人员  (addServicer)
│  │   │   ├─ 删除接待人员  (delServicer)
│  │   │   └─ 获取接待人员列表  (listServicer)
│  │   ├─ [会话与消息]
│  │   │   ├─ 获取会话状态  (getServiceState)
│  │   │   ├─ 分配客服会话  (transServiceState)
│  │   │   ├─ 发送消息  (sendKfMsg)
│  │   │   ├─ 发送事件响应消息  (sendKfEventMsg)
│  │   │   ├─ 读取消息  (syncMsg)
│  │   │   ├─ 为客户升级服务  (setUpgradeService)
│  │   │   ├─ 取消客户升级服务  (cancelUpgradeService)
│  │   │   ├─ 获取升级服务配置  (getUpgradeServiceConfig)
│  │   │   └─ 获取客户基础信息  (getCustomerInfo)
│  │   ├─ [统计管理]
│  │   │   ├─ 获取企业客服数据统计  (getCorpStatistic)
│  │   │   └─ 获取接待人员数据统计  (getServicerStatistic)
│  │   └─ [机器人管理]
│  │       ├─ 管理知识库分组  (manageKnowledgeGroup)
│  │       └─ 管理知识库问答  (manageKnowledgeIntent)
│
│  ├─ 资源 · 家校应用  (school)  · 42 ops
│  │   ├─ [家校沟通]
│  │   │   ├─ 获取健康上报使用统计  (getHealthReportStat)
│  │   │   ├─ 获取健康上报任务ID列表  (getHealthReportJobIds)
│  │   │   ├─ 获取健康上报任务详情  (getHealthReportJobInfo)
│  │   │   ├─ 获取健康上报填写答案  (getHealthReportAnswer)
│  │   │   ├─ 获取老师直播ID列表  (getUserLivingId)
│  │   │   ├─ 获取直播详情  (getLivingInfo)
│  │   │   ├─ 获取观看直播统计  (getLivingWatchStat)
│  │   │   ├─ 获取未观看直播统计  (getLivingUnwatchStat)
│  │   │   ├─ 删除直播回放  (deleteLivingReplayData)
│  │   │   ├─ 获取观看直播统计V2  (getLivingWatchStatV2)
│  │   │   ├─ 获取未观看直播统计V2  (getLivingUnwatchStatV2)
│  │   │   ├─ 获取学生付款结果  (getTradeResult)
│  │   │   ├─ 获取订单详情  (getTradeDetail)
│  │   │   ├─ 获取可使用的家长范围  (getAllowScope)
│  │   │   ├─ 获取家校访问用户身份  (getUserInfo3rd)
│  │   │   ├─ 创建学生  (createStudent)
│  │   │   ├─ 删除学生  (deleteStudent)
│  │   │   ├─ 更新学生  (updateStudent)
│  │   │   ├─ 批量创建学生  (batchCreateStudent)
│  │   │   ├─ 批量删除学生  (batchDeleteStudent)
│  │   │   ├─ 批量更新学生  (batchUpdateStudent)
│  │   │   ├─ 创建家长  (createParent)
│  │   │   ├─ 删除家长  (deleteParent)
│  │   │   ├─ 更新家长  (updateParent)
│  │   │   ├─ 批量创建家长  (batchCreateParent)
│  │   │   ├─ 批量删除家长  (batchDeleteParent)
│  │   │   ├─ 批量更新家长  (batchUpdateParent)
│  │   │   └─ 读取学生或家长  (getSchoolUser)
│  │   ├─ [家校部门]
│  │   │   ├─ 创建部门  (departmentCreate)
│  │   │   ├─ 删除部门  (departmentDelete)
│  │   │   ├─ 获取部门列表  (departmentList)
│  │   │   └─ 更新部门  (departmentUpdate)
│  │   ├─ [家校]
│  │   │   ├─ 获取群创建模式  (getChatCreateMode)
│  │   │   ├─ 获取访问用户身份  (getuserinfo)
│  │   │   ├─ 设置通讯录同步模式  (setArchSyncMode)
│  │   │   ├─ 设置群创建模式  (setChatCreateMode)
│  │   │   └─ 设置升级信息  (setUpgradeInfo)
│  │   ├─ [家校直播]
│  │   │   ├─ 获取直播详情  (livingGetLivingInfo)
│  │   │   ├─ 获取未观看统计  (livingGetUnwatchStat)
│  │   │   └─ 获取观看统计  (livingGetWatchStat)
│  │   ├─ [家校学生]
│  │   │   └─ 获取学生列表  (userList)
│  │   └─ [家校家长]
│  │       └─ 获取家长列表  (userListParent)
│
│  └─ 资源 · 政民沟通  (living)  · 21 ops
│      ├─ [网格管理]
│      │   ├─ 添加网格  (addGrid)
│      │   ├─ 编辑网格  (updateGrid)
│      │   ├─ 删除网格  (deleteGrid)
│      │   ├─ 获取网格列表  (getGridList)
│      │   └─ 获取用户网格列表  (getUserGridList)
│      ├─ [事件类别]
│      │   ├─ 添加事件类别  (addEventCategory)
│      │   ├─ 修改事件类别  (updateEventCategory)
│      │   ├─ 删除事件类别  (deleteEventCategory)
│      │   └─ 获取事件类别列表  (getEventCategoryList)
│      ├─ [巡查上报]
│      │   ├─ 获取巡查网格负责人信息  (getInspectGridInfo)
│      │   ├─ 获取单位巡查上报统计  (getCorpInspectStat)
│      │   ├─ 获取个人巡查上报统计  (getUserInspectStat)
│      │   ├─ 获取巡查上报分类统计  (getInspectCategoryStat)
│      │   ├─ 获取巡查上报事件列表  (getInspectEventList)
│      │   └─ 获取巡查上报事件详情  (getInspectEventDetail)
│      └─ [居民上报]
│          ├─ 获取居民网格负责人信息  (getResidentGridInfo)
│          ├─ 获取单位居民上报统计  (getCorpResidentStat)
│          ├─ 获取个人居民上报统计  (getUserResidentStat)
│          ├─ 获取居民上报分类统计  (getResidentCategoryStat)
│          ├─ 获取居民上报事件列表  (getResidentEventList)
│          └─ 获取居民上报事件详情  (getResidentEventDetail)
│
└─ 触发器节点
   ├─ 企业微信(WeCom)消息接收触发器
   │    type: weComTrigger
   │    ├─ 参数 · Path
   │    ├─ 参数 · 事件类型
   │    └─ 参数 · 返回原始数据
   ├─ 企业微信(WeCom)消息接收（被动回复）触发器
   │    type: weComPassiveTrigger
   │    ├─ 参数 · Path
   │    ├─ 参数 · 消息类型
   │    └─ 参数 · 返回原始数据
   ├─ 企业微信(WeCom)第三方应用指令回调触发器
   │    type: weComSuiteTrigger
   │    ├─ 参数 · Path
   │    ├─ 参数 · 事件类型
   │    └─ 参数 · 返回原始数据
   └─ 企业微信(WeCom)智能机器人消息接收触发器
        type: weComAiBotTrigger
        ├─ 参数 · Path
        ├─ 参数 · 消息类型
        └─ 参数 · 返回原始数据
```

**统计**：Action 节点 3 · 资源 40 · 操作 718 · 触发器 4
