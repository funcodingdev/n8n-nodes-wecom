---
title: "预定Rooms会议室"
doc_id: 47179
category_id: 98791
source_url: https://developer.work.weixin.qq.com/document/path/98791
---
最后更新：2023/05/30

对成功预定的会议添加Rooms会议室，支持为同一个会议预定多个Rooms会议室。
Rooms会议室预定对会议时长有硬性要求，会议时长不得大于24小时，且不支持周期性会议。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/book?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meetingid": "MEETINGID",
  "meeting_room_id_list": ["RoomId001","RoomId002"],
  "subject_visible": true
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meetingid|是|string|会议ID|
|meeting_room_id_list|是|string[]|Rooms会议室 ID 列表|
|subject_visible|否|bool|在会议开始前的一小时内，是否在 Room 上显示会议主题， 默认值为 true。<br>true：显示<br>false：不显示。<br>说明：该参数并不影响预定时间晚过当前时间一个小时以上的会议。超过一小时的会议默认不显示会议主题。|

**权限说明**
- 仅配置在“可调用接口的应用”列表中的自建应用可调用
- 仅允许操作该应用创建的会议

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "meeting_room_list":[
    {
      "meeting_room_id":"100001",
      "meeting_room_name":"会议室测试1",
      "meeting_room_location":"广州-大厦-10"
    },
    {
      "meeting_room_id":"100002",
      "meeting_room_name":"会议室测试2",
      "meeting_room_location":"广州-大厦-11"
    }
  ]
}
```

**参数说明：**
|参数 |类型| 说明 |
|:--|
|errcode |int32| 返回码 |
|errmsg |string| 对返回码的文本描述内容 |
|meeting_room_list |object[]|Rooms会议室对象列表，详见MeetingRoom |

**MeetingRoom说明**
|参数 |类型| 说明 |
|:--|
|meeting_room_id |string| Rooms会议室 ID|
|meeting_room_name |string| Rooms会议室名称 |
|meeting_room_location |string| Rooms会议室地址|
