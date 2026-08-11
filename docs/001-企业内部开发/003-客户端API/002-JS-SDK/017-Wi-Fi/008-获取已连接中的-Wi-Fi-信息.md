---
title: "获取已连接中的 Wi-Fi 信息"
doc_id: 45987
category_id: 100547
source_url: https://developer.work.weixin.qq.com/document/path/100547
---
最后更新：2024/11/13

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
