---
title: "userid与openid互换"
doc_id: 11279
category_id: 90202
source_url: https://developer.work.weixin.qq.com/document/path/90202
---
最后更新：2022/01/20

## userid转openid
该接口使用场景为企业支付，在使用企业红包和向员工付款时，需要自行将企业微信的userid转成openid。

注：需要成员使用微信登录企业微信或者关注微信插件（原企业号）才能转成openid;
如果是外部联系人，请使用[外部联系人openid转换](#18820)转换openid

**请求方式：**POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=ACCESS_TOKEN

**请求示例：**

```
{
 "userid": "zhangsan"
}
```
**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ |
| access_token | 是 | 调用接口凭证 |
| userid| 是 |企业内的成员id|

**权限说明：**
成员必须处于应用的可见范围内

**返回结果 ：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "openid": "oDjGHs-1yCnGrRovBj2yHij5JAAA"
}
```
**参数说明 ：**

| 参数 |说明 |
| ------------ | ------------ |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| openid | 企业微信成员userid对应的openid |

## openid转userid
该接口主要应用于使用企业支付之后的结果查询。
开发者需要知道某个结果事件的openid对应企业微信内成员的信息时，可以通过调用该接口进行转换查询。

**请求方式：**POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_userid?access_token=ACCESS_TOKEN

**请求示例：**

```
{
 "openid": "oDjGHs-1yCnGrRovBj2yHij5JAAA"
}
```
**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ |
| access_token | 是 | 调用接口凭证 |
| openid| 是 |在使用企业支付之后，返回结果的openid|

**权限说明：**
管理组需对openid对应的企业微信成员有查看权限。

**返回结果 ：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "userid": "zhangsan"
}
```
**参数说明 ：**

| 参数 |说明 |
| ------------ | ------------ |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| userid |   该openid在企业微信对应的成员userid |
