---
title: "external_userid的转换"
doc_id: 42272
category_id: 97063
source_url: https://developer.work.weixin.qq.com/document/path/97063
---
最后更新：2022/11/03

[TOC]

将企业主体下的external_userid转换为服务商主体下的external_userid。

### 转换客户external_userid
**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_new_external_userid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "external_userid_list":["xxxxx","yyyyyy"]
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 代开发自建应用或第三方应用的接口凭证，服务商可通过“[获取企业access_token](#10975/获取企业access_token)”获得此调用凭证 |
| external_userid_list | 是 | 企业主体下的external_userid列表，建议200个，最多不超过1000个 |

**权限说明：**
>仅代开发自建应用或第三方应用可调用
> 客户联系和家校场景中，external_userid对应的跟进人需要在应用可见范围内
> 微信客服场景中，仅支持48小时内客服会话的external_userid
> 若是第三方应用且已设置externaluserid迁移完成，禁止调用本接口

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "items":[
   {
     "external_userid":"xxxxx",
     "new_external_userid":"AAAA"
   },
   {
     "external_userid":"yyyyy",
     "new_external_userid":"BBBB"
   }
 ]
｝
```
> 如果传入了服务商主体下的external_userid，则原样返回。

**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| new_external_userid | 服务商主体下的external_userid |

###转换客户群成员external_userid
[转换客户external_userid](#转换客户external-userid)接口不支持客户群的场景，如果需要转换客户群中无好友关系的群成员external_userid，需要调用本接口，调用时需要传入客户群的chat_id。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get_new_external_userid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "chat_id":"wrOgQhDgAAMYQiS5ol9G7gK9JVAAAA",
 "external_userid_list":["xxxxx","yyyyyy"]
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 代开发自建应用或第三方应用的接口凭证，服务商可通过“[获取企业access_token](#10975/获取企业access_token)”获得此调用凭证 |
| chat_id |是|客户群ID|
| external_userid_list | 是 | 企业主体下的external_userid列表，建议200个，最多不超过1000个 |

**权限说明：**
> 仅代开发自建应用或第三方应用可调用
> 客户群的群主需要在应用可见范围内
> 若是第三方应用且已设置externaluserid迁移完成，禁止调用本接口

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "items":[
   {
     "external_userid":"xxxxx",
     "new_external_userid":"AAAA"
   },
   {
     "external_userid":"yyyyy",
     "new_external_userid":"BBBB"
   }
 ]
｝
```
> 如果传入了新的external_userid，则原样返回。

**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| new_external_userid | 服务商主体下的external_userid |
