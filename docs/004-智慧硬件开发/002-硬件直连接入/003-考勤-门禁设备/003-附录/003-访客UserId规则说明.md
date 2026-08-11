---
title: "访客UserId规则说明"
doc_id: 15401
category_id: 94005
source_url: https://developer.work.weixin.qq.com/document/path/94005
---
最后更新：2022/09/16

由于一台设备可以被多个应用所绑定，每个应用都有可能有自己的userid命名空间，所以[拉取访客列表](#15370)接口中访客的userid下发给设备时会拼接上对应应用的agentid，用/分割。如应用10001通过[设置访客头像](#15386)接口设置访客UserIdA的头像，设备将会收到userid为UserIdA/10001的访客数据，同理，设备调用[上传用户数据](#15355)、[全量拉取用户数据](#15356)、[增量拉取用户数据](#15357)等接口也需要按UserIdA/10001的格式来处理userid。
