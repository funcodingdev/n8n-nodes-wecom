---
title: "PSTN 外呼状态更新事件"
doc_id: 47142
category_id: 98774
source_url: https://developer.work.weixin.qq.com/document/path/98774
---
最后更新：2023/04/25

对于API创建的会议，当 PSTN 外呼的状态发生变化时，触发该事件。

**示例**
xml请求示例：
```
<xml>
 <ToUserName><
- ![CDATA[toUser]]></ToUserName>
 <FromUserName><
- ![CDATA[userId]]></FromUserName> 
 <FromUserTmpOpenId><
- ![CDATA[tmpOpenId]]></FromUserTmpOpenId> 
 <CreateTime>1348831860</CreateTime>
 <MsgType><
- ![CDATA[event]]></MsgType>
 <Event><
- ![CDATA[meeting_change]]></Event>
 <ChangeType><
- ![CDATA[pstn_status_update]]></ChangeType>
 <MeetingId><
- ![CDATA[wcjgewCwAAqeJcPI1d8Pwbjt7nttzAAA]]></MeetingId>
 <PstnStatus><
- ![CDATA[START_ACCEPT]]></PstnStatus>
</xml>
```

**说明**

 | 参数 | 说明 |
 |---- | ----- |
 | ToUserName | 企业微信CorpID |
 | FromUserName | 操作者UserID。如果为系统触发事件，默认为```sys```；如果为成员操作事件，仅当是企业成员时有值。|
 | FromUserTmpOpenId | 操作者TmpOpenID。操作者的会中临时ID，仅成员操作事件有值。|
 | CreateTime | 消息创建时间，unix时间戳|
 | MsgType | 消息类型，此时固定为：```event``` |
 | Event | 事件类型，此时固定为：```meeting_change``` |
 | ChangeType | 事件类型，此时固定为：```pstn_status_update``` |
 | MeetingId | 会议ID |
 | PstnStatus | PSTN外呼状态。</br>START_INVITE: 开始邀请</br>START_ACCEPT: 用户接听</br>LEAVE_WITHOUT_ACCEPT: 用户无接听挂断或拒绝</br>LEAVE_WITH_ACCEPTED: 用户已接听挂断</br>CANCLE_INVITE: 呼叫中邀请人主动取消 |
