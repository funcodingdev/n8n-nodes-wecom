---
title: "外部联系人openid转换"
path: "001-企业内部开发/002-服务端API/020-家校沟通/002-基础接口/005-外部联系人openid转换"
specfusion_id: wecom_5008d93f47b3
source_url: "https://developer.work.weixin.qq.com/document/path/92323"
last_updated: "2026-02-12T16:48:39.539Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T07:34:52Z"
---
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
