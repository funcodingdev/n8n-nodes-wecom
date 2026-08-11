---
title: "获取已连接中的-Wi-Fi-信息"
path: "001-企业内部开发/003-客户端API/002-JS-SDK/018-Wi-Fi/008-获取已连接中的-Wi-Fi-信息"
specfusion_id: wecom_bfc4fcaa6435
source_url: "https://developer.work.weixin.qq.com/document/path/100547"
last_updated: "2026-07-26T06:37:06.360Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:38:34Z"
---
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
