---
title: "获取 Wi-Fi 列表"
path: "001-企业自建应用开发/003-客户端API/002-JS-SDK/018-Wi-Fi/005-获取-Wi-Fi-列表"
specfusion_id: wecom_5880dc1c13ea
source_url: "https://developer.work.weixin.qq.com/document/path/100544"
last_updated: "2026-08-17T04:16:45.183Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
[[toc]]
<!-- import getWifiList from @wecom/jssdk -->
## 旧版jweixin调用
### 示例代码
```javascript
wx.getWifiList({
 success: function(res) {
 console.log(res.errMsg)
 }
})
```
