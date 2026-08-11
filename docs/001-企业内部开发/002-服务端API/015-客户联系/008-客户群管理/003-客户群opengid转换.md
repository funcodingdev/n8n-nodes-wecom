---
title: "客户群opengid转换"
path: "001-企业内部开发/002-服务端API/015-客户联系/008-客户群管理/003-客户群opengid转换"
specfusion_id: wecom_b9b363f31192
source_url: "https://developer.work.weixin.qq.com/document/path/94822"
last_updated: "2026-02-12T16:38:20.313Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T07:33:11Z"
---
**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/externalcontact/opengid_to_chatid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "opengid":"oAAAAAAA"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 调用接口凭证 |
| opengid | 是 | 小程序在微信获取到的群ID，参见[wx.getGroupEnterInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/group/wx.getGroupEnterInfo.html) |

**权限说明：**
- 企业需要使用配置到“[可调用应用](#13473/开始开发)”列表中的自建应用secret所获取的accesstoken来调用（[accesstoken如何获取？](#10013/第三步：获取access_token)）
- 第三方应用需具有“企业客户权限->客户基础信息”权限
- 对于第三方/自建应用，群主必须在应用的可见范围
- 仅支持企业服务人员创建的客户群
- 仅可转换出自己企业下的客户群chat_id

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "chat_id":"ooAAAAAAAAAAA"
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| chat_id |客户群ID，可以用来调用[获取客户群详情](#19412)|
