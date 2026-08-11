---
title: "代开发授权应用access_token的获取"
doc_id: 42543
category_id: 97164
source_url: https://developer.work.weixin.qq.com/document/path/97164
---
最后更新：2022/10/19

获取[代开发应用的secret](#42542)之后，接口调用凭证access_token的获取方式与自建应用完全一致，即调用的是[获取access_token](#15074)接口。

::: tip
注意，这与第三方应用的access_token获取方式不一样。
:::

>1. 代开发应用模板的服务部署在第三方服务商的云端，故secret的获取与第三方应用获取企业永久授权码类似，第三方服务商可以实现自动化获取。
>2. 一旦服务商获取到secret，则可以将secret部署到企业的私有云，完成企业应用的定制化，故access_token的获取方式与企业自建应用相同。

**请求方式：** GET（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ID&corpsecret=SECRET

::: tip
此处标注大写的单词 ID 和 SECRET，为需要替换的变量，根据实际获取值更新。其它接口也采用相同的标注，不再说明。
:::

**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ | ------------ |
| corpid | 是 | 企业ID，获取方式参考：[术语说明-corpid](#14953/corpid) |
| corpsecret | 是 | 应用的凭证密钥，获取方式参考[代开发应用的secret](#42542) |

**权限说明：**
每个应用有独立的secret，获取到的access_token只能本应用使用，所以每个应用的access\_token应该分开来获取

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "access_token": "accesstoken000001",
 "expires_in": 7200
}
```
**参数说明：**

| 参数 | 说明 |
| --- | --- |
| errcode | 出错返回码，为0表示成功，非0表示调用失败 |
| errmsg | 返回码提示语 |
| access_token | 获取到的凭证，最长为512字节 |
| expires_in | 凭证的有效时间（秒） |

**注意事项：**

开发者需要缓存access_token，用于后续接口的调用（注意：不能频繁调用gettoken接口，否则会受到频率拦截）。当access_token失效或过期时，需要重新获取。

access_token的有效期通过返回的expires_in来传达，正常情况下为7200秒（2小时），有效期内重复获取返回相同结果，过期后获取会返回新的access_token。
由于企业微信每个应用的access_token是彼此独立的，所以进行缓存时需要区分应用来进行存储。
access_token至少保留512字节的存储空间。
企业微信可能会出于运营需要，提前使access_token失效，开发者应实现access_token失效时重新获取的逻辑。

::: warning 
为了安全考虑，开发者 **请勿** 将 access_token 返回给前端，需要开发者保存在后台，所有访问企业微信api的请求由后台发起
:::
