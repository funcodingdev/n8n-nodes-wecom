---
title: "代开发应用external_userid转换"
doc_id: 35303
category_id: 95195
source_url: https://developer.work.weixin.qq.com/document/path/95195
---
最后更新：2022/06/23

企业同时授权了服务商的第三方应用与代开发应用，服务商可使用该接口将代开发应用获取到的external_userid转换为第三方应用的external_userid，从而进行关联映射。若代开发自建应用已升级（升级说明见 [代开发应用安全性升级](#39442)），则获取到的external_userid与第三方应用一致，故无须调用该接口。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/externalcontact/to_service_external_userid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "external_userid":"wmAAAAAAA"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 代开发自建应用的调用接口凭证 |
| external_userid | 是 | 代开发自建应用获取到的外部联系人ID |

**权限说明：**
>该企业授权了该服务商第三方应用,且授权的第三方应用具备“企业客户权限->客户基础信息”权限
>相应客户的跟进人至少有一个在应用可见范围内 或 相应客户所属客户群群主至少有一个在应用可见范围内
>应用需具备“企业客户权限->客户基础信息”权限

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "external_userid":"ooAAAAAAAAAAA"
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| external_userid |该服务商第三方应用下的企业的外部联系人ID|
