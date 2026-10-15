---
title: "code2Session"
path: "001-企业自建应用开发/003-客户端API/001-小程序/003-登录/003-code2Session"
specfusion_id: wecom_1377beac9cf7
source_url: "https://developer.work.weixin.qq.com/document/path/91507"
last_updated: "2026-08-17T04:02:25.719Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
临时登录凭证校验接口是一个```服务端HTTPS 接口```，开发者服务器使用临时登录凭证code获取 session_key、用户userid以及用户所在企业的corpid等信息。

**请求方式**：GET（HTTPS）

**接口地址：**

```c++
https://qyapi.weixin.qq.com/cgi-bin/miniprogram/jscode2session?access_token=ACCESS_TOKEN&js_code=CODE&grant_type=authorization_code

```

**请求参数**

| 参数 | 是否必须 | 说明 |
| ------------ | ---- | ---------------------------------------- |
| access_token | 是 | 调用接口凭证(注意，此处的access_token 是企业微信应用的access_token，获取方法参见“[获取access_token](#15074)”。要求必须由该小程序关联的企业微信应用的secret获取 |
| js_code | 是 | 登录时获取的 code |
| grant_type | 是 | 此处固定为authorization_code |

**权限说明：**
 access_token必须是与小程序关联的企业微信应用secret所获得。

**返回说明**

```c++
//正常返回的JSON数据包
{
 "corpid": "CORPID",
 "userid": "USERID",
 "session_key": "kJtdi6RF+Dv67QkbLlPGjw==",
 "errcode": 0,
 "errmsg": "ok"
}

//错误时返回JSON数据包(示例为Code无效)
{
 "errcode": 40029,
 "errmsg": "invalid code"
}

```
参数说明

| 参数 | 说明 |
| ----------- | ---------------------------------------- |
| corpid | 用户所属企业的corpid |
| userid | 用户在企业内的UserID，对应管理端的账号，企业内唯一。注意：第三方小程序此处返回加密的userid |
| session_key | 会话密钥 |

**注意：**<br/>

1. 企业微信的jscode2session请求url与微信的不同
2. 企业微信的jscode2session返回的是userid，而微信返回的是openid
3. 获取access_token时请使用企业的corpid参数，请勿使用小程序的appid
4. 会话密钥 session_key 是对用户数据进行加密签名的密钥，为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。
