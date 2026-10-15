---
title: "监听 Wi-Fi 连接成功"
path: "003-服务商代开发/004-客户端API/002-JS-SDK/018-Wi-Fi/007-监听-Wi-Fi-连接成功"
specfusion_id: wecom_27fd0a7663bb
source_url: "https://developer.work.weixin.qq.com/document/path/100415"
last_updated: "2026-07-26T08:37:40.894Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
[[toc]]

<!-- import onWifiConnected from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码
```javascript
wx.onWifiConnected(function(res) {
 console.log(res.wifi)
})
```
