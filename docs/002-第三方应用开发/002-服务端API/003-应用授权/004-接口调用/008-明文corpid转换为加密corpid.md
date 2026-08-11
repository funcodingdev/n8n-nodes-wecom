---
title: "明文corpid转换为加密corpid"
doc_id: 37921
category_id: 95604
source_url: https://developer.work.weixin.qq.com/document/path/95604
---
最后更新：2022/03/22

为更好地保护企业与用户的数据，第三方应用获取的corpid不再是明文的corpid，将升级为第三方服务商级别的加密corpid（[了解更多](#35863)）。第三方可以将已有的明文corpid转换为第三方的加密corpid。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/service/corpid_to_opencorpid?provider_access_token=ACCESS_TOKEN 

**请求参数：**
```
{
 "corpid":"xxxxx"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| provider_access_token | 是 | 应用服务商的provider_access_token，获取方法参见[服务商的凭证](#15143 ) |
| corpid | 是 | 待获取的企业ID |

**权限说明：**
>仅限第三方服务商，转换已获授权企业的corpid

**返回结果：**

```
｛
 "errcode":0,
 "errmsg":"ok",
 "open_corpid":"AAAAAA"
｝
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| open_corpid |该服务商第三方应用下的企业ID|
