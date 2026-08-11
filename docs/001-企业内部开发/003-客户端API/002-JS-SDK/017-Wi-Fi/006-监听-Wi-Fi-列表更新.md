---
title: "监听-Wi-Fi-列表更新"
path: "001-企业内部开发/003-客户端API/002-JS-SDK/018-Wi-Fi/006-监听-Wi-Fi-列表更新"
specfusion_id: wecom_0fe7784a98ed
source_url: "https://developer.work.weixin.qq.com/document/path/100545"
last_updated: "2026-07-26T06:37:06.360Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:38:30Z"
---
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
