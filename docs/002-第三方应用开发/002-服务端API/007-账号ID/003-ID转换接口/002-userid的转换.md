---
title: "userid的转换"
path: "002-第三方应用开发/002-服务端API/007-账号ID/003-ID转换接口/002-userid的转换"
specfusion_id: wecom_2a627a846087
source_url: "https://developer.work.weixin.qq.com/document/path/97062"
last_updated: "2026-07-26T06:50:10.098Z"
calibrated_from: "SpecFusion"
calibrated_at: "2026-08-11T07:49:33Z"
---
将企业主体下的明文userid转换为服务商主体下的密文userid。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/batch/userid_to_openuserid?access_token=ACCESS_TOKEN

**请求参数：**
```
{
 "userid_list":["aaa", "bbb"]
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| access_token | 是 | 代开发自建应用或第三方应用的接口凭证，服务商可通过“[获取企业access_token](#10975/获取企业access_token)”获得此调用凭证 |
| userid_list | 是 | 获取到的成员ID列表，最多不超过1000个 |

**权限说明：**
>仅代开发应用或第三方应用可调用
>成员需要在应用的可见范围内
>请确保传入userid的正确性，若出错的次数较多，会导致1天不可调用，（具体限制阈值由授权企业的员工规模决定）。

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "",
 "open_userid_list": [
 {
 "userid": "aaa",
 "open_userid": "xxxxx"
 }
 ],
 "invalid_userid_list":["bbb"]
}
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| open_userid_list |该服务商主体下的密文userid|
|open_userid_list.userid |转换成功的userid|
|open_userid_list.open_userid |转换成功的userid对应的服务商主体下的密文userid|

## 未明确企业身份场景

将企业主体下的加密userid转换成服务商主体下的open_userid。

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/service/batch/userid_to_openuserid?provider_access_token=PROVIDER_ACCESS_TOKEN
**请求参数：**
```
{
 "open_userid_list":["wojigengoegeojgoe","wosgjeiogng"],
 "source_botid":"BOTID"
}
```

**参数说明：**

| 参数 | 必须 | 说明 |
| :----------- | :--- | :----------------- |
| provider_access_token | 是 | 应用服务商的接口调用凭证，获取方法参见[服务商的凭证](#15143 ) |
|open_userid_list|是|企业主体下的加密userid，最多不超过1000个|
|source_botid|是|企业智能机器人ID|

**权限说明：**
> open_userid需要在智能机器人的可见范围内
> 智能机器人所在企业需要安装服务商的第三方应用或者代开发应用，且传入的open_userid需要在已安装的应用可见范围内

**返回结果：**

```
{
 "errcode": 0,
 "errmsg": "ok",
 "items": [
 {
 "userid": "woxxxx",
 "open_userid": "wonewxxxx"
 }
 ],
 "open_corpid": "wpxnigenogneg",
 "invalid_open_userid_list": [
 "userid",
 "userid1"
 ]
}
```
**参数说明：**

| 参数 | 说明 |
| :----------- | :----------------- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
|open_corpid|智能机器人所在企业ID|
| items |ID转换结果|
|items.userid|企业主体下的加密userid|
|items.open_userid|服务商主体下的加密userid|
|invalid_open_userid_list|无法转换的open_userid列表。如果传入的是明文userid，也会在这个列表中返回|
