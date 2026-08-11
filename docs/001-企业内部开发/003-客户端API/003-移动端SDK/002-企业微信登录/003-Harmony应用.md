---
title: "Harmony应用"
doc_id: 59011
category_id: 101021
source_url: https://developer.work.weixin.qq.com/document/path/101021
---
最后更新：2025/11/21

[TOC]
## Harmony接入指南
>**接入说明：**
> 任何需要调用企业微信API的应用，都需要先在企业微信管理后台创建一个应用，设置完成后，即可使用对应的功能。
> 不允许跨企业使用，即仅支持企业自己的app使用。

### 创建应用
1. 管理员登录企业微信管理后台，选择**企业应用**
2. 选择已有应用或添加应用，进入应用详情页面
3. 选择“企业微信授权登录”，在设置页面填写Harmony OS的App ID和Bundle ID，设置完成后系统自动生成应用程序**schema**。
○ 鸿蒙 Bundle ID: [文档中心](https://developer.huawei.com/consumer/cn/doc/app/agc-help-createharmonyapp-0000001945392297)
○ 鸿蒙 APP ID，从管理端获取: [文档中心](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/js-apis-bundlemanager-bundleinfo-V5)
> 企业微信分享的设置，复用企业微信授权登录的设置，设置以后登录、分享任何一个都可以使用。
4. 下载企业微信鸿蒙OpenSDK：[lib_wwapi.har](https://dldir1.qq.com/wework/work_weixin/lib_wwapi.har)
> SDK名称：企业微信登录/分享SDK
> 主要功能：通过企业微信登录/分享SDK，企业可在自建的app引入sdk，从而可使用企业微信账号登录app，并且在app中分享消息到企业微信。
> 使用说明：详见本接入指南
> 开发者：深圳市腾讯计算机系统有限公司
> **隐私政策：请接入企业微信登录/分享 SDK的开发者，认真阅读《[企业微信登录/分享SDK个人信息保护规则](https://work.weixin.qq.com/nl/act/p/47eb57a00e9f4ad5)》，并确保对企业微信登录/分享SDK的接入使用情况符合上述规则的相关要求。**

每个第三方应用必须要导入该sdk库，用于实现与企业微信的通信。

5. 搭建开发环境
  1) 在DevEco Studio中创建你的工程，将`lib_wwapi.har`文件拷贝到工程目录中
  2) 引用 opensdk，在 oh-package.json5 中声明依赖
```
"dependencies": {
 "@tencent/wecom_open_sdk" : "file:lib_wwapi.har"
}
```
  3) 在entry的module.json5中配置
```
"querySchemes": [
 "wxworkapi",
 "https",
 ]
```
  4) 在需要使用到企业微信SDK API的文件中导入相关类
```
import { WWAPIFactory, WWAuthMessage, BaseMessage } from '@tencent/wecom_open_sdk';
&nbsp;
// 基本使用
let wwapi = WWAPIFactory.createWWAPI(context)
wwapi.isWWAppInstalled(WWKApiAppType.AppTypeSaaS)//是否安装了企业微信
```
### 授权登录接入
开发者需要配合使用企业微信提供的SDK进行授权登录请求接入。正确接入SDK后开发者移动应用会在终端本地拉起企业微信应用进行授权登录，企业微信用户确认后企业微信将回调授权临时票据（code），同时返回开发者移动应用。
HarmonyOS平台应用授权登录接入代码示例（请参考HarmonyOS接入指南）：
```
 let wwapi = WWAPIFactory.createWWAPI(context)
 let msg = new WWAuthMessage.Req("", SCHEME)
 msg.appId = CORPID
 msg.scopes = ["snsapi_base"]
 msg.agentId = ""
 wwapi.sendMessage(context, msg, WWKApiAppType.AppTypeSaaS, {
 handleResp: (rsp: BaseMessage | undefined | null): void => {
 if (rsp !== null) {
 promptAction.showToast({
 message: JSON.stringify(rsp)
 });
 }
 if (rsp instanceof WWAuthMessage.Resp) {
 //rsp.code 
 console.info(JSON.stringify(rsp))
 }
 }
 })
```
**参数说明：**
| 参数 | 是否必须 | 说明 |
| --- | --- | --- |
| appId | 是 | 企业唯一标识。创建企业后显示在，我的企业 CorpID字段 |
| agentId | 是 | 应用唯一标识。显示在具体应用下的 AgentId字段 |
| scopes | 是 | 授权域，现在只支持snsapi_base |

**返回说明：**
| 参数 | 说明 |
| --- | --- |
| errorCode | `ERR_OK = 0; // 成功`<br/>`ERR_CANCEL = 1; // 操作被取消`<br/>`ERR_FAIL = 2; // 操作失败` |
| code | 用户换取access_token的code，仅在ErrCode为0时有效 |

###通过code获取用户信息
**请求方式：**GET（**HTTPS**）
**请求地址：**https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE

**参数说明：**
| 参数 | 必须 | 说明 |
|---- |-----|------ |
| access_token |是|调用接口凭证 |
| code | 是| 通过成员授权获取到的code，每次成员授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期 |
**权限说明：**
跳转的域名须完全匹配企业内任一应用的可信域名。
**返回结果：**
```
{
 "UserId":"USERID"
}
```
| 参数 | 说明 |
|---- | ----- |
| UserId | 成员UserID |
**出错返回示例：**
```
{
 "errcode": 40029,
 "errmsg": "invalid code"
}
```
