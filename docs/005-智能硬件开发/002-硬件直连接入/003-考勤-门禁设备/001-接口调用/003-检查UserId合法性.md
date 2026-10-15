---
title: "检查UserId合法性"
path: "005-智能硬件开发/002-硬件直连接入/003-考勤-门禁设备/001-接口调用/003-检查UserId合法性"
specfusion_id: wecom_5b9a0ee39442
source_url: "https://developer.work.weixin.qq.com/document/path/93991"
last_updated: "2026-08-17T07:38:30.652Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
检查userid是否在设备的使用范围内

**请求包体：**
```
{
  "cmd":"check_userid",
  "headers":
  {
    "req_id":"xxxxx"
  },
  "body":
  {
    "userid": ["zhangsan", "lisi", "wangwu"], //老版本用
    "userid_item": [ //新版本用
      { "userid":"zhangsan", "user_type":0 },
      { "userid":"lisi", "user_type":2 }
    ]
  }

}
```

**参数说明：**
 
| 参数名 | 是否必须 | 类型 | 描述 |
| ---------------- | ---- | ---------- | ---------------------------------------- |
| req_id | 是 | String | 请求的id，自行保证不会重复即可 |
| userid| 老版本是| array | 员工id，单次请求最多200个 |
|userid_item|新版本是 | array(object) |userid、user_type数据结构，成员的类型： 0：企业员工 1：访客 2：学生 不填默认为0|

**返回结果：**
```
{
  "headers": {
    "req_id": "xxxx"
  },
  "body":{
    //老版本用
    "legal_userid":["zhangsan"],
    "illegal_userid":["lisi", "wangwu"]
    //新版本用
    "legal_userid_item":[
      { "userid":"zhangsan" , "user_type":0 }, 
      { "userid":"lisi" , "user_type":2 }],
 "illegal_userid_item":[
      { "userid":"zhangsan" , "user_type":0 }, 
      { "userid":"lisi" , "user_type":2 }]
  },
  "errcode": 0,
  "errmsg": "ok"
}
```

**参数说明：**
 
| 参数名 | 类型 | 描述 |
| ---------------- | ---- | ---------------------------------------- |
| req_id | String | 透传请求的req_id |
| legal_userid | array | 合法的userid列表 |
| illegal_userid | array | 不合法的userid列表 |
|userid_item |array(object) |userid、user_type数据结构，成员的类型： 0：企业员工 1：访客 2：学生 不填默认为0|
