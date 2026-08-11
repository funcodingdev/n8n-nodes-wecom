---
title: "Android应用"
doc_id: 10948
category_id: 91196
source_url: https://developer.work.weixin.qq.com/document/path/91196
---
最后更新：2024/11/27

[TOC]
## Android接入指南

> **接入说明：**
> 任何需要调用企业微信API的应用，都需要先在企业微信管理后台创建一个应用，设置完成后，即可使用对应的功能。

###创建应用
1. 管理员登录企业微信管理后台，选择**企业应用**

2. 选择已有应用或添加应用，进入应用详情页面。

3. 选择“企业微信授权登录”，在设置界面填写Android的 App的签名&包名，设置完成后系统自动生成应用程序**schema**。
> 企业微信分享的设置，复用企业微信授权登录的设置，设置以后登录、分享任何一个都可以使用。

4. 下载企业微信终端开发工具包
[lib_wwapi-3.0.0.7.aar](https://dldir1.qq.com/wework/wwopen/client_sdk/android/lib_wwapi-3.0.0.7.aar)
> SDK名称：企业微信登录/分享SDK
> 版本号：3.0.0.7
> 主要功能：通过企业微信登录/分享SDK，企业可在自建的app引入sdk，从而可使用企业微信账号登录app，并且在app中分享消息到企业微信。
> 使用说明：详见本接入指南
> 开发者：深圳市腾讯计算机系统有限公司
> **隐私政策：请接入企业微信登录/分享 SDK的开发者，认真阅读《[企业微信登录/分享SDK个人信息保护规则](https://work.weixin.qq.com/nl/act/p/47eb57a00e9f4ad5)》，并确保对企业微信登录/分享SDK的接入使用情况符合上述规则的相关要求。**

每个第三方应用必须要导入该sdk库，用于实现与企业微信的通信。
5. 搭建开发环境
 在你需要使用企业微信终端API的文件中导入相应的类。
 import com.tencent.wework.api.model.WWMediaText;
6. 在代码中使用开发工具包
 * 注册到企业微信
要使你的程序启动后企业微信终端能响应你的程序，必须在代码中向企业微信终端注册你的id。可以在程序入口Activity的onCreate回调函数处，或其他合适的地方将你的应用schema注册到企业微信。
  ```java
  private static final String APPID = "WW1e933be11645237c";
  private static final String AGENTID = "1000012";
  private static final String SCHEMA = "wwauth1e933be11645237c000012";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    stringId = getApplicationInfo().labelRes;
    iwwapi = WWAPIFactory.createWWAPI(this);
    iwwapi.registerApp(SCHEMA);
    }
  ```
 * 发送请求和接收返回值
现在，你的程序要发送请求到企业微信终端，可以通过IWWAPI的sendMessage方法来实现。
boolean sendMessage(BaseMessage msg);
sendMessage是第三方app主动发送消息给企业微信，发送完成之后会切回到第三方app界面。
boolean sendMessage(BaseMessage req, IWWAPIEventHandler callback)
带回调的sendMessage是第三方app向企业微信请求数据，企业微信回应数据之后会切回到第三方app界面。
sendMessage的实现示例，如下所示：
```java
WWMediaText txt = new WWMediaText(((EditText) findViewById(R.id.et3)).getText().toString());
txt.appPkg = getPackageName();
txt.appName = getString(stringId);
txt.appId = APPID;
txt.agentId = AGENTID;
iwwapi.sendMessage(txt);
```
带回调的sendMessage的实现，如下所示：
```java
final WWAuthMessage.Req req = new WWAuthMessage.Req();
req.sch = SCHEMA;
req.appId = APPID;
req.agentId = AGENTID;
req.state = "dd";
iwwapi.sendMessage(req, new IWWAPIEventHandler() {
  @Override
  public void handleResp(BaseMessage resp) {
    if (resp instanceof WWAuthMessage.Resp) {
      WWAuthMessage.Resp rsp = (WWAuthMessage.Resp) resp;
      if (rsp.errCode == WWAuthMessage.ERR_CANCEL) {
      Toast.makeText(MainActivity.this, "登录取消", Toast.LENGTH_SHORT).show();
      }else if (rsp.errCode == WWAuthMessage.ERR_FAIL) {
      Toast.makeText(MainActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
      } else if (rsp.errCode == WWAuthMessage.ERR_OK) {
      Toast.makeText(MainActivity.this, "登录成功：" + rsp.code,
      Toast.LENGTH_SHORT).show();
      }
    }
  }
});
```
具体要发送的内容由第三方app开发者定义，具体可参考微信开发工具包中的SDK apitest源码。
注意
如果需要混淆代码，为了保证sdk的正常使用，需要在proguard.cfg加上下面两行配置：
```java
-keep class com.tencent.wework.api.** {
   *;
}
```
至此，你已经能使用企业微信Android开发工具包的API内容了。如果想更详细了解每个API函数的用法，请查阅 Android 平台参考手册 或自行下载阅读企业微信apitest源码。

### 分享功能接入
企业微信分享是指第三方App通过接入该功能，让用户可以从App分享文字、图片、文件、视频、网页至企业微信会话。
企业微信分享目前支持文字、图片、文件、视频、网页共五种类型。开发者在App中在集成企业微信SDK后，可调用接口实现，以下依次是文字分享、图片分享、文件分享、视频分享、网站分享的示例。

1. 文字类型分享示例
```java
WWMediaText txt = new WWMediaText(
            ((EditText) findViewById(R.id.et3)).getText().toString());
txt.appPkg = getPackageName();
txt.appName = getString(stringId);
txt.appId = APPID; //企业唯一标识。创建企业后显示在，我的企业 CorpID字段
txt.agentId = AGENTID; //应用唯一标识。显示在具体应用下的 AgentId字段
iwwapi.sendMessage(txt);
```

1. 图片类型分享示例
```java
WWMediaImage img = new WWMediaImage();
img.fileName = "test";
img.filePath = path;
img.appPkg = getPackageName();
img.appName = getString(stringId);
img.appId = APPID; //企业唯一标识。创建企业后显示在，我的企业 CorpID字段
img.agentId = AGENTID;
iwwapi.sendMessage(img);
```

1. 文件类型分享示例
```java
WWMediaFile file = new WWMediaFile();
file.fileName = "test";
file.filePath = path;
file.appPkg = getPackageName();
file.appName = getString(stringId);
file.appId = APPID; //企业唯一标识。创建企业后显示在，我的企业 CorpID字段
file.agentId = AGENTID; //应用唯一标识。显示在具体应用下的 AgentId字段
iwwapi.sendMessage(file);
```

1. 视频类型分享示例
```java
WWMediaVideo video = new WWMediaVideo();
video.fileName = "test";
video.filePath = path;
video.appPkg = getPackageName();
video.appName = getString(stringId);
video.appId = APPID; //企业唯一标识。创建企业后显示在，我的企业 CorpID字段
video.agentId = AGENTID; //应用唯一标识。显示在具体应用下的 AgentId字段
iwwapi.sendMessage(video);
```
1. 网页类型分享示例
```java
WWMediaLink link = new WWMediaLink();
link.thumbUrl = ((EditText) findViewById(R.id.et2)).getText().toString();
link.webpageUrl = ((EditText) findViewById(R.id.et1)).getText().toString();
link.title = ((EditText) findViewById(R.id.et3)).getText().toString();
link.description = ((EditText) findViewById(R.id.et4)).getText().toString();
link.appPkg = getPackageName();
link.appName = getString(stringId);
link.appId = APPID; //企业唯一标识。创建企业后显示在，我的企业 CorpID字段
link.agentId = AGENTID; //应用唯一标识。显示在具体应用下的 AgentId字段
iwwapi.sendMessage(link);
```

1. 小程序类型分享示例

```java
WWMediaMiniProgram miniProgram = new WWMediaMiniProgram();
miniProgram.appPkg = getPackageName();
miniProgram.appName = "teset";//app name of this android pkg
miniProgram.appId = APPID; //企业唯一标识。创建企业后显示在，我的企业 CorpID字段
miniProgram.agentId = AGENTID; //应用唯一标识。显示在具体应用下的 AgentId字段
miniProgram.schema = SCHEMA;

miniProgram.username = "gh_dde54cb88ce7@app"; //必须是应用关联的小程序，注意要有@app后缀
miniProgram.description = "dddddd";
miniProgram.path = "/pages/plugin/index.html?plugid=1cbd3b7c8674e61769436b5e354ddb2f";

Bitmap bitmap = ((BitmapDrawable) getDrawable(R.drawable.test)).getBitmap();
ByteArrayOutputStream stream = new ByteArrayOutputStream();
bitmap.compress(Bitmap.CompressFormat.JPEG, 0, stream);
byte[] byteArray = stream.toByteArray();

miniProgram.hdImageData = byteArray;
miniProgram.title = "测试_MaHow";
iwwapi.sendMessage(miniProgram, new IWWAPIEventHandler() {
 @Override
 public void handleResp(BaseMessage resp) {
 if(resp instanceof WWSimpleRespMessage){
 WWSimpleRespMessage rsp = (WWSimpleRespMessage)resp;
 String t = "";
 Toast.makeText(MainActivity.this,
 t = "发小程序," + rsp.errCode + "," + rsp.errMsg,
 Toast.LENGTH_LONG).show();
 }
 }
});
```
