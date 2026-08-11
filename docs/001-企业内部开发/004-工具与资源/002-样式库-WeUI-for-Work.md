---
title: "样式库 WeUI for Work"
doc_id: 12146
category_id: 90305
source_url: https://developer.work.weixin.qq.com/document/path/90305
---
最后更新：2017/11/01

## 介绍

WeUI for Work 是基于[WeUI](https://github.com/tencent/weui) 上开发的一套同企业微信原生视觉体验一致的基础样式库，由微信官方设计团队为企业微信内网页量身设计，令用户的使用感知更加统一。在企业微信网页使用 WeUI for Work，有如下优势：

1.同企业微信客户端一致的视觉效果，令所有企业微信用户都能更容易地使用你的网站
2.便捷获取快速使用，降低开发和设计成本
3.微信设计团队精心打造，清晰明确，简洁大方

该样式库目前包含表单、基础组件、操作反馈、导航相关、搜索相关、层级规范等内容。访问[https://weui.io/work](https://weui.io/work) 或微信扫码即可预览。
- ![](http://p.qpic.cn/pic_wework/1533122241/61679e698985a17a14f8832ce0d844e871e11f8572cf15d2/0)

## 使用
企业微信开发者如果需要使用 WeUI for Work，可以采用如下两种方式：

1）官方CDN 方式直接加载 CSS

https://res.wx.qq.com/open/libs/weui/1.1.2/weui-for-work.css

https://res.wx.qq.com/open/libs/weui/1.1.2/weui-for-work.min.css

2）Less 源码自行编译集成到项目中

自行编译代码的方式请访问[WeUI for Work 的GitHub](https://github.com/QMUI/weui)下载编译，该项目将定期与[WeUI](https://github.com/tencent/weui) 保持同步。

> 注：除了加载的 CSS 文件不一样，使用 WeUI for Work 与使用 WeUI 无 HTML 结构上的变化。企业微信开发者如果早前使用的是 WeUI v1.x 版本，更换相关 CSS 文件为 WeUI for Work 的样式文件即可无缝切换到适配企业微信的风格界面。

## 常见问题

### WeUI for Work 与 WeUI 的区别？

WeUI for Work 基于 WeUI 而来，WeUI 侧重于**微信**客户端内置网页的使用场景；而WeUI for Work 侧重于**企业微信**客户端内置网页的使用场景。WeUI for Work 相对于WeUI ，在 CSS 样式上跟随企业微信客户端风格微调，但开发者使用的 HTML 结构无须任何改动。
