---
title: "关闭-Wi-Fi-模块"
path: "001-企业内部开发/003-客户端API/002-JS-SDK/018-Wi-Fi/003-关闭-Wi-Fi-模块"
specfusion_id: wecom_94f7db24bc42
source_url: "https://developer.work.weixin.qq.com/document/path/100542"
last_updated: "2026-07-26T06:37:06.360Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T09:23:25Z"
---
<!-- import stopWifi from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码
```javascript
wx.stopWifi({
 success: function(res) {
 console.log(res.errMsg)
 }
})
```
