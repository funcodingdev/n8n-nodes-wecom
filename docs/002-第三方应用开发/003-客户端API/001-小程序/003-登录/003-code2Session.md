---
title: "code2Session"
doc_id: 19720
category_id: 92423
source_url: https://developer.work.weixin.qq.com/document/path/92423
---
最后更新：2022/09/23

临时登录凭证校验接口是一个```服务端HTTPS 接口```，开发者服务器使用临时登录凭证code获取 session_key、用户userid以及用户所在企业的corpid等信息。

**接口地址：**

```c++
https://qyapi.weixin.qq.com/cgi-bin/service/miniprogram/jscode2session?suite_access_token=SUITE_ACCESS_TOKEN&js_code=CODE&grant_type=authorization_code

```

>注意，第三方请求jscode2session的url与企业自建应用不同，url中多了/service/；参数是suite_access_token，而非access_token，请开发者注意区分。

**请求参数**

| 参数 | 是否必须 | 说明 |
| ------------------ | ---- | ---------------------------------------- |
| suite_access_token | 是 | 第三方应用凭证，获取方法见[获取第三方应用凭证](#10975/获取第三方应用凭证)。要求必须由该小程序关联的第三方应用的secret获取 |
| js_code | 是 | 登录时获取的 code |
| grant_type | 是 | 此处固定为authorization_code |

**返回说明**

```c++
//正常返回的JSON数据包
{
 "corpid": "CORPID",
 "userid": "USERID",
 "session_key": "kJtdi6RF+Dv67QkbLlPGjw==",
   "open_userid": "woTD_bDwAA6qQBOujKfgScxHP3msqqng",
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
| userid | 用户在企业内的UserID，对应管理端的账号，企业内唯一。注意：如果用户所在企业并没有安装此小程序应用，则返回加密的userid |
| session_key | 会话密钥 |
|open_userid|全局唯一。对于同一个服务商，不同应用获取到企业内同一个成员的open_userid是相同的，最多64个字节；同一用户，对于不同服务商open_userid是不同的|
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |

**注意：**<br/>

1. 企业微信的jscode2session请求url与微信的不同
2. 企业微信的jscode2session返回的是userid，而微信返回的是openid
3. 获取access_token时请使用企业的corpid参数，请勿使用小程序的appid
4. 会话密钥 session_key 是对用户数据进行加密签名的密钥，为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。
