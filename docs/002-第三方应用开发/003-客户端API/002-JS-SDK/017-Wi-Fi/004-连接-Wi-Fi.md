---
title: "连接 Wi-Fi"
path: "002-第三方应用开发/003-客户端API/002-JS-SDK/017-Wi-Fi/004-连接-Wi-Fi"
specfusion_id: wecom_60f007bfa7b7
source_url: "https://developer.work.weixin.qq.com/document/path/100628"
last_updated: "2026-07-26T07:36:24.488Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
[[toc]]

<!-- import connectWifi from @wecom/jssdk -->
## 旧版jweixin调用
### 示例代码
```javascript
wx.connectWifi({
 SSID: 'vincenthome', // 设备SSID
 BSSID: '8c:a6:df:c8:f7:4b', // 设备BSSID
 password: 'test1234', // 设备密码
 success: function(res) {
 console.log(res.errMsg)
 }
})
```
