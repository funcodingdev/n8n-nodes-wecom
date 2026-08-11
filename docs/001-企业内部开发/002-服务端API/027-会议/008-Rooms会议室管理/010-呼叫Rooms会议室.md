---
title: "呼叫Rooms会议室"
path: "001-企业内部开发/002-服务端API/028-会议/008-Rooms会议室管理/010-呼叫Rooms会议室"
specfusion_id: wecom_c27a9519ba87
source_url: "https://developer.work.weixin.qq.com/document/path/98804"
last_updated: "2026-06-26T05:50:29.703Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:28:32Z"
---
**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/call?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meetingid": "MEETINGID",
  "meeting_room_id": "ROOMID",
  "mra_address": {
    "protocol": 2,
    "dial_string": "xxx"
  }
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meetingid|是|string|会议 ID|
|meeting_room_id|否|string|Rooms会议室 ID，与 mra_address 二选一|
|mra_address|否|object|MRA 对象，详见MRA|

**MRA说明**
|参数 |必须|类型|说明 |
|:--|
|protocol |是|uint32|信令协议。<br>1：SIP<br>2：H.323|
|dial_string |是|string|信令地址。<br>如果是 H.323 类型，输入 IP 地址或 E.164 号码。<br>如果是 SIP 类型，输入 IP 地址或 URI。|

**权限说明**
- 仅配置在“可调用接口的应用”列表中的自建应用可调用
- 仅允许操作该应用创建的会议的数据

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "invite_id": "INVITEID" 
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
|invite_id|string|呼叫 ID|
