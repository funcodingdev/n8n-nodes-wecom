#!/bin/bash

# 企业微信节点开发环境一键设置脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始设置企业微信节点开发环境...${NC}\n"

# 获取脚本所在目录的父目录（项目根目录）
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo -e "${YELLOW}项目目录:${NC} $PROJECT_DIR\n"

# 步骤 1: 构建项目
echo -e "${YELLOW}步骤 1/4: 构建项目...${NC}"
cd "$PROJECT_DIR"
npm run build
echo -e "${GREEN}✅ 项目构建完成${NC}\n"

# 步骤 2: 创建全局链接
echo -e "${YELLOW}步骤 2/4: 创建全局链接...${NC}"
npm link
echo -e "${GREEN}✅ 全局链接创建完成${NC}\n"

# 步骤 3: 设置 ~/.n8n/custom 目录
echo -e "${YELLOW}步骤 3/4: 设置 n8n 自定义节点目录...${NC}"
N8N_CUSTOM_DIR="$HOME/.n8n/custom"

if [ ! -d "$N8N_CUSTOM_DIR" ]; then
    echo "创建 $N8N_CUSTOM_DIR 目录..."
    mkdir -p "$N8N_CUSTOM_DIR"
fi

cd "$N8N_CUSTOM_DIR"

if [ ! -f "package.json" ]; then
    echo "初始化 package.json..."
    npm init -y
fi

echo -e "${GREEN}✅ 自定义节点目录配置完成${NC}\n"

# 步骤 4: 链接节点到 n8n
echo -e "${YELLOW}步骤 4/4: 链接节点到 n8n...${NC}"
npm link n8n-nodes-wecom
echo -e "${GREEN}✅ 节点链接完成${NC}\n"

# 完成
echo -e "${GREEN}🎉 开发环境设置完成！${NC}\n"
echo -e "现在您可以使用以下命令之一启动 n8n：\n"
echo -e "${YELLOW}方式 1（推荐）：${NC}"
echo -e "  cd $PROJECT_DIR"
echo -e "  npm run dev\n"
echo -e "${YELLOW}方式 2：${NC}"
echo -e "  n8n start\n"
echo -e "然后在浏览器中访问: ${YELLOW}http://localhost:5678${NC}"
echo -e "在节点面板中搜索 ${GREEN}企业微信${NC} 或 ${GREEN}WeCom${NC}\n"

echo -e "${YELLOW}注意：${NC}"
echo -e "- 如果看到 ENOENT 警告，可以忽略，不会影响节点使用"
echo -e "- 修改代码后需要重新运行 ${YELLOW}npm run build${NC}"
echo -e "- 使用 ${YELLOW}npm run build:watch${NC} 可以自动监听文件变化\n"

