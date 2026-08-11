---
title: "获取UserId的变更信息"
path: "004-智慧硬件开发/002-硬件直连接入/003-考勤-门禁设备/001-接口调用/004-获取UserId的变更信息"
specfusion_id: wecom_fe082ce8576b
source_url: "https://developer.work.weixin.qq.com/document/path/91586"
last_updated: "2026-02-12T18:03:13.110Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:19:29Z"
---
**请求包体：**
```
{
   "cmd":"get_notify_history",
   "headers":
  {
    "req_id":"xxxxx"
  },
  "body":
  {
    "perm_version": 0,
    "offset": 1,
    "limit": 1
  }

}
```

**参数说明：**
 
| 参数名 | 是否必须 | 类型 | 描述 |
| ---------------- | ---- | ---------- | ---------------------------------------- |
| req_id | 是 | String | 请求的id，自行保证不会重复即可 |
| perm_version| 否| Uint32 | 版本号，填写该参数时返回结果仅包含大于该版本的历史推送，版本号可以从0开始|
| offset| 是| Uint32 | 分页，偏移量|
| limit | 否| Uint32 | 分页，每页记录数的大小|

**返回结果：**
```
{
  "headers": {
    "req_id": "xxxx"
  },
  "body":{
    "is_last": true,
    "item":
    [
      {"data":"xxxxx", "perm_version":1},
      {"data":"xxxxx", "perm_version":2}
    ]
  },
  "errcode": 0,
  "errmsg": "ok"
}
```

**参数说明：**
 
| 参数名 | 类型 | 描述 |
| ---------------- | ---- | ---------------------------------------- |
| req_id | String | 透传请求的req_id |
| is_last | bool | 是否最后一页 |
| item | array | 返回的结果数组 |
| data| string | 具体推送的数据 |
| perm_version | uint32 | 该条推送对应的版本号 |
| errcode | Uint32 | 错误码|
| errmsg | String | 错误描述|
