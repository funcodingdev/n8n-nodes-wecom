---
title: "初始化 Wi-Fi 模块"
doc_id: 45981
category_id: 100410
source_url: https://developer.work.weixin.qq.com/document/path/100410
---
最后更新：2024/11/13

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
