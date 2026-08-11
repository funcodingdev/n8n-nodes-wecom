---
title: "明文corpid转换为加密corpid"
path: "002-第三方应用开发/002-服务端API/003-应用授权/004-接口调用/008-明文corpid转换为加密corpid"
specfusion_id: wecom_323d1b2ebc6b
source_url: "https://developer.work.weixin.qq.com/document/path/95604"
last_updated: "2026-02-12T17:11:27.040Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T07:48:09Z"
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
>仅限第三方服务商，转换已获授权企业的corpid

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
| open_corpid |该服务商第三方应用下的企业ID|
