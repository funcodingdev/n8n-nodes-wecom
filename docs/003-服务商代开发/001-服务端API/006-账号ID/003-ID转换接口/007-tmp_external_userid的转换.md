---
title: "tmp_external_userid的转换"
doc_id: 46252
category_id: 98741
source_url: https://developer.work.weixin.qq.com/document/path/98741
---
最后更新：2025/07/01

[TOC]

将应用获取的外部用户临时id`tmp_external_userid`，转换为external_userid。

支持将以下业务类型（business_type）对应接口获取到的tmp_external_userid进行转换：
| 业务类型 | 描述 | 相关接口 | 
| :----------- | :--- | 
| 1 | 会议| [获取会议详情](#25246)| 
| 2 | 收集表 | [收集表的统计信息查询](#44612) <br>[读取收集表答案](#44613)| 
| 3 | 文档 | [获取记录](#53121) 

支持对以下用户类型（user_type）进行转换：
| 用户类型 | 描述 | 转换范围 | 
| :----------- | :--- | :--- | 
| 1 | 客户 | 应用可见范围内，配置了客户联系功能的企业成员所添加的外部联系人 | 
| 2 | 企业互联 | 共享应用配置共享范围内的成员 | 
| 3 | 上下游 | 共享应用配置共享范围内的成员 |
| 4 | 互联企业（圈子）| 管理后台配置的应用可见范围内的成员 |

**请求方式：**POST（**HTTPS**）
**请求地址**：https://qyapi.weixin.qq.com/cgi-bin/idconvert/convert_tmp_external_userid?access_token=ACCESS_TOKEN

**请求参数：**
```json
{
 "business_type": 1,
 "user_type": 1,
 "tmp_external_userid_list": [
 "ouXXX1",
 "ouXXX2",
 "ouXXX3"
 ]
}
```

**参数说明：**

| 参数 | 类型 | 必须 | 说明 |
| :----------- | :--- | :--- |:----------------- |
| access_token | string | 是 | 调用接口凭证 |
| business_type | uint32 | 是 | 业务类型。1-会议 2-收集表 3-智能表 |
| user_type | uint32 | 是 | 转换的目标用户类型。1-客户 2-企业互联 3-上下游 4-互联企业（圈子）<br>详见上面关于user_type的说明 |
| tmp_external_userid_list | string[] | 是 | 外部用户临时id，最多不超过100个 |

**权限说明：**
> 调用此接口的应用，和获取到tmp_external_userid的应用必须是同一个
> 支持自建应用、代开发自建应用和第三方应用调用
> user_type为`1`（即客户类型），应用还需要具有「客户联系」权限
<!-- 【先不加，使用基础频率兜底】调用频率最大为X次/小时，X万次/天 -->

**返回结果：**

```json
{
 "errcode": 0,
 "errmsg": "ok",
 "results": [
 {
 "tmp_external_userid": "ouXXX1",
 "external_userid": "EXTERNAL_USER_ID"
 },
 {
 "tmp_external_userid": "ouXXX2",
 "corpid": "CORPID",
 "userid": "USERID"
 }
 ],
 "invalid_tmp_external_userid_list": [
 "ouXXX3"
 ]
}
```

**参数说明：**

| 参数 | 类型 | 说明 |
| :----------- |:----------------- | :----------------- |
| errcode | int32 | 返回码 |
| errmsg | string | 对返回码的文本描述内容 |
| results | obj[] | 转换成功的结果列表|
| results[].tmp_external_userid | string | 输入的tmp_external_userid|
| results[].external_userid |string | 转换后的userid，user_type为`1`时返回|
| results[].corpid |string | userid对应的corpid，user_type为`2、3、4`时返回|
| results[].userid |string | 转换后的userid，user_type为`2、3、4`时返回|
| invalid_tmp_external_userid_list | string[] | 无法转换的tmp_external_userid。可能非法或没有权限|
