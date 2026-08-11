---
title: "获取Rooms会议室下的会议列表"
doc_id: 47184
category_id: 98796
source_url: https://developer.work.weixin.qq.com/document/path/98796
---
最后更新：2024/07/22

获取指定Rooms会议室下的会议列表。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/list_meetings?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meeting_room_id": "MEETINGROOMID",
  "rooms_id": "ROOMSID",
  "start_time": 1679299200,
  "end_time": 1679558400,
  "cursor": "CURSOR",
  "limit": 20
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meeting_room_id|否|string|Rooms会议室 ID，与rooms_id二者填其一。|
|rooms_id|否|string|rooms 设备 rooms_id。与meeting_room_id二者填其一。|
|start_time|否|uint32|Unix 时间戳。查询起始时间，时间区间不超过90天|
|end_time|否|uint32|Unix 时间戳。查询结束时间，时间区间不超过90天|
|cursor|否|string|分页查询用，将上一个请求返回的next_cursor字段传入。第一次查询时可不传值|
|limit|否|uint32|分页大小，默认20条，最大20条|

>注意：
limit参数必须与首次调用获得cursor时传入的limit一致。

**权限说明**
- 仅配置在“可调用接口的应用”列表中的自建应用可调用
- 仅允许获取该应用创建的会议的数据

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
  "has_more": true,
  "next_cursor": "CURSOR",
  "meeting_info_list":[
    {
      "meetingid": "100001",
      "meeting_code": "14512",
      "subject": "周会",
      "status": "MEETING_STATE_STARTED",
      "meeting_type": 0,
      "start_time": 1679313600,
      "end_time": 1679317200
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
|meeting_info_list |object[]|会议对象列表，详见MeetingInfo |

**MeetingInfo说明**
|参数 |类型|说明 |
|:--|
|meetingid |string|会议 ID|
|meeting_code |string|有效会议 Code |
|subject |string|会议主题|
|status |string|会议状态：<br>MEETING_STATE_INVALID：非法或未知状态 <br>MEETING_STATE_INIT：待开始<br>MEETING_STATE_CANCELLED：已取消<br>MEETING_STATE_STARTED：进行中<br>MEETING_STATE_ENDED：已删除<br>MEETING_STATE_NULL：无状态（过了预定结束时间，会中无人）<br>MEETING_STATE_RECYCLED：已回收（过了预定开始时间30天，会议号被后台回收，无法再进入）|
|meeting_type |uint32|会议类型：<br>0：一次性会议。<br>1：周期性会议。<br>2：微信专属会议。<br>4：rooms 投屏会议。<br>5：个人会议号会议。<br>6：网络研讨会（Webinar）。|
|start_time |uint32|会议预订开始时间（Unix 秒）|
|end_time |uint32|会议预订结束时间（Unix 秒）|
