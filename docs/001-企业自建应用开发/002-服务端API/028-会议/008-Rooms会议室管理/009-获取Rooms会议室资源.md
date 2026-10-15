---
title: "获取Rooms会议室资源"
path: "001-企业自建应用开发/002-服务端API/028-会议/008-Rooms会议室管理/009-获取Rooms会议室资源"
specfusion_id: wecom_ecab286a00e1
source_url: "https://developer.work.weixin.qq.com/document/path/98809"
last_updated: "2026-08-17T03:43:53.966Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
获取企业购买的Rooms会议室资源。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/get_inventory?access_token=ACCESS_TOKEN

**参数说明：**
|参数 |必须 |类型|说明 |
|:--|
|access_token |是 |string|调用接口凭证。获取方法查看“[获取access_token](https://work.weixin.qq.com/api/doc/90001/90143/90605)” |

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "normal_count":10,
  "special_count":2,
  "normal_used_count":2,
  "special_used_count":1,
  "normal_expired_count":0,
  "special_expired_count":0
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
|normal_count |uint32|普通设备数 |
|special_count |uint32|专款设备数 |
|normal_used_count |uint32|普通设备使用数 |
|special_used_count |uint32|专款设备使用数 |
|normal_expired_count |uint32|普通设备过期数 |
|special_expired_count |uint32|专款设备过期数 |
