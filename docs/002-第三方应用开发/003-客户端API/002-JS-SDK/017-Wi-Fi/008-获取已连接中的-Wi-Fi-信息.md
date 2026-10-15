---
title: "获取已连接中的 Wi-Fi 信息"
path: "002-第三方应用开发/003-客户端API/002-JS-SDK/017-Wi-Fi/008-获取已连接中的-Wi-Fi-信息"
specfusion_id: wecom_9bbbef54dd52
source_url: "https://developer.work.weixin.qq.com/document/path/100632"
last_updated: "2026-07-26T07:36:24.488Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
[[toc]]

<!-- import getConnectedWifi from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码
```javascript
wx.getConnectedWifi({
 success: function(res){
 console.log(res.wifi)
 }
})
```
