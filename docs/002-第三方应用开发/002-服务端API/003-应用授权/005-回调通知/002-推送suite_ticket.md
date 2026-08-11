---
title: "推送suite_ticket"
doc_id: 14947
category_id: 90628
source_url: https://developer.work.weixin.qq.com/document/path/90628
---
最后更新：2024/01/09

企业微信服务器会定时（每十分钟）向指令回调url推送ticket，suite_ticket实际有效期为30分钟，ticket会实时变更，并用于后续接口的调用。
> 若开发者想立即获得ticket推送值，可登录<a href="https://open.work.weixin.qq.com/wwopen/developer" target="_blank">服务商平台</a>，在第三方应用详情-回调配置，手动刷新ticket推送。

**请求方式：**POST（**HTTPS**）
**请求地址：**https://127.0.0.1/suite/receive?msg_signature=3a7b08bb8e6dbce3c9671d6fdb69d15066227608&amp;timestamp=1403610513&amp;nonce=380320359

**请求包体：**
xml请求示例：
```
<xml>
<SuiteId><
- ![CDATA[ww4asffe99e54c0fxxxx]]></SuiteId>
<InfoType> <
- ![CDATA[suite_ticket]]></InfoType>
<TimeStamp>1403610513</TimeStamp>
<SuiteTicket><
- ![CDATA[asdfasfdasdfasdf]]></SuiteTicket>
</xml>
```

**参数说明：**

 | 参数 | 说明 |
 |---- | ----- |
 |SuiteId | 第三方应用的SuiteId或者代开发应用模板id |
 |InfoType | suite_ticket |
 |TimeStamp | 时间戳 |
 |SuiteTicket | Ticket内容，最长为512字节 |
