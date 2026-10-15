---
title: "外部联系人openid转换"
path: "003-服务商代开发/001-服务端API/020-家校沟通/002-基础接口/004-外部联系人openid转换"
specfusion_id: wecom_e0598c8e61ea
source_url: "https://developer.work.weixin.qq.com/document/path/96721"
last_updated: "2026-07-26T08:08:31.119Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
企业和服务商可通过此接口，将**微信**外部联系人的userid（[如何获取?](#16684)）转为微信openid，用于调用支付相关接口。**暂不支持企业微信外部联系人（ExternalUserid为wo开头）的userid转openid**。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/externalcontact/convert_to_openid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "external_userid":"wmAAAAAAA"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 调用接口凭证 |
| external_userid | 是 | 外部联系人的userid，注意不是企业成员的账号 |

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "openid":"ooAAAAAAAAAAA"
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| openid |该企业的外部联系人openid|
