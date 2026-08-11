---
title: "成员UserId变更事件"
path: "004-智慧硬件开发/002-硬件直连接入/003-考勤-门禁设备/002-云端下发指令/002-成员UserId变更事件"
specfusion_id: wecom_968f8b22c188
source_url: "https://developer.work.weixin.qq.com/document/path/93997"
last_updated: "2026-02-12T18:03:51.235Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:19:45Z"
---
**指令包体：**

```
{
  "cmd" : "push_change_userid",
  "headers": 
  {
    "req_id" : "xxxx"
  },
  "body": 
  {
    "timestamp": 12345,
    "old_userid":"zhangsan",
    "new_userid":"lisi"
    "perm_version": 5,
    "user_type":0 
   }
}
```

**参数说明：**

| 参数名 | 类型 | 描述 |
| ------------ | ------ | ---------------------------------------- |
| req_id | string | 透传请求的req_id |
| cmd | string | 指令号，此处固定为push_change_userid |
| timestamp | Uint32 | Unix时间戳(秒) |
| old_userid | String | 变更前的成员id，长度为1-64个字节 |
| new_userid | String | 变更后的成员id，长度为1-64个字节 |
| user_type |Uint32 | 成员的类型： 0：企业员工 1：访客 2：学生 不填则默认值为0 |
| perm_version | Uint32 | 当前云端通讯录版本号，版本号严格递增（每次增加1），当推送版本号跟考勤机版本号之间出现空洞（\>=2）时，说明考勤机可能遗漏推送事件，考勤机应记录下来，选择一定的时间全量拉取通讯录。 |
