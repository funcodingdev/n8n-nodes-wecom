# 企业微信通讯录管理接口完整实现说明

## 更新日期
2025-10-18

## 概述

本次更新完全实现了企业微信官方通讯录管理文档中定义的所有获取通讯录信息的接口，并实现了动态选项加载功能，让用户可以在 n8n 界面中直接从通讯录选择接收人、部门、标签等信息。

## 实现的通讯录操作

### ✅ 成员管理

#### 1. 获取成员信息 (getUser)
- **接口**: `/cgi-bin/user/get`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90196
- **功能**: 读取指定成员的详细信息
- **特性**: 支持从所有成员列表中动态选择

#### 2. 获取部门成员（简化版）(listUsers)
- **接口**: `/cgi-bin/user/simplelist`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90200
- **功能**: 获取部门成员列表（仅包含基本信息）
- **特性**: 支持递归获取子部门成员

#### 3. 获取部门成员（详细版）(listUsersDetail) - 新增
- **接口**: `/cgi-bin/user/list`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90201
- **功能**: 获取部门成员列表（包含完整信息如职位、邮箱等）
- **特性**: 支持递归获取子部门成员

### ✅ 部门管理

#### 4. 获取部门信息 (getDepartment)
- **接口**: `/cgi-bin/department/list`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90208
- **功能**: 获取企业的部门列表
- **特性**: 可获取指定部门或全量组织架构

### ✅ 标签管理

#### 5. 获取标签列表 (getTagList) - 新增
- **接口**: `/cgi-bin/tag/list`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90216
- **功能**: 获取企业标签列表
- **特性**: 支持按类型筛选（全部/个人/部门标签）

#### 6. 获取标签成员 (getTag) - 新增
- **接口**: `/cgi-bin/tag/get`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90213
- **功能**: 获取指定标签的成员列表
- **特性**: 支持从标签列表中动态选择

### ✅ ID转换

#### 7. UserID转OpenID (convertToOpenid) - 新增
- **接口**: `/cgi-bin/user/convert_to_openid`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90202
- **功能**: 将企业成员的 userid 转换为 openid
- **特性**: 支持从所有成员列表中动态选择

#### 8. OpenID转UserID (convertToUserid) - 新增
- **接口**: `/cgi-bin/user/convert_to_userid`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/90202
- **功能**: 将 openid 转换为企业成员的 userid

### ✅ 企业信息

#### 9. 获取加入企业二维码 (getJoinQrcode) - 新增
- **接口**: `/cgi-bin/corp/get_join_qrcode`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/91714
- **功能**: 获取企业的加入二维码
- **特性**: 支持4种尺寸选择（171x171, 399x399, 741x741, 2052x2052）

#### 10. 获取企业活跃成员数 (getActiveStat) - 新增
- **接口**: `/cgi-bin/user/get_active_stat`
- **参考文档**: https://developer.work.weixin.qq.com/document/path/92714
- **功能**: 获取企业指定日期的活跃成员数
- **特性**: 支持获取最长30天前的数据

## 动态选项加载功能

### loadOptions 方法

在主节点中实现了 6 个 loadOptions 方法，让用户可以在 n8n 界面中动态选择：

#### 1. getDepartments
- 获取所有部门列表
- 用于部门选择下拉框

#### 2. getDepartmentUsers
- 获取指定部门的成员列表（简化信息）
- 动态加载成员选项

#### 3. getDepartmentUsersDetail
- 获取指定部门的成员详情列表（含职位信息）
- 显示成员姓名、职位和 UserID

#### 4. getTags
- 获取所有标签列表
- 用于标签选择下拉框

#### 5. getTagUsers
- 获取指定标签的成员列表
- 动态加载标签成员

#### 6. getAllUsers
- 获取企业所有成员列表
- 从根部门递归获取
- 用于成员选择下拉框

## 消息接收人动态选择功能

### 通用接收人字段 (commonFields.ts)

创建了通用的接收人选择组件，所有消息发送操作都可使用：

#### 接收人类型选择
- **指定成员**: 从通讯录选择多个成员
- **指定部门**: 从部门列表选择多个部门
- **指定标签**: 从标签列表选择多个标签
- **全体成员**: 发送给企业全部成员
- **手动输入**: 传统的手动输入方式（向后兼容）

#### 特性
- 支持多选（multiOptions）
- 自动转换为企业微信API要求的格式（用 | 分隔）
- 向后兼容旧的手动输入方式

### 已更新的消息类型

所有 14 种消息发送操作都已更新为使用新的接收人选择方式：

1. ✅ sendText - 发送文本消息
2. ✅ sendMarkdown - 发送 Markdown 消息
3. ✅ sendImage - 发送图片消息
4. ✅ sendFile - 发送文件消息
5. ✅ sendVoice - 发送语音消息
6. ✅ sendVideo - 发送视频消息
7. ✅ sendTextCard - 发送文本卡片消息
8. ✅ sendNews - 发送图文消息
9. ✅ sendMpNews - 发送图文消息（mpnews）
10. ✅ sendMiniprogramNotice - 发送小程序通知消息
11. ✅ sendTaskCard - 发送任务卡片消息
12. ✅ sendTemplateCard - 发送模板卡片消息
13. ✅ updateTemplateCard - 更新模板卡片消息
14. ✅ recallMessage - 撤回应用消息（无需接收人）

## 技术实现细节

### 文件结构

```
nodes/WeCom/resources/contact/
├── index.ts                      # 通讯录资源入口
├── execute.ts                    # 执行逻辑
├── getUser.ts                    # 获取成员信息
├── listUsers.ts                  # 获取部门成员（简化版）
├── listUsersDetail.ts           # 获取部门成员（详细版）- 新增
├── getDepartment.ts             # 获取部门信息
├── convertToOpenid.ts           # UserID转OpenID - 新增
├── convertToUserid.ts           # OpenID转UserID - 新增
├── getJoinQrcode.ts             # 获取加入企业二维码 - 新增
├── getActiveStat.ts             # 获取企业活跃成员数 - 新增
├── getTagList.ts                # 获取标签列表 - 新增
└── getTag.ts                    # 获取标签成员 - 新增

nodes/WeCom/resources/message/
└── commonFields.ts              # 通用接收人字段定义 - 新增

nodes/WeCom/
└── WeCom.node.ts                # 主节点（添加 loadOptions 方法）
```

### 代码特性

#### 1. 完整的类型定义
- 所有字段都有 TypeScript 类型定义
- 使用 n8n 的 INodeProperties 接口定义参数
- 使用 ILoadOptionsFunctions 实现动态选项加载

#### 2. 用户友好的界面
- 所有字段都有中文描述
- 支持条件显示（displayOptions）
- 提供默认值和验证
- 动态下拉选择，无需手动输入 ID

#### 3. 灵活的输入方式
- 优先使用动态选项选择
- 保留手动输入方式作为备选
- 支持多选（multiOptions）
- 自动处理数据格式转换

#### 4. 完善的错误处理
- 参数验证
- API 错误处理
- 向后兼容性检查

#### 5. 遵循官方文档
- 所有字段名称与官方文档一致
- 支持所有可选参数
- 完全符合企业微信 API 规范

## 使用示例

### 1. 从通讯录选择接收人发送消息

```javascript
{
  "resource": "message",
  "operation": "sendText",
  "recipientType": "users",  // 选择指定成员
  "touser": ["zhangsan", "lisi"],  // 从下拉列表中选择成员
  "content": "这是一条测试消息"
}
```

### 2. 向指定部门发送消息

```javascript
{
  "resource": "message",
  "operation": "sendMarkdown",
  "recipientType": "departments",  // 选择指定部门
  "toparty": ["1", "2"],  // 从下拉列表中选择部门
  "content": "## 部门通知\n\n这是一条部门消息"
}
```

### 3. 向标签成员发送消息

```javascript
{
  "resource": "message",
  "operation": "sendText",
  "recipientType": "tags",  // 选择指定标签
  "totag": ["1"],  // 从下拉列表中选择标签
  "content": "标签消息"
}
```

### 4. 获取部门成员详情

```javascript
{
  "resource": "contact",
  "operation": "listUsersDetail",
  "department_id": "1",  // 从下拉列表中选择部门
  "fetch_child": true
}
```

### 5. 获取标签成员列表

```javascript
{
  "resource": "contact",
  "operation": "getTag",
  "tagid": "1"  // 从下拉列表中选择标签
}
```

### 6. 获取企业活跃成员数

```javascript
{
  "resource": "contact",
  "operation": "getActiveStat",
  "date": "2025-10-18"
}
```

## 向后兼容性

为了确保现有工作流不受影响，实现了以下兼容措施：

1. **消息执行逻辑**
   - 自动检测是否使用新的 recipientType 字段
   - 如果不存在，则使用旧的 touser/toparty/totag 字段
   - 完全兼容旧的手动输入方式

2. **通讯录字段**
   - 部门、标签、成员字段都从 string 类型升级为 options 类型
   - 支持动态加载选项
   - 保持字段名称不变，确保数据兼容

## 测试建议

### 1. 通讯录接口测试
- 测试获取部门列表
- 测试获取部门成员（简化版和详细版）
- 测试获取标签列表和标签成员
- 测试 userid 与 openid 互转
- 测试获取加入企业二维码
- 测试获取活跃成员数

### 2. 动态选项加载测试
- 测试部门下拉列表是否正常加载
- 测试成员下拉列表是否正常加载
- 测试标签下拉列表是否正常加载
- 测试选项显示格式是否友好

### 3. 消息发送测试
- 使用新的接收人选择方式发送各类消息
- 测试多选功能
- 测试全体成员发送
- 测试向后兼容性（旧的工作流是否正常）

### 4. 边界情况测试
- 测试空部门
- 测试没有标签的情况
- 测试网络错误处理
- 测试 Access Token 失效重试

## 兼容性

- ✅ 完全兼容企业微信官方 API
- ✅ 支持所有文档中的参数和选项
- ✅ 向后兼容现有的工作流
- ✅ 支持 n8n 的最佳实践

## 主要改进

### 相比之前的实现

1. **新增 7 个通讯录接口**
   - 获取部门成员详情
   - userid/openid 互转
   - 获取标签列表和成员
   - 获取加入企业二维码
   - 获取活跃成员数

2. **实现动态选项加载**
   - 6 个 loadOptions 方法
   - 支持部门、成员、标签的动态选择
   - 友好的显示格式

3. **优化消息接收人选择**
   - 创建通用接收人组件
   - 支持 5 种接收人选择方式
   - 所有 14 种消息类型都已更新
   - 保持向后兼容

4. **提升用户体验**
   - 无需记忆 userid、部门 ID、标签 ID
   - 直接从下拉列表选择
   - 显示友好的名称和 ID
   - 支持多选

## 参考文档

- [企业微信通讯录管理接口](https://developer.work.weixin.qq.com/document/path/90193)
- [获取成员](https://developer.work.weixin.qq.com/document/path/90196)
- [获取部门成员](https://developer.work.weixin.qq.com/document/path/90200)
- [获取部门成员详情](https://developer.work.weixin.qq.com/document/path/90201)
- [获取部门列表](https://developer.work.weixin.qq.com/document/path/90208)
- [获取标签成员](https://developer.work.weixin.qq.com/document/path/90213)
- [获取标签列表](https://developer.work.weixin.qq.com/document/path/90216)
- [userid与openid互转](https://developer.work.weixin.qq.com/document/path/90202)
- [获取加入企业二维码](https://developer.work.weixin.qq.com/document/path/91714)
- [获取企业活跃成员数](https://developer.work.weixin.qq.com/document/path/92714)
- [n8n 节点开发文档](https://docs.n8n.io/integrations/creating-nodes/)

## 总结

本次更新完整实现了企业微信通讯录管理的所有获取接口，并通过 loadOptions 方法实现了动态选项加载功能，大幅提升了用户体验。用户现在可以：

1. ✅ 直接从下拉列表选择部门、成员、标签
2. ✅ 无需手动输入和记忆各种 ID
3. ✅ 查看友好的名称和详细信息
4. ✅ 使用所有企业微信通讯录管理接口
5. ✅ 向后兼容现有的工作流

所有功能已编译通过，无 lint 错误，可以直接使用。

