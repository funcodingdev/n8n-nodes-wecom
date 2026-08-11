---
title: "监听 Wi-Fi 列表更新"
doc_id: 45985
category_id: 100414
source_url: https://developer.work.weixin.qq.com/document/path/100414
---
最后更新：2025/08/19

[[toc]]

<!-- import onGetWifiList from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码

```javascript
wx.onGetWifiList(function(res) {
 if (res.wifiList.length) {
 for(var i = 0; i < res.wifiList.length; i++)
 {
 console.log("=====wifiList======")
 console.log("SSID:" + res.wifiList[i].SSID)
 console.log("BSSID:" + res.wifiList[i].BSSID)
 console.log("secure:" + res.wifiList[i].secure)
 console.log("secure:" + res.wifiList[i].signalStrength)
 console.log("====================")
 }
 }
})
```
