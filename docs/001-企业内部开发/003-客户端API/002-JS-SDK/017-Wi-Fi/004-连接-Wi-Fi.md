---
title: "连接 Wi-Fi"
doc_id: 45983
category_id: 100543
source_url: https://developer.work.weixin.qq.com/document/path/100543
---
最后更新：2024/11/13

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
