---
title: "设备型号model_ticket推送事件"
doc_id: 40668
category_id: 96053
source_url: https://developer.work.weixin.qq.com/document/path/96053
---
最后更新：2022/08/19

企业微信服务器会定时（每十分钟）回调事件到厂商在设备型号详情中登记的回调URL。ticket会实时变更，并用于后续接口的调用。

**请求方式：**POST（**HTTPS**）
**请求地址：**https://127.0.0.1/suite/receive?msg_signature=3a7b08bb8e6dbce3c9671d6fdb69d15066227608&amp;timestamp=1403610513&amp;nonce=380320359

```
{
 "msg_type":"event",
 "base_info":{
 "req_id":"xxx",
 "createtime":1658332800,
 "model_id":"xxx",
 "service_corpid":"xxx"
 },
 "event":{
 "event_type":"model_ticket",
 "model_ticket":"xxx"
 }
}
```

**参数说明：**
 
| 参数名 | 类型 | 描述 |
| ------ | ------ | ---------------- |
| msg_type | string | 用于表示本消息是 事件event 还是指令 command，此处固定为event , 对应event数据有效 |
| event | 结构体 | 事件数据 |
| event_type | string | 事件类型，绑定设备到企业此处固定为 model_ticket |
| model_ticket | string | model_ticket 内容，最长为512字节 |
| base_info | 结构体 | 固定字段基础数据 |
| req_id | string | 请求req_id，可以用于排重 |
| createtime | uint32 | 事件触发时间戳（unix 时间戳 单位：秒）|
| model_id | string | 设备型号modelid |
| service_corpid | string | 硬件提供商企业corpid |

> 服务商的响应必须在1000ms内完成
