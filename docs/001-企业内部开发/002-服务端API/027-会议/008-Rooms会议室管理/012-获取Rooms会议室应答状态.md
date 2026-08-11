---
title: "获取Rooms会议室应答状态"
doc_id: 47203
category_id: 98806
source_url: https://developer.work.weixin.qq.com/document/path/98806
---
最后更新：2024/07/22

会议获取其呼叫Rooms会议室的应答状态。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/get_response_status?access_token=ACCESS_TOKEN
 
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
|参数 |必须 |类型|说明 |
|:--|
|access_token |是 |string|调用接口凭证。获取方法查看“[获取access_token](https://work.weixin.qq.com/api/doc/90001/90143/90605)” |
|meetingid|是|string|会议 ID|
|meeting_room_id|否|string|Rooms会议室 ID，与 mra_address 二选一|
|mra_address|否|object|MRA 对象，详见MRA|

**MRA说明**
|参数 |类型|说明 |
|:--|
|protocol |uint32|信令协议。<br>1：SIP<br>2：H.323|
|dial_string |string|信令地址。<br>如果是 H.323 类型，输入 IP 地址或 E.164 号码。<br>如果是 SIP 类型，输入 IP 地址或 URI。|

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "status": 2,
  "response_time": "2022/11/22 14:35:26"
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
|status |uint32|应答状态：<br>0：无应答，60秒无回应<br>1：未呼叫<br>2：入会中<br>3：被拒绝<br>4：呼叫中<br>5：取消呼叫（仅 Rooms会议室有该状态）<br>6：已离会 |
|response_time |string|最近一次应答时间 |
