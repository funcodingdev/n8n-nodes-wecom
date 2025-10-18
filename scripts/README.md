# 本地开发部署脚本

本目录包含用于在本地 n8n 实例中测试企业微信节点的脚本。

## 快速开始

### 一键安装节点到本地 n8n

```bash
npm run install:local
```

这个命令会自动：
1. ✅ 检查并安装 n8n（如果未安装）
2. ✅ 构建项目
3. ✅ 创建 npm 链接
4. ✅ 配置 n8n 自定义节点目录
5. ✅ 链接节点到 n8n

### 启动 n8n

```bash
npm run start:local
```

或直接使用：

```bash
n8n start
```

然后在浏览器中访问 [http://localhost:5678](http://localhost:5678)

### 卸载节点

```bash
npm run uninstall:local
```

## 使用方法

### 方式 1: 使用 n8n-node dev（推荐）

这是最简单的方式，支持热重载：

```bash
npm run dev
```

这个命令会：
- 自动构建项目
- 启动 n8n
- 监听文件变化并自动重新加载

### 方式 2: 手动安装和测试

如果你需要在已有的 n8n 实例中测试：

```bash
# 安装到本地 n8n
npm run install:local

# 启动 n8n
npm run start:local
```

## 开发流程

### 推荐的开发流程：

```bash
# 1. 安装节点到本地 n8n（首次）
npm run install:local

# 2. 修改代码后重新构建
npm run build

# 3. 重启 n8n 查看更改
npm run start:local
```

### 或使用自动重载：

```bash
# 使用 dev 模式，自动监听变化
npm run dev
```

## 脚本说明

### dev-install.sh

安装脚本，执行以下操作：

1. 检查 n8n 是否全局安装，如未安装则安装
2. 构建项目 (`npm run build`)
3. 创建本地 npm 链接 (`npm link`)
4. 确保 `~/.n8n/custom` 目录存在
5. 链接节点到 n8n (`npm link n8n-nodes-wecom`)

### dev-uninstall.sh

卸载脚本，执行以下操作：

1. 从 n8n 中取消链接节点
2. 取消项目的本地 npm 链接
3. 清理链接关系

### dev-start.sh

启动脚本，直接启动 n8n 服务器。

## 故障排查

### 问题 1: 找不到节点

**解决方案**:
1. 确认安装脚本运行成功
2. 检查 `~/.n8n/custom/node_modules` 是否包含 `n8n-nodes-wecom`
3. 尝试重启 n8n

### 问题 2: 节点更改未生效

**解决方案**:
1. 确保运行了 `npm run build`
2. 重启 n8n（Ctrl+C 然后重新启动）
3. 或使用 `npm run dev` 模式

### 问题 3: custom 目录不存在

**解决方案**:
```bash
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
```

然后重新运行安装脚本。

### 问题 4: 权限错误

**解决方案**:
```bash
# 确保脚本有执行权限
chmod +x scripts/*.sh
```

## 参考文档

- [n8n 官方文档 - 本地测试节点](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/)
- [n8n 社区节点开发指南](https://docs.n8n.io/integrations/community-nodes/building-community-nodes/)

## 环境要求

- Node.js >= 18
- npm >= 8
- n8n 全局安装（脚本会自动安装）

## 目录结构

```
~/.n8n/
├── custom/               # n8n 自定义节点目录
│   ├── node_modules/
│   │   └── n8n-nodes-wecom/  # 链接到你的项目
│   └── package.json
└── ...
```

