---
title: "获取选人ticket对应的用户"
path: "002-第三方应用开发/002-服务端API/008-通讯录管理/002-成员管理/014-获取选人ticket对应的用户"
specfusion_id: wecom_dac865ebec66
source_url: "https://developer.work.weixin.qq.com/document/path/94894"
last_updated: "2026-02-12T17:14:39.981Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T07:49:58Z"
---
**请求方式：**POST（**HTTPS**）
**请求地址：**https://qyapi.weixin.qq.com/cgi-bin/user/list_selected_ticket_user?access_token=ACCESS_TOKEN

**请求包体：**

```
{
  "selected_ticket": "xxxx"
}
```
**参数说明：**

| 参数 | 必须 | 说明 |
| ------------ | ------------ | ------------ |
| access_token | 是 | 调用接口凭证 |
|selected_ticket|是|[选人jsapi返回的selectedTicket](#30288)|

**权限说明：**
仅支持切换[成员授权](#30245)模式的第三方应用可调用

**返回结果：**

```
{
  "errcode": 0,
  "errmsg": "ok",
  "operator_open_userid":"xxx",
  "open_userid_list":["xxxx","xxxx"],
  "unauth_open_userid_list":["yyyy", "yyy"],
  "total":10
}

```
**参数说明：**

| 参数 | 说明 |
| ------------ | ------------ |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
|operator_open_userid|选人用户的open_userid|
|open_userid_list|此次选人操作中，在应用可见范围内的open_userid列表|
|unauth_open_userid_list|此次选人操作中，不在应用可见范围内的open_userid列表|
|total|用户选择的总人数|
