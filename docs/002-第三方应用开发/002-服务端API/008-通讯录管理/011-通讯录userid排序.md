---
title: "通讯录userid排序"
doc_id: 19287
category_id: 92093
source_url: https://developer.work.weixin.qq.com/document/path/92093
---
最后更新：2022/09/05

**请求方式：**POST（**HTTPS**）
**请求地址：**https://qyapi.weixin.qq.com/cgi-bin/service/contact/sort?provider_access_token=ACCESS_TOKEN

**请求包体：**

```
{
  "auth_corpid":"wwxxxxxx",
  "useridlist":["zhangshan","lisi"],
  "sort_options":[
    {
      "sort_field": 0,
      "sort_type": 1
    },
    {
      "sort_field": 1,
      "sort_type": 0
    }
  ]
}

```
**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ | ------------ |
| provider_access_token | 是 | 应用提供商的provider_access_token，获取方法参见[服务商的凭证](#90001/90142/90593/服务商的token) |
| auth_corpid | 是 | 查询的企业corpid|
| useridlist | 是 | 要排序的userid列表，最多支持1000个|
| sort_options | 否| 排序选项列表。如果指定多个，将根据优先级排序。如示例参数，先根据姓名拼音降序排列，如果姓名拼音相同，再根据别名升序排列 |
| sort_options.sort_field | 否| 排序属性。0: 根据姓名拼音排序，1: 根据别名排序|
| sort_options.sort_type | 否| 排序方式。0: 升序排列，1: 降序排列 |
**权限说明：**

useridlist中的userid必须为该服务商授权通讯录权限范围内的用户

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "useridlist":["lisi","zhangshan"]
}
```
**参数说明：**

| 参数 | 说明 |
| ------------ | ------------ |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| useridlist | 排序后的userid列表 |
