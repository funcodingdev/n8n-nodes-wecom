# 企业微信API接口文档参考

## 目录
- [账号 ID](#账号-id)
- [通讯录管理](#通讯录管理)
- [消息接收与发送](#消息接收与发送)
- [素材管理](#素材管理)
- [企业互联](#企业互联)
- [上下游](#上下游)
- [文档](#文档)
- [微盘](#微盘)

---

## 账号 ID

- 概述：https://developer.work.weixin.qq.com/document/path/98728
- 自建应用与第三方应用的对接：https://developer.work.weixin.qq.com/document/path/95884
- tmp_external_userid的转换：https://developer.work.weixin.qq.com/document/path/98729

---

## 通讯录管理

**概述：** https://developer.work.weixin.qq.com/document/path/90193

### 成员管理
- 成员扩展属性：https://developer.work.weixin.qq.com/document/path/100067
- 创建成员：https://developer.work.weixin.qq.com/document/path/90195
- 读取成员：https://developer.work.weixin.qq.com/document/path/90196
- 更新成员：https://developer.work.weixin.qq.com/document/path/90197
- 删除成员：https://developer.work.weixin.qq.com/document/path/90198
- 批量删除成员：https://developer.work.weixin.qq.com/document/path/90199
- 获取部门成员：https://developer.work.weixin.qq.com/document/path/90200
- 获取部门成员详情：https://developer.work.weixin.qq.com/document/path/90201
- userid与openid互换：https://developer.work.weixin.qq.com/document/path/90202
- 登录二次验证：https://developer.work.weixin.qq.com/document/path/90203
- 邀请成员：https://developer.work.weixin.qq.com/document/path/90975
- 获取加入企业二维码：https://developer.work.weixin.qq.com/document/path/91714
- 手机号获取userid：https://developer.work.weixin.qq.com/document/path/95402
- 邮箱获取userid：https://developer.work.weixin.qq.com/document/path/95895
- 获取成员ID列表：https://developer.work.weixin.qq.com/document/path/96067

### 部门管理
- 创建部门：https://developer.work.weixin.qq.com/document/path/90205
- 更新部门：https://developer.work.weixin.qq.com/document/path/90206
- 删除部门：https://developer.work.weixin.qq.com/document/path/90207
- 获取部门列表：https://developer.work.weixin.qq.com/document/path/90208
- 获取子部门ID列表：https://developer.work.weixin.qq.com/document/path/95350
- 获取单个部门详情：https://developer.work.weixin.qq.com/document/path/95351

### 标签管理
- 创建标签：https://developer.work.weixin.qq.com/document/path/90210
- 更新标签名字：https://developer.work.weixin.qq.com/document/path/90211
- 删除标签：https://developer.work.weixin.qq.com/document/path/90212
- 获取标签成员：https://developer.work.weixin.qq.com/document/path/90213
- 增加标签成员：https://developer.work.weixin.qq.com/document/path/90214
- 删除标签成员：https://developer.work.weixin.qq.com/document/path/90215
- 获取标签列表：https://developer.work.weixin.qq.com/document/path/90216

### 异步导入接口
- 概述：https://developer.work.weixin.qq.com/document/path/90979
- 增量更新成员：https://developer.work.weixin.qq.com/document/path/90980
- 全量覆盖成员：https://developer.work.weixin.qq.com/document/path/90981
- 全量覆盖部门：https://developer.work.weixin.qq.com/document/path/90982
- 获取异步任务结果：https://developer.work.weixin.qq.com/document/path/90983

### 异步导出接口
- 概述：https://developer.work.weixin.qq.com/document/path/94850
- 导出成员：https://developer.work.weixin.qq.com/document/path/94849
- 导出成员详情：https://developer.work.weixin.qq.com/document/path/94851
- 导出部门：https://developer.work.weixin.qq.com/document/path/94852
- 导出标签成员：https://developer.work.weixin.qq.com/document/path/94853
- 获取导出结果：https://developer.work.weixin.qq.com/document/path/94854
- 导出任务完成通知：https://developer.work.weixin.qq.com/document/path/94946

### 通讯录回调通知
- 概述：https://developer.work.weixin.qq.com/document/path/90967
- 成员变更通知：https://developer.work.weixin.qq.com/document/path/90970
- 部门变更通知：https://developer.work.weixin.qq.com/document/path/90971
- 标签变更通知：https://developer.work.weixin.qq.com/document/path/90972
- 异步任务完成通知：https://developer.work.weixin.qq.com/document/path/90973
- 通讯录同步接口调整：https://developer.work.weixin.qq.com/document/path/96079

---

## 消息接收与发送

- 概述：https://developer.work.weixin.qq.com/document/path/90235
- 发送应用消息：https://developer.work.weixin.qq.com/document/path/90236
- 更新模版卡片消息：https://developer.work.weixin.qq.com/document/path/94888
- 撤回应用消息：https://developer.work.weixin.qq.com/document/path/94867

### 接收消息与事件
- 概述：https://developer.work.weixin.qq.com/document/path/90238
- 消息格式：https://developer.work.weixin.qq.com/document/path/90239
- 事件格式：https://developer.work.weixin.qq.com/document/path/90240
- 被动回复消息格式：https://developer.work.weixin.qq.com/document/path/90241
- 回调机制说明：https://developer.work.weixin.qq.com/document/path/92520
- 回调机制示例代码：https://developer.work.weixin.qq.com/document/path/92521

### 应用发送消息到群聊会话
- 概述：https://developer.work.weixin.qq.com/document/path/90244
- 创建群聊会话：https://developer.work.weixin.qq.com/document/path/90245
- 修改群聊会话：https://developer.work.weixin.qq.com/document/path/98913
- 获取群聊会话：https://developer.work.weixin.qq.com/document/path/98914
- 应用推送消息：https://developer.work.weixin.qq.com/document/path/90248

### 家校消息推送
- 发送「学校通知」：https://developer.work.weixin.qq.com/document/path/91609

### 消息推送（原群机器人）
- 消息推送配置说明：https://developer.work.weixin.qq.com/document/path/99110

---

## 素材管理

- 概述：https://developer.work.weixin.qq.com/document/path/91054
- 上传临时素材：https://developer.work.weixin.qq.com/document/path/90253
- 上传图片：https://developer.work.weixin.qq.com/document/path/90256
- 获取临时素材：https://developer.work.weixin.qq.com/document/path/90254
- 获取高清语音素材：https://developer.work.weixin.qq.com/document/path/90255
- 异步上传临时素材：https://developer.work.weixin.qq.com/document/path/96219

---

## 系统

### 获取IP段
- 获取企业微信接口IP段：https://developer.work.weixin.qq.com/document/path/92520
- 获取企业微信回调IP段：https://developer.work.weixin.qq.com/document/path/92521

---

## 企业互联

- 概述：https://developer.work.weixin.qq.com/document/path/93360
- 获取应用共享信息：https://developer.work.weixin.qq.com/document/path/93403
- 获取下级/下游企业的access_token：https://developer.work.weixin.qq.com/document/path/93359
- 获取下级/下游企业小程序session：https://developer.work.weixin.qq.com/document/path/93355

---

## 上下游

**概述：** https://developer.work.weixin.qq.com/document/path/97213

### 基础接口
- 获取应用共享信息：https://developer.work.weixin.qq.com/document/path/95813
- 获取下级/下游企业的access_token：https://developer.work.weixin.qq.com/document/path/95816
- 获取下级/下游企业小程序session：https://developer.work.weixin.qq.com/document/path/95817
- 上下游关联客户信息-已添加客户：https://developer.work.weixin.qq.com/document/path/95818
- 上下游关联客户信息-未添加客户：https://developer.work.weixin.qq.com/document/path/97357

### 上下游通讯录管理
- 获取上下游信息：https://developer.work.weixin.qq.com/document/path/95820
- 批量导入上下游联系人：https://developer.work.weixin.qq.com/document/path/95821
- 获取异步任务结果：https://developer.work.weixin.qq.com/document/path/95823
- 移除企业：https://developer.work.weixin.qq.com/document/path/95822
- 查询成员自定义id：https://developer.work.weixin.qq.com/document/path/97441
- 获取下级企业加入的上下游：https://developer.work.weixin.qq.com/document/path/97442

### 上下游规则
- 获取对接规则id列表：https://developer.work.weixin.qq.com/document/path/95631
- 删除对接规则：https://developer.work.weixin.qq.com/document/path/95632
- 获取对接规则详情：https://developer.work.weixin.qq.com/document/path/95633
- 新增对接规则：https://developer.work.weixin.qq.com/document/path/95634
- 更新对接规则：https://developer.work.weixin.qq.com/document/path/95635

### 回调事件
- 概述：https://developer.work.weixin.qq.com/document/path/95794
- 上下游变更回调：https://developer.work.weixin.qq.com/document/path/95796
- 异步任务完成通知：https://developer.work.weixin.qq.com/document/path/95797

---

## 文档

### 管理文档
- 新建文档：https://developer.work.weixin.qq.com/document/path/97460
- 重命名文档：https://developer.work.weixin.qq.com/document/path/97736
- 删除文档：https://developer.work.weixin.qq.com/document/path/97735
- 获取文档基础信息：https://developer.work.weixin.qq.com/document/path/97734
- 分享文档：https://developer.work.weixin.qq.com/document/path/97733

### 编辑文档
- 编辑文档内容：https://developer.work.weixin.qq.com/document/path/97626
- 编辑表格内容：https://developer.work.weixin.qq.com/document/path/97628

### 编辑智能表格内容
- 添加子表：https://developer.work.weixin.qq.com/document/path/99896
- 删除子表：https://developer.work.weixin.qq.com/document/path/99899
- 更新子表：https://developer.work.weixin.qq.com/document/path/99898
- 添加视图：https://developer.work.weixin.qq.com/document/path/99900
- 删除视图：https://developer.work.weixin.qq.com/document/path/99901
- 更新视图：https://developer.work.weixin.qq.com/document/path/99902
- 添加字段：https://developer.work.weixin.qq.com/document/path/99904
- 删除字段：https://developer.work.weixin.qq.com/document/path/99905
- 更新字段：https://developer.work.weixin.qq.com/document/path/99906
- 添加记录：https://developer.work.weixin.qq.com/document/path/99907
- 删除记录：https://developer.work.weixin.qq.com/document/path/99908
- 更新记录：https://developer.work.weixin.qq.com/document/path/99909

### 获取文档数据
- 获取文档数据：https://developer.work.weixin.qq.com/document/path/97659
- 获取表格行列信息：https://developer.work.weixin.qq.com/document/path/97711
- 获取表格数据：https://developer.work.weixin.qq.com/document/path/97661

### 获取智能表格数据
- 查询子表：https://developer.work.weixin.qq.com/document/path/99911
- 查询视图：https://developer.work.weixin.qq.com/document/path/99913
- 查询字段：https://developer.work.weixin.qq.com/document/path/99914
- 查询记录：https://developer.work.weixin.qq.com/document/path/99915

### 设置文档权限
- 获取文档权限信息：https://developer.work.weixin.qq.com/document/path/97461
- 修改文档查看规则：https://developer.work.weixin.qq.com/document/path/97778
- 修改文档通知范围及权限：https://developer.work.weixin.qq.com/document/path/97781
- 修改文档安全设置：https://developer.work.weixin.qq.com/document/path/97782
- 管理智能表格内容权限：https://developer.work.weixin.qq.com/document/path/99935

### 管理收集表
- 创建收集表：https://developer.work.weixin.qq.com/document/path/97462
- 编辑收集表：https://developer.work.weixin.qq.com/document/path/97816
- 获取收集表信息：https://developer.work.weixin.qq.com/document/path/97817
- 收集表的统计信息查询：https://developer.work.weixin.qq.com/document/path/97818
- 读取收集表答案：https://developer.work.weixin.qq.com/document/path/97819

### 回调通知
- 概述：https://developer.work.weixin.qq.com/document/path/97316
- 修改文档成员事件：https://developer.work.weixin.qq.com/document/path/97833
- 删除文档事件：https://developer.work.weixin.qq.com/document/path/97834
- 收集表完成事件：https://developer.work.weixin.qq.com/document/path/97835
- 删除收集表事件：https://developer.work.weixin.qq.com/document/path/98095
- 修改收集表设置事件：https://developer.work.weixin.qq.com/document/path/98096
- 字段变更事件：https://developer.work.weixin.qq.com/document/path/100987
- 记录变更事件：https://developer.work.weixin.qq.com/document/path/100986

### 高级功能账号管理
- 分配高级功能账号：https://developer.work.weixin.qq.com/document/path/99516
- 取消高级功能账号：https://developer.work.weixin.qq.com/document/path/99517
- 获取高级功能账号列表：https://developer.work.weixin.qq.com/document/path/99518

### 素材管理
- 上传文档图片：https://developer.work.weixin.qq.com/document/path/99933

---

## 微盘

**概述：** https://developer.work.weixin.qq.com/document/path/93654

### 管理空间
- 新建空间：https://developer.work.weixin.qq.com/document/path/93655
- 重命名空间：https://developer.work.weixin.qq.com/document/path/97856
- 解散空间：https://developer.work.weixin.qq.com/document/path/97857
- 获取空间信息：https://developer.work.weixin.qq.com/document/path/97858

### 管理空间权限
- 添加成员/部门：https://developer.work.weixin.qq.com/document/path/93656
- 移除成员/部门：https://developer.work.weixin.qq.com/document/path/97875
- 安全设置：https://developer.work.weixin.qq.com/document/path/97876
- 获取邀请链接：https://developer.work.weixin.qq.com/document/path/97877
- 获取空间信息：https://developer.work.weixin.qq.com/document/path/97878

### 管理文件
- 获取文件列表：https://developer.work.weixin.qq.com/document/path/93657
- 上传文件：https://developer.work.weixin.qq.com/document/path/97880
- 文件分块上传：https://developer.work.weixin.qq.com/document/path/98004
- 下载文件：https://developer.work.weixin.qq.com/document/path/97881
- 新建文件夹/文档：https://developer.work.weixin.qq.com/document/path/97882
- 重命名文件：https://developer.work.weixin.qq.com/document/path/97883
- 移动文件：https://developer.work.weixin.qq.com/document/path/97884
- 删除文件：https://developer.work.weixin.qq.com/document/path/97885
- 获取文件信息：https://developer.work.weixin.qq.com/document/path/97886

### 管理文件权限
- 新增成员：https://developer.work.weixin.qq.com/document/path/93658
- 删除成员：https://developer.work.weixin.qq.com/document/path/97888
- 分享设置：https://developer.work.weixin.qq.com/document/path/97889
- 获取分享链接：https://developer.work.weixin.qq.com/document/path/97890
- 获取文件权限信息：https://developer.work.weixin.qq.com/document/path/97891
- 修改文件安全设置：https://developer.work.weixin.qq.com/document/path/97892

### 回调通知
- 概述：https://developer.work.weixin.qq.com/document/path/97482
- 微盘容量不足事件：https://developer.work.weixin.qq.com/document/path/97898
- 空间变更事件：https://developer.work.weixin.qq.com/document/path/97899
- 文件变更事件：https://developer.work.weixin.qq.com/document/path/97900
- 解散空间：https://developer.work.weixin.qq.com/document/path/97901
- 修改空间成员：https://developer.work.weixin.qq.com/document/path/97902
- 修改空间安全设置：https://developer.work.weixin.qq.com/document/path/97903

### 高级功能账号管理
- 分配高级功能账号：https://developer.work.weixin.qq.com/document/path/99512
- 取消高级功能账号：https://developer.work.weixin.qq.com/document/path/99513
- 获取高级功能账号列表：https://developer.work.weixin.qq.com/document/path/99514
- 版本和容量管理：https://developer.work.weixin.qq.com/document/path/95856

---

## 统计信息

- **账号ID**：3个接口文档
- **通讯录管理**：52个接口文档
- **消息接收与发送**：16个接口文档
- **素材管理**：6个接口文档
- **系统**：2个接口文档
- **企业互联**：4个接口文档
- **上下游**：20个接口文档
- **文档**：48个接口文档
- **微盘**：36个接口文档
- **总计**：187个接口文档

所有链接均来自企业微信官方开发者文档。