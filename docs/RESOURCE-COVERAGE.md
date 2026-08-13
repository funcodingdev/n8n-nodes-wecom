# 官方服务端 API 章节 ↔ n8n 资源覆盖矩阵

对照范围：`docs/001-企业内部开发/002-服务端API/`

生成说明：路径命中以 `node scripts/validate-wecom-apis.mjs` 为准（文档 HTTP 路径 vs `nodes/WeCom/**` 中出现的 `/cgi-bin/*`）。表单产品化（form+JSON 双轨、成员/部门/标签 string+选择器）为持续增量。

## 状态图例

| 状态 | 含义 |
|------|------|
| **齐** | 该章主路径已落地，可按文档使用对应 Resource |
| **部分** | 有 Resource，主场景可用，但子能力边界仍有说明（SDK-only / 客户端场景 / multipart 等） |
| **n/a** | 非业务接口章 |

## 路径覆盖（权威）

| 指标 | 值 |
|------|----|
| 文档 HTTP 路径 | **611** |
| 已覆盖 | **611** |
| 缺失 | **0** |
| 覆盖率 | **100%** |

验收命令：

```bash
npm run build
node scripts/validate-wecom-apis.mjs
# 期望：coverage 611/611 / OK
```

详见 `docs/API-VALIDATION-REPORT.md`。

## 总览矩阵

| # | 官方章节 | 入口节点 | n8n 资源 | 路径 | 状态 | 备注 |
|---|----------|----------|----------|------|------|------|
| 001 | 001-开发指南 | — | — | 1/1 | **n/a** | 概念/接入 |
| 003 | 003-账号ID | Base | `accountId` | 4/4 | **齐** | 含 opencorpid_to_corpid 等转换 |
| 004 | 004-通讯录管理 | Base | `contact` | 37/37 | **齐** | 部门/成员/标签选择器双轨齐全 |
| 005 | 005-身份验证 | Base | `system` | 5/5 | **齐** | 含 getuserinfo/getuserdetail/tfa；网页 OAuth 场景仍偏客户端 |
| 006 | 006-企业互联 | Base | `linkedcorp` | 3/3 | **齐** | |
| 007 | 007-上下游 | Base | `linkedcorp` | 20/20 | **齐** | |
| 008 | 008-安全管理 | Base | `security` | 16/16 | **齐** | |
| 009 | 009-消息接收与发送 | Base + Triggers | `message` / `appChat` / `pushMessage` / `passiveReply` / `aibotPassiveReply` | 14/14 | **齐** | 群机器人 webhook 在 pushMessage；aibot 被动回复已接 |
| 010 | 010-应用管理 | Base | `agent` | 11/11 | **齐** | |
| 011 | 011-素材管理 | Base | `material` | 6/6 | **齐** | |
| 012 | 012-电子发票 | Base | `invoice` | 4/4 | **齐** | form+JSON 双轨 |
| 013 | 013-数据与智能专区 | Base | `chatdata` | 14/14 | **齐** | 专区 SDK 内能力不在 n8n 边界 |
| 015 | 015-客户联系 | Wechat | `externalContact` | 99/99 | **齐** | 部分 CRM 路径映射到 externalcontact 同构接口 |
| 016 | 016-微信客服 | Wechat | `kf` | 27/27 | **齐** | |
| 017 | 017-企业支付 | Base | `externalpay` / `mchpay` | 12/12 | **齐** | 对外收款 + 商户红包/付款（证书凭证） |
| 018 | 018-小程序对外收款 | Base | `miniapppay` | 8/8 | **齐** | 含进件 apply_mch |
| 019 | 019-会话内容存档 | Base | `msgaudit` | 5/5 | **齐** | HTTP 辅助齐；拉消息走专有 SDK |
| 020 | 020-家校沟通 | Wechat | `school` / `externalContact` | 31/31 | **齐** | 学生/家长 ID 非企业通讯录选择器 |
| 021 | 021-家校应用 | Wechat | `school` | 13/13 | **齐** | |
| 022 | 022-政民沟通 | Wechat | `living` | 21/21 | **齐** | 资源 value=`living`，API 为 report/* |
| 024 | 024-邮件 | Office | `mail` | 24/24 | **齐** | |
| 025 | 025-文档 | Office | `wedoc` | 50/50 | **齐** | 智能表格成员字段支持选择器 |
| 026 | 026-日程 | Office | `calendar` | 11/11 | **齐** | |
| 027 | 027-会议 | Office | `meeting` | 104/104 | **齐** | 含报名/布局/Rooms/会控/录制/高级账号等 |
| 028 | 028-微盘 | Office | `wefile` | 31/31 | **齐** | 含分片上传与容量管理 |
| 029 | 029-直播 | Office | `live` | 9/9 | **齐** | |
| 030 | 030-公费电话 | Office | `phone` | 1/1 | **齐** | |
| 031 | 031-打卡 | Office | `checkin` | 15/15 | **齐** | |
| 032 | 032-审批 | Office | `approval` | 11/11 | **齐** | 含旧版 getapprovaldata / openapprovaldata |
| 033 | 033-汇报 | Office | `journal` | 4/4 | **齐** | |
| 034 | 034-人事助手 | Office | `hr` | 3/3 | **齐** | |
| 035 | 035-会议室 | Office | `meetingroom` | 10/10 | **齐** | |
| 036 | 036-高级功能 | 分散 | 各业务 VIP + `approval` advanced_feature | 2/2 | **齐** | VIP 分散在 meeting/wefile/security/mail 等 |
| 037 | 037-紧急通知 | Office | `emergency` | 2/2 | **齐** | |

## 表单产品化（双轨）

持续目标（与官方字段对齐、不改路径语义）：

1. **成员 / 部门 / 标签**：`string`（表达式/粘贴）+ `options`/`multiOptions`（`getAllUsers` / `getDepartments` / `getTags`），字符串优先。
2. **复杂列表**：表单 `fixedCollection` + JSON 覆盖（JSON 非空优先）。
3. **时间**：`dateTime` → 请求体 Unix 秒（接口要求毫秒时在 execute 内换算）。

当前规模（约）：

- `*_selected` 字段 ≈ **299**
- `loadOptionsMethod` 引用 ≈ **351**
- 明文 `userid` / 嵌套 `user_id` 企业成员字段：**已双轨**（密文 / 外部 OpenID / 家校学生家长等有意不接企业选择器）

## 仍可增量的方向（非路径缺口）

| 方向 | 说明 |
|------|------|
| extraHttpOps 表单加深 | 部分补全接口仍以关键字段 + `requestBody` JSON 为主（见 validation 报告登记表） |
| 家校 ID | 学生/家长/班级 ID 无法用企业通讯录 loadOptions |
| SDK / 客户端 | 会话存档拉消息、专区 SDK、部分 OAuth 网页流 |
| multipart | 个别 upload 场景依赖二进制上传链路 |

## 命名对照

| UI 中文 | resource value | 官方/API 实际 |
|---------|----------------|---------------|
| 政民沟通 | `living` | 022-政民沟通，`/cgi-bin/report/*`（非直播 `live`） |
| 微盘 | `wefile` | 028-微盘，`/cgi-bin/wedrive/*` |
| 企业互联 | `linkedcorp` | 006/007，`/cgi-bin/corpgroup/*` |
| 直播 | `live` | 029-直播，`/cgi-bin/living/*` |

## n8n 额外资源（001 服务端未单独成章）

| 资源 | 入口 | 更贴近文档 |
|------|------|------------|
| `appAuth` | Base | `002-第三方应用开发` 应用授权 |
| `license` | Base | 第三方接口调用许可 |
| `paytool` | Base | 第三方应用收银台 |
| `promotionQrcode` | Base | 服务商推广二维码 |
| `file` | Base | 回调加密文件解密（工具型） |
| `system` | Base | gettoken、IP、部分 auth |
| `mchpay` | Base | 企业红包 / 向员工付款（商户证书） |

## 结论

1. **HTTP 路径覆盖 611/611（100%）**，以 validate 脚本为准；旧矩阵中的「会议 16%」等数字已过期。
2. **最大剩余工作在体验层**：extraHttpOps 表单深化、复杂 JSON 的表单双轨、家校/密文 ID 场景说明。
3. **chatdata / msgaudit 的 SDK 边界保持正确**，不是漏做 OpenAPI。
4. **第三方资源挂在 Base** 合理，验收时不要只对照 `001-企业内部开发`。
