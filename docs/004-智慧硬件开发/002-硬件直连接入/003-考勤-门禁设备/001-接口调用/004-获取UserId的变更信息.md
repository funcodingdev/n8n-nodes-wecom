---
title: "获取UserId的变更信息"
doc_id: 16447
category_id: 91586
source_url: https://developer.work.weixin.qq.com/document/path/91586
---
最后更新：2022/09/16

获取该设备历史的云端通知。目前仅保存3个月的[userid变更事件](#15377)。

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
