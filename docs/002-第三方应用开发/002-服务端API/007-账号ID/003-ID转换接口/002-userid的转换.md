---
title: "userid的转换"
doc_id: 42271
category_id: 97062
source_url: https://developer.work.weixin.qq.com/document/path/97062
---
最后更新：2023/03/30

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
