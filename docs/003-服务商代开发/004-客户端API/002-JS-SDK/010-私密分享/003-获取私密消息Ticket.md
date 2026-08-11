---
title: "获取私密消息Ticket"
doc_id: 56727
category_id: 100338
source_url: https://developer.work.weixin.qq.com/document/path/100338
---
最后更新：2025/03/27

[[toc]]
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
