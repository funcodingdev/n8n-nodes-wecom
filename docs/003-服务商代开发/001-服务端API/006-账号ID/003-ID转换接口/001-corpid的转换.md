---
title: "corpid的转换"
path: "003-服务商代开发/001-服务端API/006-账号ID/003-ID转换接口/001-corpid的转换"
specfusion_id: wecom_ad41ba6d9c29
source_url: "https://developer.work.weixin.qq.com/document/path/97105"
last_updated: "2026-02-12T17:41:00.917Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:05:16Z"
---
**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/service/corpid_to_opencorpid?provider_access_token=ACCESS_TOKEN 

**请求参数：**
```
{
 "corpid":"xxxxx"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| provider_access_token | 是 | 应用服务商的provider_access_token，获取方法参见[服务商的凭证](#15143 ) |
| corpid | 是 | 待获取的企业ID |

**权限说明：**
>目前仅支持以下场景调用: 
> - 第三方服务商，转换已授权企业的corpid
> - 第三方服务商，转换[待迁移的自建应用](#52331)的企业corpid 

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "open_corpid":"AAAAAA"
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| open_corpid |该服务商第主体下的密文corpid|
