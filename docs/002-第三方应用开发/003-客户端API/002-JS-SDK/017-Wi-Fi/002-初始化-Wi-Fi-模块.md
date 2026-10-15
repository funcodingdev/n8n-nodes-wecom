---
title: "初始化 Wi-Fi 模块"
path: "002-第三方应用开发/003-客户端API/002-JS-SDK/017-Wi-Fi/002-初始化-Wi-Fi-模块"
specfusion_id: wecom_2a23d5e55dd6
source_url: "https://developer.work.weixin.qq.com/document/path/100626"
last_updated: "2026-07-26T07:36:24.488Z"
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
