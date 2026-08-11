---
title: "邮箱获取userid"
doc_id: 39794
category_id: 96268
source_url: https://developer.work.weixin.qq.com/document/path/96268
---
最后更新：2025/08/29

通过邮箱获取其所对应的userid。

**请求方式：**POST（**HTTPS**）
**请求地址：**https://qyapi.weixin.qq.com/cgi-bin/user/get_userid_by_email?access_token=ACCESS_TOKEN

**请求包体：**

```
{
 "email":"12345@qq.com",
 "email_type":1
}
```
**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ | ------------ |
| access_token | 是 | 调用接口凭证，授权企业的token（通过[获取企业凭证](#14944)获取）或上游获取的下游企业的token（通过[获取下级/下游企业的access_token](#24919 )获取）|
| email | 是 | 邮箱 |
| email_type| 否 | 邮箱类型：1-企业邮箱（默认）；2-个人邮箱 |

**权限说明：**

应用须拥有指定成员的查看权限。

**返回结果：**

```
{
  "errcode": 0,
  "errmsg": "ok",
  "userid": "zhangsan"
}

```
**参数说明：**

| 参数 | 说明 |
| ------------ | ------------ |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| userid | 成员UserID。注意：已升级openid的代开发或第三方，获取的是密文userid|

**更多说明：**
请确保邮箱的正确性，若出错的次数超过企业人数上限的20%，会导致1天不可调用。
