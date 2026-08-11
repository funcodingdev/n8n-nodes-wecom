---
title: "代开发授权应用secret的获取"
doc_id: 42542
category_id: 97163
source_url: https://developer.work.weixin.qq.com/document/path/97163
---
最后更新：2025/01/02

[TOC]

## secret的获取
对于企业自建应用开发模式，secret由企业管理员登录管理端获取。而代开发应用的secret获取方式与第三方应用中的企业永久授权码更为相似，流程如下：
（1）企业管理员扫代开发模版授权码时，授权完成后会推送[授权成功通知](#14951)到应用代开发模版回调url。
（2）收到回调后，开发者通过本接口获取到的permanent_code，即为代开发应用的secret。

>注：
>a. 应用代开发模版id即为suite_id。企业微信后台也会定期向应用代开发模版回调url[推送suite_ticket](#14947)
>b. [可通过获取第三方应用凭证](#14939)接口获取suite_access_token。
>c. 可调用[获取企业授权信息](#57313)（注意：此种情况接口会多返回is_customized_app字段，且值为true，表示是代开发模版授权）

**请求方式：**POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/service/v2/get_permanent_code?suite_access_token=SUITE_ACCESS_TOKEN

**请求包体：**

```
{
  "auth_code": "auth_code_value"
}
```

**参数说明：** 
 
 | 参数 | 是否必须 | 说明 |
 |----|---- | ----- |
 | auth_code | 是 | [临时授权码](#10974)，会在授权成功时附加在redirect_uri中跳转回第三方服务商网站，或通过[授权成功通知](#14951)回调推送给服务商。长度为64至512个字节 |

**返回结果：** 
```
{
  "errcode":0,
  "errmsg":"ok",
  "permanent_code": "xxxx", 
  "auth_corp_info": 
  {
    "corpid": "xxxx",
    "corp_name": "name"
  },
  "auth_user_info":
  {
    "userid":"aa",
    "open_userid":"xxxxxx",
    "name":"xxx",
    "avatar":"http://xxx"
  },
  "register_code_info":
  {
    "register_code":"1111",
    "template_id":"tpl111",
    "state":"state001"
  },
  "state":"state001"
}
 ```
**参数说明：** 

 | 参数 | 说明 |
 |----|---- |
 |access_token|授权方（企业）access_token,最长为512字节。代开发自建应用安装时不返回。 |
 |expires_in|授权方（企业）access_token超时时间（秒）。代开发自建应用安装时不返回。 |
 |permanent_code|企业微信永久授权码,最长为512字节 |
 |auth_corp_info|授权方企业信息 |
 |auth_corp_info.corpid|授权方企业微信id |
 |auth_corp_info.corp_name|授权方企业名称，即企业简称 |
 |auth_user_info|授权管理员的信息，可能不返回 |
 |auth_user_info.userid|授权管理员的userid，可能为空 |
 |auth_user_info.open_userid|授权管理员的open_userid，可能为空|
 |auth_user_info.name|授权管理员的name，可能为空 |
 |auth_user_info.avatar|授权管理员的头像url，可能为空|
 |register_code_info|推广二维码安装相关信息，扫推广二维码安装时返回。成员授权时暂不支持。（注：无论企业是否新注册，只要通过扫推广二维码安装，都会返回该字段） |
 |register_code_info.register_code|注册码|
 |register_code_info.template_id|推广包ID|
 |register_code_info.state|仅当[获取注册码](#14934)指定该字段时才返回|
 |state|安装应用时，扫码或者授权链接中带的state值。详见state说明 |
 

**state说明：**
目前会返回state包含以下场景：
扫带参二维码授权代开发模版
>注：旧获取secret接口（参考附录）耗时长，若安装应用流程，开发者拿到临时授权码后同步调用获取永久授权码接口，推荐使用该文档中v2接口，该接口耗时更短。

## secret的重置
服务商可在服务商管理端的代开发应用详情页点击“重新获取”(见下图)来重置应用secret。点击“重新获取”后，企业微信后台会回调[重置永久授权码通知](#31408)。开发者收到回调事件后，可使用AuthCode通过[secret的获取](#secret的获取)接口获取代开发应用最新的secret（即permanent_code字段）。
- ![](https://wework.qpic.cn/wwpic/249247_W7HK_vn-T4yjGZx_1626357878/0)

## 附录
旧的获取secret接口文档说明如下：（若开发者获取临时授权码后同步调用获取secret接口，旧接口耗时较长，推荐使用v2新接口）
**请求方式：**POST（**HTTPS**）
**请求地址：** https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=SUITE_ACCESS_TOKEN

**请求包体：**

```
{
  "auth_code": "auth_code_value"
}
```

**参数说明：** 
 
 | 参数 | 是否必须 | 说明 |
 |----|---- | ----- |
 | auth_code | 是 | [临时授权码](#10974)，会在授权成功时附加在redirect_uri中跳转回第三方服务商网站，或通过[授权成功通知](#14951)回调推送给服务商。长度为64至512个字节 |

**返回结果：** 
```
{
  "errcode":0,
  "errmsg":"ok",
  "permanent_code": "xxxx", 
  "dealer_corp_info": 
  {
    "corpid": "xxxx",
    "corp_name": "name"
  },
  "auth_corp_info": 
  {
    "corpid": "xxxx",
    "corp_name": "name",
    "corp_type": "verified",
    "corp_square_logo_url": "yyyyy",
    "corp_user_max": 50,
    "corp_full_name":"full_name",
    "verified_end_time":1431775834,
    "subject_type": 1,
    "corp_wxqrcode": "zzzzz",
    "corp_scale": "1-50人",
    "corp_industry": "IT服务",
    "corp_sub_industry": "计算机软件/硬件/信息服务"
  },
  "auth_info":
  {
    "agent" :
    [
      {
        "agentid":1,
        "name":"NAME",
        "round_logo_url":"xxxxxx",
        "square_logo_url":"yyyyyy",
        "auth_mode":1,
        "is_customized_app":false,
        "auth_from_thirdapp":false,
        "privilege":
        {
          "level":1,
          "allow_party":[1,2,3],
          "allow_user":["zhansan","lisi"],
          "allow_tag":[1,2,3]
        },
        "shared_from":
        {
          "corpid":"wwyyyyy",
          "share_type": 1
        }
      }
    ]
  },
  "auth_user_info":
  {
    "userid":"aa",
    "open_userid":"xxxxxx",
    "name":"xxx",
    "avatar":"http://xxx"
  },
  "state":"state001"
}
 ```
**参数说明：** 

 | 参数 | 说明 |
 |----|---- |
 |permanent_code|企业微信永久授权码,最长为512字节 |
 |auth_corp_info|授权方企业信息 |
 |auth_corp_info.corpid|授权方企业微信id |
 |auth_corp_info.corp_name|授权方企业名称，即企业简称 |
 |auth_corp_info.corp_type|授权方企业类型，认证号：verified, 注册号：unverified |
 |auth_corp_info.corp_square_logo_url|授权方企业方形头像 |
 |auth_corp_info.corp_user_max|授权方企业用户规模 |
 |auth_corp_info.corp_full_name|授权方企业的主体名称(仅[认证或验证](https://work.weixin.qq.com/help?person_id=1&doc_id=17288)过的企业有)，即企业全称。企业微信将逐步回收该字段，后续实际返回内容为企业名称，即auth_corp_info.corp_name。|
 |auth_corp_info.subject_type|企业类型，1. 企业; 2. 政府以及事业单位; 3. 其他组织, 4.团队号 |
 |auth_corp_info.verified_end_time|认证到期时间 |
 |auth_corp_info.corp_wxqrcode|授权企业在微信插件（原企业号）的二维码，可用于关注微信插件 |
 |auth_corp_info.corp_scale| 企业规模。当企业未设置该属性时，值为空 |
 |auth_corp_info.corp_industry| 企业所属行业。当企业未设置该属性时，值为空 |
 |auth_corp_info.corp_sub_industry| 企业所属子行业。当企业未设置该属性时，值为空 |
 |auth_info|授权信息。<font color=red>如果是通讯录应用，且没开启实体应用，是没有该项的。通讯录应用拥有企业通讯录的全部信息读写权限</font> |
 |auth_info.agent|授权的应用信息，注意是一个数组，但仅旧的多应用套件授权时会返回多个agent，对新的单应用授权，永远只返回一个agent |
 |auth_info.agent.agentid|授权方应用id |
 |auth_info.agent.name|授权方应用名字 |
 |auth_info.agent.square_logo_url|授权方应用方形头像 |
 |auth_info.agent.round_logo_url|授权方应用圆形头像 |
 |auth_info.agent.auth_mode|授权模式，0为管理员授权；1为[成员授权](#30245) |
 |auth_info.agent.is_customized_app|是否为代开发自建应用|
 |auth_info.agent.auth_from_thirdapp|来自第三方应用接口唤起,仅通过[第三方应用添加自建应用](#37304) 获取授权链接授权代开发自建应用时，才返回该字段|
 |auth_info.agent.privilege|应用对应的权限 |
 |auth_info.agent.privilege.allow_party|应用可见范围（部门） |
 |auth_info.agent.privilege.allow_tag|应用可见范围（标签） |
 |auth_info.agent.privilege.allow_user|应用可见范围（成员） |
 |auth_info.agent.privilege.level|权限等级。<br />1:通讯录基本信息只读<br />2:通讯录全部信息只读<br />3:通讯录全部信息读写<br />4:单个基本信息只读<br />5:通讯录全部信息只写 |
 |auth_info.agent.shared_from|共享了应用的企业信息，仅当由[企业互联](#24909)或者[上下游](#35931)共享应用触发的安装时才返回|
 |auth_info.agent.shared_from.corpid|共享了应用的企业信息，仅当[企业互联](#24909)或者[上下游](#35931)共享应用触发的安装时才返回|
 |auth_info.agent.shared_from.share_type|共享了途径，0表示企业互联，1表示上下游|
 |auth_user_info|授权管理员的信息，可能不返回 |
 |auth_user_info.userid|授权管理员的userid，可能为空 |
 |auth_user_info.open_userid|授权管理员的open_userid，可能为空|
 |auth_user_info.name|授权管理员的name，可能为空 |
 |auth_user_info.avatar|授权管理员的头像url，可能为空|
 |dealer_corp_info|[代理服务商](#15259)企业信息。应用被代理后才有该信息 |
 |dealer_corp_info.corpid|[代理服务商](#15259)企业微信id |
 |dealer_corp_info.corp_name|[代理服务商](#15259)企业微信名称 |
 |state|安装应用时，扫码或者授权链接中带的state值。详见state说明 |
 
**注意**：因历史原因，该接口在调用失败时才返回errcode。没返回errcode视为调用成功

**state说明：**
目前会返回state包含以下几个场景。
（1）扫带参二维码授权代开发模版。
