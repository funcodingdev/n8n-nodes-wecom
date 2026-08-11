---
title: "Harmony应用"
doc_id: 59012
category_id: 101022
source_url: https://developer.work.weixin.qq.com/document/path/101022
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

### 分享功能接入
企业微信分享是指第三方App通过接入该功能，让用户可以从App分享图片、文件、网页至企业微信会话。
企业微信分享目前支持图片、文件、网页共三种类型。开发者在App中在集成企业微信SDK后，可调用接口实现，以下依次是图片分享、文件分享、网站分享的示例。
**1. 图片分享**
```
 let wwapi = WWAPIFactory.createWWAPI(context)
 let link = new WWMediaImage()
 link.appId = CORPID
 link.agentId = AGENTID //自建应用需要填
 link.fileName = name//文件名
 link.filePath = file//文件路径
 wwapi.sendMessage(context, link, WWKApiAppType.AppTypeSaaS, {
 handleResp: (rsp: BaseMessage | undefined | null): void => {
 if (rsp !== null) {
 promptAction.showToast({
 message: JSON.stringify(rsp)
 });
 }
 }
 })
```
**2. 文件分享**
```
 let wwapi = WWAPIFactory.createWWAPI(context)
 let link = new WWMediaFile()
 link.appId = CORPID
 link.agentId = AGENTID //自建应用需要填
 link.fileName = name//文件名
 link.filePath = file//文件路径
 wwapi.sendMessage(context, link, WWKApiAppType.AppTypeSaaS, {
 handleResp: (rsp: BaseMessage | undefined | null): void => {
 if (rsp !== null) {
 promptAction.showToast({
 message: JSON.stringify(rsp)
 });
 }
 }
 })
```
**3. 网站分享**
```
 let wwapi = WWAPIFactory.createWWAPI(context)
 let link = new WWMediaLink()
 link.appId = CORPID
 link.agentId = AGENTID //自建应用需要填
 link.webpageUrl = "https://www.qq.com/"
 link.title = "链接标题"
 link.description = "链接描述"
 link.thumbUrl = "https://inews.gtimg.com/om_bt/Om1FVQpogNnnpbJDHv1Bu59i6b2ShaIoVPqC9OPce9LjQAA/641"
 wwapi.sendMessage(context, link, WWKApiAppType.AppTypeSaaS, {
 handleResp: (rsp: BaseMessage | undefined | null): void => {
 if (rsp !== null) {
 promptAction.showToast({
 message: JSON.stringify(rsp)
 });
 }
 }
 })
```
