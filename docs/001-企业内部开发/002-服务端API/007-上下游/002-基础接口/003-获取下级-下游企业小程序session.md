---
title: "获取下级/下游企业小程序session"
doc_id: 25574
category_id: 95817
source_url: https://developer.work.weixin.qq.com/document/path/95817
---
最后更新：2023/01/11

[TOC]

上级/上游企业通过该接口转换为下级/下游企业的小程序session

**请求方式**:POST(**HTTPS**)

**请求地址:** https://qyapi.weixin.qq.com/cgi-bin/miniprogram/transfer_session?access_token=ACCESS_TOKEN

**请求示例**

```json
{
 "userid": "wmAoNVCwAAUrSqEqz7oQpEIEMVWDrPeg",
 "session_key": "n8cnNEoyW1pxSRz6/Lwjwg=="
}
```

**参数说明**:

|参数|必须|类型|说明|
|:-----------|:---|:-------|:------------|
| access_token | 是 | string | 调用接口凭证。下级/下游企业的 access_token |
|userid|是|string|通过[code2Session接口](#16056)获取到的加密的userid</br>不多于64字节|
|session_key|是|string|通过[code2Session接口](#16056)获取到的属于上级/上游企业的会话密钥-</br>不多于64字节|

**权限说明**: 
- 必须使用下级/下游企业的 access_token，见[获取下级/下游企业的access_token](#24919)，且access_token对应的下级/下游企业应用，必须是session_key对应的上级/上游企业应用分享而来

**返回结果**:

```json
{
 "userid": "abcdef",
 "session_key": "DGAuy2KVaGcnsUrXk8ERgw==",
 "errcode": 0,
 "errmsg": "ok"
}
```

**参数说明**:

|参数|类型|说明|
|:-----------|:-------------|:----------|
|userid|string|下级/下游企业用户的ID|
|session_key|string|属于下级/下游企业的会话密钥|
|errcode|int32|返回码|
|errmsg|string|错误码描述|
