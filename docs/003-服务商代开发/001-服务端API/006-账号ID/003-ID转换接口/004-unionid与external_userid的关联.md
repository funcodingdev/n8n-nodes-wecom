---
title: "unionid与external_userid的关联"
doc_id: 39850
category_id: 97108
source_url: https://developer.work.weixin.qq.com/document/path/97108
---
最后更新：2025/11/17

[TOC]

1. 服务商在微信侧获取unionid后，可通过[unionid查询external_userid](#unionid转换为第三方external_userid)，如果微信用户还不是企业的客户，则返回一个pending_id，该 pending_id 90 天内有效。
2. 90天内微信用户成为企业客户时（包括成为企业微信外部联系人、进入企业微信客户群、48小时内进入微信客服会话），均可通过接口「[external_userid查询pending_id](#external_userid查询pending_id)」关联查询过的unionid。

## 推荐的适配方案

服务商可根据查询结果建立并存储ID映射库：

1. 当微信用户进入小程序等微信服务时，获取openid和unionid后，通过转换接口[「unionid查询external_userid」](#unionid转换为第三方external_userid)查询并记录ID映射关系，**不需要反复查询**。包括：
· unionid → external_userid
· unionid → pending_id
<br>
2. 当客户企业新增客户时，包括成为企业微信外部联系人和进入企业微信客户群，可通过接口[「external_userid查询pending_id」](#external_userid查询pending_id)立即关联到查询过的unionid，并更新ID映射：
· unionID → pending_id ← external_userid

## unionid转换为第三方external_userid
当微信用户进入服务商的小程序或公众号时，服务商可通过此接口，将**微信**客户的unionid转为第三方主体的external_userid，若该微信用户尚未成为企业的客户，则返回pending_id。
小程序或公众号的主体名称可以是企业的，也可以是服务商的。

该接口有调用频率限制，当subject_type为0时，按企业作如下的限制：10万次/小时、48万次/天、750万次/月；（注意这里是所有服务商共用企业额度的）
当subject_type为1时，按服务商作如下的限制：10万次/小时、48万次/天、750万次/月。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/idconvert/unionid_to_external_userid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "unionid":"oAAAAAAA",
 "openid":"oBBBB",
 "subject_type":1
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 调用接口凭证 ，[第三方应用access_token](#14944)或[代开发应用access_token](#15074) |
| unionid | 是 | 微信客户的unionid |
| openid | 是 | 微信客户的openid |
| subject_type | 否 | 小程序或公众号的主体类型：</br>0表示主体名称是企业的 (默认)，</br>1表示主体名称是服务商的 |

**权限说明：**
>当前授权企业必须已认证或已验证
>unionid（即微信开放平台账号主体）与openid（即小程序或服务号账号主体）需要认证，且主体名称需与当前授权企业的主体名称一致（[查看由服务商代注册的开放平台账号认证流程](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/Open_Platform_Account_Management.html#%E5%9B%9B%E3%80%81%E8%AE%A4%E8%AF%81%E4%BB%A3%E6%B3%A8%E5%86%8C%E7%9A%84%E5%B8%90%E5%8F%B7)），或者主体名称需与服务商的主体名称一致。
>openid与unionid必须是在同一个小程序获取到的
>「营销获客」应用只能获取到该应用带来的客户的external_userid

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "external_userid":"ooAAAAAAAAAAA",
 "pending_id":"ooBBBBBB"
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| external_userid |该授权企业的外部联系人ID|
| pending_id | 该微信账号尚未成为企业客户时，返回的临时外部联系人ID，该ID有效期为90天，当该用户在90天内成为企业客户时，可以通过[external_userid查询pending_id](#external_userid查询pending_id)关联|

> 注：
> 1. pending_id仅用于关联unionid与external_userid，并无法当成external_userid调用接口。
> 2. 当微信客户的跟进人或所在客户群的群主不在应用可见范围，也不返回external_userid，而是返回pending_id。
> 3. 营销获客应用的微信客户的跟进人或所在客户群的群主不在应用可见范围或客户可建联的成员范围，不返回external_userid，而是返回pending_id

## external_userid查询pending_id
该接口可用于当一个微信用户成为企业客户前已经使用过服务商服务（服务商曾通过[unionid查询external_userid](#unionid转换为第三方external_userid)接口获取到pending_id）的场景。本接口获取到的pending_id可以维持unionid和external_userid的关联关系。pending_id有效期为90天，超过有效期之后，将无法通过该接口将external_userid换取对应的pending_id。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/idconvert/batch/external_userid_to_pending_id?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "chat_id":"xxxxxx",
 "external_userid":["oAAAAAAA", "oBBBBB"]
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 调用接口凭证 ，[第三方应用access_token](#14944)或[代开发应用access_token](#15074) |
| external_userid | 是 | 该企业的外部联系人ID，最多可同时查询100个外部联系人 |
| chat_id | 否 | 群id，如果有传入该参数，则只检查群主是否在可见范围，同时会忽略在该群以外的external_userid。如果不传入该参数，则只检查客户跟进人是否在可见范围内。|

> 注:
> 当服务商曾通过[unionid查询external_userid](#unionid转换为第三方external_userid)获取到客户unionid对应的pending_id时，服务商才可通过本接口查询到该客户external_userid对应的pending_id。

**权限说明：**
>仅认证企业可调用
> 该客户的跟进人或其所在客户群群主必须在应用的可见范围之内
> 「营销获客」应用只能获取到该应用带来的客户，同时跟进人或其所在客户群群主在应用可见范围或客户可建联的成员范围

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "result":[
 {
  "external_userid":"oAAAAAAA",
   "pending_id":"pAAAAA"
 },
 {
   "external_userid":"oBBBBB",
   "pending_id":"pBBBBB"
 }
 ]
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
|result|转换结果|
| external_userid |该企业的外部联系人ID|
| pending_id | 该微信账号还未成为企业客户时，[unionid_to_external_userid接口](#unionid转换为第三方external-userid)返回的临时外部联系人ID|
