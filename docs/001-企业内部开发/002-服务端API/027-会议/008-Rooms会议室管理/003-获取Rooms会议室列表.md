---
title: "获取Rooms会议室列表"
doc_id: 47183
category_id: 98795
source_url: https://developer.work.weixin.qq.com/document/path/98795
---
最后更新：2024/07/22

获取企业下的Rooms会议室列表。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/list?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meeting_room_name": "ROOMNAME",
  "cursor": "CURSOR",
  "limit": 50
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meeting_room_name|否|string|Rooms会议室名称（支持模糊匹配查找）|
|cursor|否|string|分页查询用，将上一个请求返回的next_cursor字段传入。第一次查询时可不传值|
|limit|否|uint32|分页大小，从1开始，最大50，默认20|

>注意：
limit参数必须与首次调用获得cursor时传入的limit一致。

**权限说明**
- 仅配置在“可调用接口的应用”列表中的自建应用可调用

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "has_more": true,
  "next_cursor": "CURSOR",
  "meeting_room_list":[
    {
      "meeting_room_id":"100001",
      "meeting_room_name":"会议室测试1",
      "meeting_room_location":"广州-大厦-10",
      "account_type":1,
      "active_code":"69MS2PKC",
      "participant_number":12,
      "meeting_room_status":1,
      "scheduled_status":0,
      "is_allow_call":true
    },
    {
      "meeting_room_id":"100002",
      "meeting_room_name":"会议室测试2",
      "meeting_room_location":"广州-大厦-11",
      "account_type":1,
      "active_code":"69MS2PKC",
      "participant_number":12,
      "meeting_room_status":1,
      "scheduled_status":0,
      "is_allow_call":true
    }
  ]
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
|has_more|bool|是否还有更多Rooms会议室列表|
|next_cursor|string|分页用，has_more为true时，下一次拉取列表将该字段填入cursor字段|
|meeting_room_list |object[]|Rooms会议室对象列表，详见MeetingRoom |

**MeetingRoom说明**
|参数 |类型|说明 |
|:--|
|meeting_room_id |string|Rooms会议室 ID|
|meeting_room_name |string|Rooms会议室名称 |
|meeting_room_location |string|Rooms会议室地址|
|account_type |uint32|账号类型：<br>0：普通<br>1：专款<br>2：试用|
|active_code |string|激活码|
|participant_number |uint32|容纳人数|
|meeting_room_status |uint32|Rooms会议室状态：<br>0：未激活<br>1：未绑定<br>2：空闲<br>3：使用中<br>4：离线|
|scheduled_status |uint32|预定状态：<br>0：未开放预定<br>1：开放预定|
|is_allow_call |bool|是否允许被呼叫：<br>true：是<br>false：否|
