---
title: "释放Rooms会议室"
path: "001-企业内部开发/002-服务端API/028-会议/008-Rooms会议室管理/002-释放Rooms会议室"
specfusion_id: wecom_617481ce2213
source_url: "https://developer.work.weixin.qq.com/document/path/98792"
last_updated: "2026-06-26T05:48:56.769Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:28:18Z"
---
**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/release?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meetingid": "MEETINGID",
  "meeting_room_id_list": ["RoomId001","RoomId002"]
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meetingid|是|string|会议ID|
|meeting_room_id_list|是|string[]|Rooms会议室 ID 列表|

**权限说明**
- 仅配置在“可调用接口的应用”列表中的自建应用可调用
- 仅允许操作该应用创建的会议

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
|errcode |int32| 返回码 |
|errmsg |string| 对返回码的文本描述内容 |
