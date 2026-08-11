---
title: "JS-SDK 签名算法"
doc_id: 14924
category_id: 90506
source_url: https://developer.work.weixin.qq.com/document/path/90506
---
最后更新：2024/11/14

[TOC]

## 签名算法

生成 JS-SDK 签名需要用到以下参数：

1. **jsapi_ticket:** 获取方法参考 [获取企业 jsapi_ticket](#获取企业 jsapi_ticket) 和 [获取应用 jsapi_ticket](#获取应用 jsapi_ticket)
1. **noncestr:** 随机字符串
1. **timestamp:** 当前时间戳，单位为秒
1. **url:** 当前页面的 URL，<font color="red">不包含“#”及后面部分</font>

准备好上述参数后，按以下结构拼接成一个字符串：

```
jsapi_ticket=JSAPI_TICKET&noncestr=NONCESTR&timestamp=TIMESTAMP&url=URL
```

**注意：只需按上述规则进行拼接，不要改变参数顺序，不要进行 URL encode**

拼接完成后，对拼接后的字符串进行 SHA-1，SHA-1 的结果即为 JS 接口签名。

**示例**

假设有如下参数：

```
noncestr=Wm3WZYTPz0wzccnW
jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
timestamp=1414587457
url=http://mp.weixin.qq.com?params=value

```

将这些参数拼接成字符串 str1：

```
jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value

```

随后对 str1 进行 SHA-1，得到 signature：

```
0f9de62fce790f9a083d5c99e95740ceb90c27ed
```

**注意事项**

- 出于安全考虑，开发者必须在服务器端实现签名的逻辑
- 如出现 invalid signature 等错误，请参考[常见错误及解决办法](#90001/90144/93204)

## 获取企业 jsapi_ticket

企业的 jsapi_ticket 是企业页面调用企业微信 JS 接口的临时票据，用于企业应用鉴权（getConfigSignature）。

**注意**

获取 jsapi_ticket 的接口有非常严格的调用频率限制（一小时内，一个企业最多可获取 400 次，且单个应用不能超过 100 次），开发者必须在自己的后台服务中对 jsapi_ticket 进行缓存。

正常情况下 jsapi_ticket 的有效期为 7200 秒（2 小时），具体过期时间需要参考接口返回的 expires_in 属性。

**请求方式：**GET（**HTTPS**）
**请求 URL：**https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=ACCESS_TOKEN

**参数说明：**

|参数|必须|说明|
|---|---|---|
|access_token|是|调用接口凭证，<br/>企业内部开发，获取方式参考“[获取 access_token](#15074)” <br/>第三方应用开发，获取方式参考“[获取企业凭证](#14944)”|

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "ticket": "bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
 "expires_in": 7200
}
```

|参数|说明|
|---|---|
|ticket|生成签名所需的 jsapi_ticket，最长为512字节|
|expires_in|凭证的有效时间（秒）|

## 获取应用 jsapi_ticket

企业的 jsapi_ticket 是应用调用企业微信 JS 接口的临时票据，用于第三方应用鉴权（getAgentConfigSignature）。

**请求方式：**GET（**HTTPS**）
**请求URL：**https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token=ACCESS_TOKEN&type=agent_config

**参数说明：**

|参数|必须|说明|
|---|---|---|
|access_token|是|应用的调用接口凭证，<br/>企业内部开发，获取方式参考“[获取 access_token](#15074)” <br/>第三方应用开发，获取方式参考“[获取企业凭证](#14944)”|

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "ticket": "bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
 "expires_in": 7200
}
```
|参数|说明|
|---|---|
|ticket|生成签名所需的 jsapi_ticket，最长为512字节|
|expires_in|凭证的有效时间（秒）|
