---
title: "初始化 Wi-Fi 模块"
path: "003-服务商代开发/004-客户端API/002-JS-SDK/018-Wi-Fi/002-初始化-Wi-Fi-模块"
specfusion_id: wecom_689960d630fe
source_url: "https://developer.work.weixin.qq.com/document/path/100410"
last_updated: "2026-07-26T08:36:13.439Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
[[toc]]

<!-- import startWifi from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码
```javascript
wx.startWifi({
 success: function(res) {
 console.log(res.errMsg)
 }
})
```
