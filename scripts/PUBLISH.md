# 发布到 npm 社区

## 发布前检查

确保以下条件满足：

- ✅ 代码已提交到 git
- ✅ 工作目录干净（`git status` 无未提交修改）
- ✅ 已登录 npm 账号

## 登录 npm

如果还未登录，先执行：

```bash
npm login
```

## 发布步骤

### 1. 运行检查和构建

```bash
npm run lint && npm run build
```

### 2. 发布到 npm

```bash
npm run release
```

执行后会：
- 提示确认版本号（直接回车保持当前版本，或输入新版本）
- 自动构建和发布
- 创建 git 标签
- 推送到 npm registry

## 发布后

### 查看包信息

访问：https://www.npmjs.com/package/n8n-nodes-wecom

### 提交 n8n 官方验证（可选）

1. 访问 https://creators.n8n.io/
2. 登录或注册账号
3. 提交节点包名：`n8n-nodes-wecom`
4. 等待审核

通过验证后，用户可在 n8n 界面直接搜索安装。

## 版本管理

- 补丁版本（bug 修复）：`0.1.0` → `0.1.1`
- 次要版本（新功能）：`0.1.0` → `0.2.0`
- 主要版本（破坏性更改）：`0.1.0` → `1.0.0`

