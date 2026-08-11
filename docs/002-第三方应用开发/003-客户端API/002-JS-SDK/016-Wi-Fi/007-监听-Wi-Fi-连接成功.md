---
title: "监听 Wi-Fi 连接成功"
doc_id: 45986
category_id: 100631
source_url: https://developer.work.weixin.qq.com/document/path/100631
---
最后更新：2024/11/13

[[toc]]

<!-- import onWifiConnected from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码
```javascript
wx.onWifiConnected(function(res) {
 console.log(res.wifi)
})
```
