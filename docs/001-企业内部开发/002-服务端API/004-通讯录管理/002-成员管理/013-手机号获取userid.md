---
title: "手机号获取userid"
doc_id: 16820
category_id: 95402
source_url: https://developer.work.weixin.qq.com/document/path/95402
---
最后更新：2025/08/29

通过手机号获取其所对应的userid。

**请求方式：**POST（**HTTPS**）
**请求地址：**https://qyapi.weixin.qq.com/cgi-bin/user/getuserid?access_token=ACCESS_TOKEN

**请求包体：**

```
{
 "mobile": "13430388888"
}
```
**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ | ------------ |
| access_token | 是 | 调用接口凭证，授权企业的token（通过[获取企业凭证](#14944)获取）或上游获取的下游企业的token（通过[获取下级/下游企业的access_token](#24919 )获取）|
| mobile | 是 | 用户在企业微信通讯录中的手机号码。长度为5~32个字节 |

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
| userid | 成员UserID。对应管理端的账号，企业内必须唯一。不区分大小写，长度为1~64个字节。注意：第三方应用获取的值是密文的userid |

**更多说明：**
请确保手机号的正确性，若出错的次数超出企业人数上限的20%，会导致1天不可调用。
