---
title: "获取Rooms会议室配置项"
doc_id: 47197
category_id: 98802
source_url: https://developer.work.weixin.qq.com/document/path/98802
---
最后更新：2023/05/30

获取Rooms会议室的配置项。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/get_config?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meeting_room_id": "ROOMID"
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meeting_room_id|是|string|Rooms会议室 ID|

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "meeting_settings": {
    "water_mark":2,
    "auto_response":1,
    "caption":true,
    "room_pmi":true,
    "room_notification":true
  },
  "record_settings":{
    "share_record":0,
    "download_record":true
  }
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
|meeting_settings|object|Rooms会议室会议配置对象，详见MeetingSettings|
|record_settings|object|Rooms会议室录制配置对象，详见RecordSettings|

**MeetingSettings说明**
|参数 |类型|说明 |
|:--|
|water_mark |uint32|水印。<br>0：关闭<br>1：单排水印<br>2：多排水印|
|auto_response |uint32|自动接听。<br>1：开启<br>2：关闭|
|caption |bool|字幕。<br>true：开启<br>false：关闭|
|room_pmi |bool|专属 ID。<br>true：开启<br>false：关闭|
|room_notification |bool|Rooms 屏幕是否展示消息通知。<br>true：开启<br>false：不开启|

**RecordSettings说明**
|参数 |类型|说明 |
|:--|
|share_record |uint32|分享云录制。<br>0：关闭分享<br>1：全部成员可查看<br>2：仅登录成员可查看<br>3：仅同企业成员可查看<br>4：仅参会成员可查看|
|download_record |bool|是否允许下载云录制。<br>true：开启<br>false：关闭|
