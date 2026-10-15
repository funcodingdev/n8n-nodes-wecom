---
title: "onNFCReadMessage"
path: "003-服务商代开发/004-客户端API/001-小程序/010-NFC接口/004-onNFCReadMessage"
specfusion_id: wecom_829ba17587e8
source_url: "https://developer.work.weixin.qq.com/document/path/96986"
last_updated: "2026-07-26T08:28:54.613Z"
calibrated_from: "SpecFusion"
synced_at: "2026-10-15T15:24:46Z"
---
### onNFCReadMessage(function callback)

监听NFC设备的消息回调。当用户离开小程序后，此接口无效。

#### 参数

##### function callback

NFC设备有事件时的回调函数

###### object.success 回调函数
**参数**

**Object res**

| 属性 | 类型 | 说明 | 支持版本 |
| ----------------- | ------ | -------------- | ---- |
| messageType | number | 消息类型 | |
| data.hex | string | 十六进制 id 序列 | |
| data.reversed_hex | string | 字节反转十六进制 id 序列 | |
| data.dec | number | 十进制 id 数值 | |
| data.reversed_dec | number | 字节反转十进制 id 数值 | |

**res.messageType 的合法值**

| 值 | 说明 |
| ---- | ------------------------ |
| 1 | 小程序在前台，当检测到 NFC 标签时回调 |
| 2 | 小程序退到后台，当用户不可见时，自动停止 NFC |

#### 示例代码：

```js
Page({
 onNFCReadMessage: function (e) {
 console.log(JSON.stringify(e))
 if (1 == e.messageType) {
 wx.showModal({
 title: 'NFC-Id',
 content: JSON.stringify(e),
 })
 } else if (2 == e.messageType) {
 console.log('Auto-Stop')
 wx.showModal({
 title: 'NFC-Auto-Stop',
 content: JSON.stringify(e),
 })
 }
 }
})

```
