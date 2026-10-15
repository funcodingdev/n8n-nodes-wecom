---
title: "监听 Wi-Fi 列表更新"
path: "001-企业自建应用开发/003-客户端API/002-JS-SDK/018-Wi-Fi/006-监听-Wi-Fi-列表更新"
specfusion_id: wecom_16b3c2c3e278
source_url: "https://developer.work.weixin.qq.com/document/path/100545"
last_updated: "2026-08-17T04:16:45.183Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
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
