---
title: "获取下级-下游企业的access_token"
path: "001-企业内部开发/002-服务端API/007-上下游/002-基础接口/002-获取下级-下游企业的access_token"
specfusion_id: wecom_3a9ecd52d9cf
source_url: "https://developer.work.weixin.qq.com/document/path/95816"
last_updated: "2026-02-12T16:34:40.109Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T07:30:31Z"
---
**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/corpgroup/corp/gettoken?access_token=ACCESS_TOKEN

```
{
  "corpid": "wwabc",
  "business_type":1,
  "agentid": 1111
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ---- | ---------------------------------------------------------------------------------------------------- |
| access_token | 是 | 调用接口凭证，上级/上游企业应用access_token |
| corpid | 是 | 已授权的下级/下游企业corpid |
| agentid | 是 | 已授权的下级/下游企业应用ID|
|business_type|否|填0则为企业互联/局校互联，填1则表示上下游企业，默认0|

**权限说明：**

- 自建应用和代开发应用

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "access_token": "accesstoken000001",
 "expires_in": 7200
}
```

**参数说明：**

| 参数 | 说明 |
| --- | --- |
| errcode | 出错返回码，为0表示成功，非0表示调用失败 |
| errmsg | 返回码提示语 |
| access_token | 获取到的下级/下游企业调用凭证，最长为512字节 |
| expires_in | 凭证的有效时间（秒） |
