---
title: "Wi-Fi-概述"
doc_id: 14918
category_id: 100625
source_url: https://developer.work.weixin.qq.com/document/path/100625
---
最后更新：2024/11/20

[[toc]]
支持搜索周边的 Wi-Fi，同时可以针对指定 Wi-Fi，传入密码发起连接。
该系列接口为系统原生能力。

## 调用时序
连接指定 Wi-Fi 接口调用时序：

  Android：startWifi —> connectWifi —> onWifiConnected
  iOS（仅iOS 11及以上版本支持）：startWifi —> connectWifi —> onWifiConnected

连周边 Wi-Fi 接口调用时序：

  Android：startWifi —> getWifiList —> onGetWifiList —> connectWifi —> onWifiConnected
  iOS（iOS 11.0及11.1版本因系统原因暂不支持）：startWifi —> getWifiList —> onGetWifiList —> setWifiList —> onWifiConnected

## 注意事项
> Wi-Fi 相关接口暂不可用 wx.canIUse 接口判断。
> Wi-Fi接口仅企业微信andriod 2.4.16版本及以上支持，微信端不支持（微信开发者工具也不支持）
> Android 6.0 以上版本，在没有打开定位开关的时候会导致设备不能正常获取周边的 Wi-Fi 信息。

## Wi-Fi接口错误码列表

| 错误码 | 错误码说明 |
| --- | --- |
| 0 | 正常 |
| 12000 | 未先调用startWifi接口 |
| 12001 | 当前系统不支持相关能力 |
| 12002 | Wi-Fi 密码错误 |
| 12003 | 连接超时 |
| 12004 | 重复连接 Wi-Fi |
| 12005 | Android特有，未打开 Wi-Fi 开关 |
| 12006 | Android特有，未打开 GPS 定位开关 |
| 12007 | 用户拒绝授权连接 Wi-Fi |
| 12008 | 无效SSID |
| 12009 | 系统运营商配置拒绝连接 Wi-Fi |
| 12010 | 系统其他错误，需要在errmsg打印具体的错误原因 |
| 12011 | 应用在后台无法配置 Wi-Fi |
