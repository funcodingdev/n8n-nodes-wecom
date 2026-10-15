---
title: "监听 Wi-Fi 连接成功"
path: "001-企业自建应用开发/003-客户端API/002-JS-SDK/018-Wi-Fi/007-监听-Wi-Fi-连接成功"
specfusion_id: wecom_6cab68457644
source_url: "https://developer.work.weixin.qq.com/document/path/100546"
last_updated: "2026-08-17T04:16:45.183Z"
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
