---
title: "获取SecretNo"
doc_id: 15350
category_id: 91369
source_url: https://developer.work.weixin.qq.com/document/path/91369
---
最后更新：2020/09/27

部分设备希望在生产时烧录同一个SecretNo以降低生产成本，管理员可在服务商管理端添加设备时勾选“该型号设备使用同一个初始SecretNo”（如下图），**勾选此选项后，此型号下登记sn得到均为seedSecreteNo(初始secretNo)，此类型的secretNo仅可应用于“获取SecretNo(get_secret_no)”接口来将统一的seedSecretNo换为每个设备独立的SecretNo**，成功换取之后设备可通过新得到的secretNo发起“注册网络”请求。
<center>
- ![](http://p.qpic.cn/pic_wework/920237496/0204db0df5eedf562f711460aab8b70c042106837af4c1bf/0)
</center>

**请求包体**：
```
{
 "cmd":"get_secret_no",
 "headers":
 {
 "req_id":"xxxxx"
 },
 "body":
 {
 "device_signature":"xxxxx",
 "nonce":123451,
 "timestamp":1231231,
 "sn":"xxxxx"
 }
}
```
 **参数说明:**

| 参数名 | 是否必须 | 描述 |
| ---------------- | ---- | ---------------------------------------- |
| req_id | 是 | 请求的id，自行保证不会重复即可 |
| device_signature | 是 | 设备签名，sha1(sort(sn、seedSecretNo、timestamp、nonce, “secret_no”))。sort的含义是将参数值按照字母字典排序，然后从小到大拼接成一个字符串。seedSecretNo是由企业微信为这一批设备统一生成的密钥，供应商可将其固化到设备上。本接口计算签名时，需要把字符串常量 "secret_no"参与到计算之中，区别其他场景的签名。 |
| nonce | 是 | 随机数 |
| timestamp | 是 | 时间戳, 5分钟有效期 |
| sn | 是 | 设备序列号 |

 **返回结果：**
 
```
{
 "headers": 
 {
     "req_id" : "xxxx"
  },
 "body":
 {
     "secret_no" : "xxxx"
 }
 "errcode": 0,
 "errmsg": "ok"
}
```

 **参数说明:**
 
| 参数名 | 描述 |
| --------- | ------------- |
| req_id | 透传请求的req_id |
| errcode | 错误码 |
| errmsg | 错误码描述 |
| secret_no | 该设备的secret_no |

>这里返回的secret_no可用于注册网络
当设备完成网络注册（获取到激活码）以后，不可再调用。

**通过初始SecretNo换取SecretNo的流程如下图所示:**
- ![](http://p.qpic.cn/pic_wework/1666352793/dddb07d2d71c13edf66eb0f33fe60a6690a001a7a7280e5f/0)
