---
title: "获取Rooms会议室详情"
doc_id: 47181
category_id: 98793
source_url: https://developer.work.weixin.qq.com/document/path/98793
---
最后更新：2024/07/22

根据Rooms会议室 ID 获取该Rooms会议室详细信息。

**请求方式：** POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/meeting/rooms/get_info?access_token=ACCESS_TOKEN
 
**请求包体：**
```
{
  "meeting_room_id": "RoomId001"
}
```

**参数说明：**
| 参数| 必须 | 类型|说明|
|:--|
| access_token | 是 | string|调用接口凭证。获取方法查看“[获取access_token](#15074)”|
|meeting_room_id|是|string|Rooms会议室 ID |

**权限说明**
- 仅配置在“可调用接口的应用”列表中的自建应用可调用

**返回结果：**
```
{
  "errcode": 0,
  "errmsg": "ok",
 "basic_info":{
 "rooms_id_list":[
 "200115200039985708"
 ],
 "meeting_room_name":"会议室测试1",
 "city":"广州",
 "building":"大厦",
 "floor":"10",
 "participant_number":3,
 "device":"ROOMS",
 "desc":"aGVsbG8=",
 "password":"MzMz"
 },
 "account_info":{
 "account_type":0,
 "valid_period":"-"
 },
 "hardware_info":{
 "factory":"",
 "device_model":"",
 "sn":"",
 "ip":"10.10.10.69",
 "mac":"a1:ee:27:c1:8a:1a",
 "rooms_version":"2.7.2.420",
 "firmware_version":"",
 "health_status":"ERROR",
 "system_type":"10.13.6",
 "meeting_room_status":1,
 "active_time":"2021-03-23 15:37:34",
 "cpu_info":"Intel(R) Core(TM) i7-7700K",
 "cpu_usage":"",
 "gpu_info":"",
 "net_type":"ethernet",
 "memory_info":"",
 "monitor_frequency":0,
 "camera_model":"FaceTime 高清摄像头（内建）",
 "enable_video_mirror":true,
 "microphone_info":"内建麦克风 ",
 "speaker_info":"内建输出"
 },
 "pmi_info":{
 "pmi_code":"12345678",
 "pmi_pwd":"XXXXXXX"
 },
 "monitor_status":0,
 "is_allow_call":true,
 "scheduled_status":1
}
```

**参数说明：**
|参数 |类型|说明 |
|:--|
|errcode |int32|返回码 |
|errmsg |string|对返回码的文本描述内容 |
|basic_info |object|Rooms会议室基本信息，详见BasicInfo |
|account_info |object|Rooms会议室账号信息，详见AccountInfo |
|hardware_info |object|Rooms会议室硬件信息，详见HardwareInfo |
|pmi_info |object|Rooms会议室PMI信息，详见PMIInfo |
|monitor_status |uint32|告警通知状态：<br>0：未开启<br>1：已开启 |
|is_allow_call |bool|是否允许被呼叫：<br>true：是<br>false：否 |
|scheduled_status |uint32|预定状态：<br>0：未开放预定<br>1：开放预定 |

**BasicInfo说明**
|参数 |类型|说明 |
|:--|
|rooms_id_list |string[]|Rooms会议室 ID 列表|
|meeting_room_name |string|Rooms会议室名称 |
|city |string|城市|
|building |string|建筑|
|floor |string|楼层|
|participant_number |uint32|容纳人数|
|device |string|Rooms会议室设备|
|desc |string|描述（base64）|
|password |string|管理员密码（base64）|

**AccountInfo说明**
|参数 |类型|说明 |
|:--|
|account_type |uint32|账号类型：<br>0：普通<br>1：专款<br>2：试用|
|valid_period |string|有效期限（普通账号有效期限即企业账号的有效期限，固定返回“-”） |

**HardwareInfo说明**
|参数 |类型|说明 |
|:--|
|factory |string|厂家|
|device_model |string|设备型号 |
|sn |string|序列号|
|ip |string|IP 地址|
|mac |string|MAC 地址|
|rooms_version |string|Rooms 版本|
|firmware_version |string|固件版本|
|health_status |string|健康状况|
|system_type |string|设备系统|
|meeting_room_status |uint32|Rooms会议室状态：<br>0：未激活<br>1：未绑定<br>2：空闲<br>3：使用中<br>4：离线|
|active_time |string|激活时间|
|cpu_info |string|CPU 信息 |
|cpu_usage |string|CPU 最大占用率|
|gpu_info |string|GPU 信息|
|net_type |string|网络类型|
|memory_info |string|内存信息|
|monitor_frequency |string|显示器刷新率|
|camera_model |string|摄像头型号|
|enable_video_mirror |bool|是否开启视频镜像|
|microphone_info |string|麦克风信息|
|speaker_info |string|扬声器信息|

**PMIInfo说明**
|参数 |类型|说明 |
|:--|
|pmi_code |string|Rooms会议室专属 ID|
|pmi_pwd |string|入会密码（base64） |
