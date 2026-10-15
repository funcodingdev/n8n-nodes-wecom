# 官方服务端 API 章节 ↔ n8n 资源覆盖矩阵

对照范围：`docs/001-企业自建应用开发/002-服务端API/`（2026-10-16 同步后的官方目录）

路径命中取自 [API-VALIDATION-REPORT.md](./API-VALIDATION-REPORT.md)：从官方文档抽取 `/cgi-bin/*` 路径，与 `nodes/WeCom/resources/**` 中出现的路径做集合比对（`node scripts/validate-wecom-apis.mjs`）。

## 状态图例

| 状态 | 含义 |
|------|------|
| **齐** | 文档中的 HTTP 接口路径均已有对应操作 |
| **部分** | 仍有接口路径未实现 |
| **n/a** | 该章节没有可调用的 HTTP 接口 |

## 总览矩阵

| # | 官方章节 | 入口节点 | n8n 资源 | 状态 | 路径命中 | 备注 |
|---|----------|----------|----------|------|----------|------|
| 001 | 001-开发指南 | — | — | **齐** | 1/1 (100.0%) | 概念/接入说明 |
| 003 | 003-账号ID | Base | `accountId` | **齐** | 4/4 (100.0%) |  |
| 004 | 004-通讯录管理 | Base | `contact` | **齐** | 41/41 (100.0%) |  |
| 005 | 005-身份验证 | Base | `system` | **齐** | 5/5 (100.0%) | 网页授权/二次验证多为客户端场景 |
| 006 | 006-企业互联 | Base | `linkedcorp` | **齐** | 3/3 (100.0%) |  |
| 007 | 007-上下游 | Base | `linkedcorp` | **齐** | 20/20 (100.0%) |  |
| 008 | 008-安全管理 | Base | `security` | **齐** | 16/16 (100.0%) |  |
| 009 | 009-消息接收与发送 | Base/Base+Trigger | `message`, `appChat`, `pushMessage`, `passiveReply`, `aibotPassiveReply`, +Triggers | **齐** | 14/14 (100.0%) |  |
| 010 | 010-应用管理 | Base | `agent` | **齐** | 11/11 (100.0%) |  |
| 011 | 011-素材管理 | Base | `material` | **齐** | 6/6 (100.0%) |  |
| 012 | 012-电子发票 | Base | `invoice` | **齐** | 4/4 (100.0%) |  |
| 013 | 013-数据与智能专区 | Base | `chatdata` | **齐** | 15/15 (100.0%) | 专区程序内 SDK 接口不在 n8n 范围 |
| 015 | 015-客户联系 | Wechat | `externalContact` | **齐** | 99/99 (100.0%) |  |
| 016 | 016-微信客服 | Wechat | `kf` | **齐** | 27/27 (100.0%) |  |
| 017 | 017-企业支付 | Base | `externalpay` | **齐** | 12/12 (100.0%) | 企业红包/向员工付款见 `mchpay`（商户 XML + 证书） |
| 018 | 018-小程序接入对外收款 | Base | `miniapppay` | **齐** | 8/8 (100.0%) |  |
| 019 | 019-会话内容存档 | Base | `msgaudit` | **齐** | 5/5 (100.0%) | 拉取消息走专有 SDK，HTTP 辅助接口已覆盖 |
| 020 | 020-家校沟通 | Wechat | `school`, `externalContact` | **齐** | 31/31 (100.0%) |  |
| 021 | 021-家校应用 | Wechat | `school` | **齐** | 13/13 (100.0%) |  |
| 022 | 022-政民沟通 | Wechat | `living` | **齐** | 21/21 (100.0%) |  |
| 024 | 024-邮件 | Office | `mail` | **齐** | 24/24 (100.0%) |  |
| 025 | 025-文档 | Office | `wedoc` | **齐** | 70/70 (100.0%) |  |
| 026 | 026-日程 | Office | `calendar` | **齐** | 11/11 (100.0%) |  |
| 027 | 027-待办 | Office | `todo` | **齐** | 2/2 (100.0%) |  |
| 028 | 028-会议 | Office | `meeting` | **齐** | 105/105 (100.0%) |  |
| 029 | 029-微盘 | Office | `wefile` | **齐** | 31/31 (100.0%) |  |
| 030 | 030-直播 | Office | `live` | **齐** | 9/9 (100.0%) |  |
| 031 | 031-公费电话 | Office | `phone` | **齐** | 1/1 (100.0%) |  |
| 032 | 032-打卡 | Office | `checkin` | **齐** | 15/15 (100.0%) |  |
| 033 | 033-审批 | Office | `approval` | **齐** | 11/11 (100.0%) |  |
| 034 | 034-汇报 | Office | `journal` | **齐** | 4/4 (100.0%) |  |
| 035 | 035-人事助手 | Office | `hr` | **齐** | 3/3 (100.0%) |  |
| 036 | 036-会议室 | Office | `meetingroom` | **齐** | 10/10 (100.0%) |  |
| 037 | 037-高级功能 | 分散 | `approval`（申请单）, 各业务 vip 操作 | **齐** | 3/3 (100.0%) |  |
| 038 | 038-紧急通知应用 | Office | `emergency` | **齐** | 2/2 (100.0%) |  |

## 覆盖结构关系（简图）

```
docs/001-企业自建应用开发/002-服务端API
├── 基础/平台 ──► WeComBase
│   contact, agent, material, message*, security,
│   accountId, system, linkedcorp, chatdata, msgaudit,
│   externalpay, miniapppay, invoice, ...
├── 办公 OA ────► WeComOffice
│   wedoc, wefile, mail, calendar, todo, meeting, live,
│   checkin, approval, journal, hr, meetingroom, ...
├── 连接微信 ───► WeComWechat
│   externalContact, kf, school, living(政民/report)
└── 消息回调 ───► Triggers（不在 Resource 树）
```

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
| 微盘 | `wefile` | 029-微盘，`/cgi-bin/wedrive/*` |
| 企业互联 | `linkedcorp` | 006/007 企业互联与上下游，`/cgi-bin/corpgroup/*` |
| 直播 | `live` | 030-直播，`/cgi-bin/living/*` |

## 结论

1. 企业自建应用服务端文档中的 HTTP 接口路径已全部有对应操作。
2. 数据与智能专区、会话内容存档中依赖专有 SDK 的能力不在 n8n 节点范围内。
3. 第三方应用相关资源（`appAuth`、`license`、`paytool`、`promotionQrcode`）对应 `002-第三方应用开发` 文档，验收时需对照该目录。
