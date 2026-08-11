---
title: "返回ticket的选人接口"
path: "002-第三方应用开发/003-客户端API/002-JS-SDK/005-企业通讯录/004-返回ticket的选人接口"
specfusion_id: wecom_98e66273f80e
source_url: "https://developer.work.weixin.qq.com/document/path/94516"
last_updated: "2026-02-12T17:31:29.653Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T08:00:50Z"
---
<!-- import selectPrivilegedContact from @wecom/jssdk -->

## 旧版jweixin调用
### 示例代码
```
wx.invoke("selectPrivilegedContact", {
        "fromDepartmentId": -1,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
        "mode": "multi",// 必填，选择模式，single表示单选，multi表示多选
        "selectedContextContact": 1  // 是否勾选当前环境的参与者。例如在群+号聊天附件栏打开，默认勾选当前群成员。
        "selectedOpenUserIds"["xxx","yyy"], // 非必填，已选用户OpenID列表。single模式忽略该参数。
        "selectedTickets"["ticket1","ticket2"] // 非必填，已选ticket列表。single模式忽略该参数
 },function(res){
 if (res.err_msg == "selectPrivilegedContact:ok")
 {
 var selectedUserList = res.result.userList; // 已选的成员列表
 for (var i = 0; i < selectedUserList.length; i++)
 {
 var openUserId = selectedUserList[i].openUserId; //成员openUserId
 }
 var selectedTicket = res.result.selectedTicket;  // 已选的集合Ticket
 var expiresIn = res.result.expiresIn;  // ticket有效期
 var selectedUserCount = res.result.selectedUserCount;  // 用户选中的用户个数
 }
 }
);
```
