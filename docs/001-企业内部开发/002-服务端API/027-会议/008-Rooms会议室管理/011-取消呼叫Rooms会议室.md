---
title: "取消呼叫Rooms会议室"
doc_id: 47202
category_id: 98805
source_url: https://developer.work.weixin.qq.com/document/path/98805
---
最后更新：2023/05/30

会议可以通过Rooms会议室 ID 进行取消呼叫操作。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/cancel_call?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meetingid": "MEETINGID",
  "invite_id": "INVITEID",
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
|invite_id|是|string|呼叫 ID|
|meeting_room_id|否|string|Rooms会议室 ID，与 mra_address 二选一|
|mra_address|否|object|MRA 对象，详见MRA|

**MRA说明**
|参数 |必须|类型|说明 |
|:--|
|protocol |是|uint32|信令协议。<br>1：SIP<br>2：H.323|
|dial_string |是|string|信令地址。<br>如果是 H.323 类型，输入 IP 地址或 E.164 号码。<br>如果是 SIP 类型，输入 IP 地址或 URI。|

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok"
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
