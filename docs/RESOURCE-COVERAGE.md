# 官方服务端 API 章节 ↔ n8n 资源覆盖矩阵

对照范围：`docs/001-企业内部开发/002-服务端API/`

生成说明：从官方文档抽取 `/cgi-bin/*` 路径，与 `nodes/WeCom/resources/**` 中出现的路径做集合比对；部分章节叠加人工判定（能力边界、SDK-only、命名债）。

## 状态图例

| 状态 | 含义 |
|------|------|
| **齐** | 该章主路径已落地，可按文档使用对应 Resource |
| **部分** | 有 Resource，主场景可用，但子接口/子域仍有缺口 |
| **薄** | 仅零星接口 |
| **无/极弱** | 基本未实现 |
| **n/a** | 非业务接口章 |

## 总览矩阵

| # | 官方章节 | 入口节点 | n8n 资源 | 状态 | 路径命中 | API 文档页 | 备注 |
|---|----------|----------|----------|------|----------|------------|------|
| 001 | 001-开发指南 | — | — | **n/a** | 2/3 (67%) | 5/6 | 概念/接入，非业务接口集合 |
| 003 | 003-账号ID | Base | `accountId` | **部分** | 3/4 (75%) | 2/3 | 缺 opencorpid_to_corpid 等少量转换 |
| 004 | 004-通讯录管理 | Base | `contact` | **齐** | 37/37 (100%) | 37/47 |  |
| 005 | 005-身份验证 | Base | `system` | **部分** | 1/5 (20%) | 9/11 | 仅 system 的 token/IP；oauth getuserinfo/getuserdetail/tfa 未封装 |
| 006 | 006-企业互联 | Base | `linkedcorp` | **齐** | 3/3 (100%) | 3/4 |  |
| 007 | 007-上下游 | Base | `linkedcorp` | **齐** | 17/20 (85%) | 16/20 |  |
| 008 | 008-安全管理 | Base | `security` | **齐** | 16/16 (100%) | 9/10 |  |
| 009 | 009-消息接收与发送 | Base/Base+Trigger | `message`, `appChat`, `pushMessage`, `passiveReply`, `aibotPassiveReply`, +Triggers | **部分** | 13/15 (87%) | 15/25 | 应用消息/群聊/被动回复较全；群机器人 webhook 在 pushMessage，路径字符串可能不同 |
| 010 | 010-应用管理 | Base | `agent` | **齐** | 11/11 (100%) | 6/7 |  |
| 011 | 011-素材管理 | Base | `material` | **齐** | 6/6 (100%) | 6/6 | media/upload|get|uploadimg 等在 material；路径抽取应已命中 |
| 012 | 012-电子发票 | Base | `invoice` | **齐** | 4/4 (100%) | 4/5 |  |
| 013 | 013-数据与智能专区 | Base | `chatdata` | **部分** | 13/14 (93%) | 11/50 | 应用侧 chatdata 较全；专区 SDK 内接口不在 n8n；upload_media 多为 multipart 未做 |
| 015 | 015-客户联系 | Wechat | `externalContact` | **部分** | 79/101 (78%) | 42/48 |  |
| 016 | 016-微信客服 | Wechat | `kf` | **齐** | 27/27 (100%) | 18/20 |  |
| 017 | 017-企业支付 | Base | `externalpay` | **部分** | 5/8 (62%) | 11/15 | 对外收款 externalpay 已有；企业红包/向员工付款/向员工收款等缺失；进件在 miniapppay 章 |
| 018 | 018-小程序接入对外收款 | Base | `miniapppay` | **部分** | 7/7 (100%) | 8/11 | 支付退款账单主路径齐；apply_mch 进件与 upload_image 未封装 |
| 019 | 019-会话内容存档 | Base | `msgaudit` | **部分** | 5/5 (100%) | 4/10 | HTTP 辅助接口齐；拉消息走专有 SDK，无法用普通 OpenAPI 资源覆盖 |
| 020 | 020-家校沟通 | Wechat | `school`, `externalContact` | **部分** | 15/31 (48%) | 31/35 | 与 school/externalContact 交叉；订阅号/部分 oauth 路径未覆盖 |
| 021 | 021-家校应用 | Wechat | `school` | **部分** | 8/13 (62%) | 13/13 | 学生家长等有；部分 school/living、支付结果路径命名可能不一致 |
| 022 | 022-政民沟通 | Wechat | `living` | **齐** | 21/21 (100%) | 21/24 | 资源名 living 易误解，实现为 report/* |
| 024 | 024-邮件 | Office | `mail` | **齐** | 24/24 (100%) | 26/29 |  |
| 025 | 025-文档 | Office | `wedoc` | **部分** | 41/50 (82%) | 79/96 | 主体齐；content_priv、字段分组等智能表格高级能力有缺口 |
| 026 | 026-日程 | Office | `calendar` | **齐** | 11/11 (100%) | 11/19 |  |
| 027 | 027-会议 | Office | `meeting` | **部分** | 17/104 (16%) | 108/140 | 基础会议+部分会控/录制/vip；报名/布局/Rooms/MRA 等大量未封装 |
| 028 | 028-微盘 | Office | `wefile` | **部分** | 25/31 (81%) | 28/36 | 主体齐；分片上传 init/part/finish、容量管理等缺口 |
| 029 | 029-直播 | Office | `live` | **齐** | 9/9 (100%) | 9/11 |  |
| 030 | 030-公费电话 | Office | `phone` | **齐** | 1/1 (100%) | 1/1 |  |
| 031 | 031-打卡 | Office | `checkin` | **齐** | 14/15 (93%) | 12/12 |  |
| 032 | 032-审批 | Office | `approval` | **部分** | 9/11 (82%) | 11/13 | oa 审批主体齐；旧版 corp/getapprovaldata 等可能未接 |
| 033 | 033-汇报 | Office | `journal` | **齐** | 4/4 (100%) | 4/5 |  |
| 034 | 034-人事助手 | Office | `hr` | **齐** | 3/3 (100%) | 3/4 |  |
| 035 | 035-会议室 | Office | `meetingroom` | **齐** | 10/10 (100%) | 2/4 |  |
| 036 | 036-高级功能 | 分散 | (vip 分散) wedoc/wefile/meeting/security/mail | **部分** | 0/2 (0%) | 2/6 | 无独立 resource；vip 分散在各业务；advanced_feature 审批接口未接 |
| 037 | 037-紧急通知应用 | Office | `emergency` | **部分** | 1/2 (50%) | 2/3 | 发起呼叫有；getstates 接听状态路径需核对 |

## 状态汇总

- **齐**: 17 章
- **部分**: 16 章
- **n/a**: 1 章

- 节点已实现路径（去重）: **527**（一等业务操作）
- 文档抽取路径（各章合计，含跨章重复）: **628**
- **遗漏 HTTP 补全**: 已按业务 Resource 一等操作补入（meeting/extraHttpOps 等），请求体/Query 用 JSON；不含商户 XML 与 SDK-only/multipart

## 覆盖结构关系（简图）

```
docs/001-企业内部开发/002-服务端API
├── 基础/平台 ──► WeComBase
│   contact, agent, material, message*, security,
│   accountId, system, linkedcorp, chatdata, msgaudit,
│   externalpay, miniapppay, invoice, ...
├── 办公 OA ────► WeComOffice
│   wedoc, wefile, mail, calendar, meeting, live,
│   checkin, approval, journal, hr, meetingroom, ...
├── 连接微信 ───► WeComWechat
│   externalContact, kf, school, living(政民/report)
└── 消息回调 ───► Triggers（不在 Resource 树）
```

## 优先补齐建议（按投入产出）

| 优先级 | 章节 | 状态 |
|--------|------|------|
| P0 | 027-会议 enroll/rooms/layout/phone/poll | **已补一批**（仍非全量高级能力） |
| P0 | 命名债 living/wefile/linkedcorp | **已做** UI 说明 |
| P1 | 017 红包/向员工付款 | **边界**：mch XML+证书，未进 weComApi |
| P1 | 018 进件 apply_mch | **已补** miniapppay |
| P1 | 025 content_priv / field_group | **已补** |
| P1 | 028 分片上传 + capacity | **已补** |
| P2 | 021 家校路径 | **已对齐** school payment/living v2 |
| P2 | 003 opencorpid_to_corpid | **已补** |
| P2 | 032 旧版审批数据 | **已补** getopenapprovaldata |
| — | 005 身份验证 oauth | 仍属客户端/网页场景，可选 |
| — | 013/019 SDK | 保持部分即可 |

## 各「部分」章节缺口样例

### 003-账号ID

- 资源: accountId
- 路径命中: 3/4 (75%)
- 说明: 缺 opencorpid_to_corpid 等少量转换
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/corp/opencorpid_to_corpid`

### 005-身份验证

- 资源: system
- 路径命中: 1/5 (20%)
- 说明: 仅 system 的 token/IP；oauth getuserinfo/getuserdetail/tfa 未封装
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/auth/get_tfa_info`
  - `/cgi-bin/auth/getuserdetail`
  - `/cgi-bin/auth/getuserinfo`
  - `/cgi-bin/user/tfa_succ`

### 009-消息接收与发送

- 资源: message, appChat, pushMessage, passiveReply, aibotPassiveReply, +Triggers
- 路径命中: 13/15 (87%)
- 说明: 应用消息/群聊/被动回复较全；群机器人 webhook 在 pushMessage，路径字符串可能不同
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/aibot/response`
  - `/cgi-bin/webhook/send`

### 013-数据与智能专区

- 资源: chatdata
- 路径命中: 13/14 (93%)
- 说明: 应用侧 chatdata 较全；专区 SDK 内接口不在 n8n；upload_media 多为 multipart 未做
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/chatdata/upload_media`

### 015-客户联系

- 资源: externalContact
- 路径命中: 79/101 (78%)
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/crm`
  - `/cgi-bin/crm/add_msg_template`
  - `/cgi-bin/crm/get_customer_contacts`
  - `/cgi-bin/crm/get_external_contact`
  - `/cgi-bin/crm/get_external_contact_list`
  - `/cgi-bin/crm/get_group_msg_result`
  - `/cgi-bin/crm/get_unassigned_list`
  - `/cgi-bin/crm/get_user_behavior_data`
  - `/cgi-bin/crm/transfer_external_contact`
  - `/cgi-bin/externalcontact`
  - `/cgi-bin/externalcontact/add_strategy_tag`
  - `/cgi-bin/externalcontact/customer_strategy/create`

### 017-企业支付

- 资源: externalpay
- 路径命中: 5/8 (62%)
- 说明: 对外收款 externalpay 已有；企业红包/向员工付款/向员工收款等缺失；进件在 miniapppay 章
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/miniapppay/apply_mch`
  - `/cgi-bin/miniapppay/get_applyment_status`
  - `/cgi-bin/miniapppay/upload_image`

### 020-家校沟通

- 资源: school, externalContact
- 路径命中: 15/31 (48%)
- 说明: 与 school/externalContact 交叉；订阅号/部分 oauth 路径未覆盖
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/auth/getuserinfo`
  - `/cgi-bin/externalcontact/convert_to_openid`
  - `/cgi-bin/externalcontact/get_subscribe_mode`
  - `/cgi-bin/externalcontact/get_subscribe_qr_code`
  - `/cgi-bin/externalcontact/set_subscribe_mode`
  - `/cgi-bin/school/department/create`
  - `/cgi-bin/school/department/delete`
  - `/cgi-bin/school/department/list`
  - `/cgi-bin/school/department/update`
  - `/cgi-bin/school/get_chat_create_mode`
  - `/cgi-bin/school/getuserinfo`
  - `/cgi-bin/school/set_arch_sync_mode`

### 021-家校应用

- 资源: school
- 路径命中: 8/13 (62%)
- 说明: 学生家长等有；部分 school/living、支付结果路径命名可能不一致
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/school/get_payment_result`
  - `/cgi-bin/school/get_trade`
  - `/cgi-bin/school/living/get_living_info`
  - `/cgi-bin/school/living/get_unwatch_stat_v2`
  - `/cgi-bin/school/living/get_watch_stat_v2`

### 025-文档

- 资源: wedoc
- 路径命中: 41/50 (82%)
- 说明: 主体齐；content_priv、字段分组等智能表格高级能力有缺口
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/meeting/vip/batch_del_job_result`
  - `/cgi-bin/wedoc/smartsheet/add_field_group`
  - `/cgi-bin/wedoc/smartsheet/content_priv/create_rule`
  - `/cgi-bin/wedoc/smartsheet/content_priv/delete_rule`
  - `/cgi-bin/wedoc/smartsheet/content_priv/get_sheet_priv`
  - `/cgi-bin/wedoc/smartsheet/content_priv/mod_rule_member`
  - `/cgi-bin/wedoc/smartsheet/delete_field_groups`
  - `/cgi-bin/wedoc/smartsheet/get_field_groups`
  - `/cgi-bin/wedoc/smartsheet/update_field_group`

### 027-会议

- 资源: meeting
- 路径命中: 17/104 (16%)
- 说明: 基础会议+部分会控/录制/vip；报名/布局/Rooms/MRA 等大量未封装
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/meeting/advanced_layout/add`
  - `/cgi-bin/meeting/advanced_layout/apply`
  - `/cgi-bin/meeting/advanced_layout/batch_delete`
  - `/cgi-bin/meeting/advanced_layout/get_user_layout`
  - `/cgi-bin/meeting/advanced_layout/list`
  - `/cgi-bin/meeting/advanced_layout/update`
  - `/cgi-bin/meeting/check_device_in_meeting`
  - `/cgi-bin/meeting/create_customer_short_url`
  - `/cgi-bin/meeting/enroll/approve`
  - `/cgi-bin/meeting/enroll/delete`
  - `/cgi-bin/meeting/enroll/get_config`
  - `/cgi-bin/meeting/enroll/import`

### 028-微盘

- 资源: wefile
- 路径命中: 25/31 (81%)
- 说明: 主体齐；分片上传 init/part/finish、容量管理等缺口
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/meeting/vip/batch_del_job_result`
  - `/cgi-bin/wedrive/file_upload_finish`
  - `/cgi-bin/wedrive/file_upload_init`
  - `/cgi-bin/wedrive/file_upload_part`
  - `/cgi-bin/wedrive/get_file_permission`
  - `/cgi-bin/wedrive/mng_capacity`

### 032-审批

- 资源: approval
- 路径命中: 9/11 (82%)
- 说明: oa 审批主体齐；旧版 corp/getapprovaldata 等可能未接
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/corp/getapprovaldata`
  - `/cgi-bin/corp/getopenapprovaldata`

### 036-高级功能

- 资源: (vip 分散) wedoc/wefile/meeting/security/mail
- 路径命中: 0/2 (0%)
- 说明: 无独立 resource；vip 分散在各业务；advanced_feature 审批接口未接
- 文档有、节点未命中（最多 12 条）:
  - `/cgi-bin/advanced_feature/get_apply_id_list`
  - `/cgi-bin/advanced_feature/set_approval_detail`

### 037-紧急通知应用

- 资源: emergency
- 说明: `getCallStatus` 已对齐 `/cgi-bin/pstncc/getstates`（含 callee_userid）

## n8n 额外资源（001 服务端未单独成章）

| 资源 | 入口 | 更贴近文档 |
|------|------|------------|
| `appAuth` | Base | `002-第三方应用开发` 应用授权 |
| `license` | Base | 第三方接口调用许可 |
| `paytool` | Base | 第三方应用收银台 |
| `promotionQrcode` | Base | 服务商推广二维码 |
| `file` | Base | 回调加密文件解密（工具型） |
| `system` | Base | 开发指南/通用 gettoken、IP |

## 命名对照（历史 value）

| UI 中文 | resource value | 官方/API 实际 |
|---------|----------------|---------------|
| 政民沟通 | `living` | 022-政民沟通，`/cgi-bin/report/*`（非直播 `live`） |
| 微盘 | `wefile` | 028-微盘，`/cgi-bin/wedrive/*` |
| 企业互联 | `linkedcorp` | 006/007 企业互联与上下游，`/cgi-bin/corpgroup/*` |
| 直播 | `live` | 029-直播，`/cgi-bin/living/*` |

## 结论

1. **目录骨架与官方服务端章节同构**，约一半章节路径命中率已达「齐」。
2. **最大空洞在会议高级能力（027）**，其次是支付子域、文档/微盘高级接口、家校交叉路径。
3. **chatdata / msgaudit 标「部分」是能力边界正确**，不是单纯漏做。
4. **第三方资源挂在 Base** 合理，但验收时不要只对照 `001-企业内部开发`。
