---
title: "获取 Wi-Fi 列表"
path: "003-服务商代开发/004-客户端API/002-JS-SDK/018-Wi-Fi/005-获取-Wi-Fi-列表"
specfusion_id: wecom_780d7f18b65b
source_url: "https://developer.work.weixin.qq.com/document/path/100413"
last_updated: "2026-07-26T08:37:40.894Z"
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
