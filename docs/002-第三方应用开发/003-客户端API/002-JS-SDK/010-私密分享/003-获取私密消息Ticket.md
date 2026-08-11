---
title: "获取私密消息Ticket"
path: "001-企业内部开发/003-客户端API/002-JS-SDK/011-私密分享/003-获取私密消息Ticket"
specfusion_id: wecom_1bc117a99765
source_url: "https://developer.work.weixin.qq.com/document/path/100509"
last_updated: "2026-07-26T06:34:16.927Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:58:53Z"
---
<!-- import getContext from @wecom/jssdk -->
## 旧版jweixin调用
### 示例代码
```
wx.invoke('getContext', {
 }, function(res){
 if(res.err_msg == "getContext:ok"){
 entry = res.entry ; //返回进入H5页面的入口类型，目前有normal、contact_profile、single_chat_tools、group_chat_tools、chat_attachment
 shareTicket = res.shareTicket; //可用于调用getShareInfo接口
 }else {
 //错误处理
 }
 });
```
