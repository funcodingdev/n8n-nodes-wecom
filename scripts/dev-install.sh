#!/bin/bash

# 企业微信节点本地开发安装脚本
# 参考：https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/

set -e

echo "🚀 开始安装企业微信节点到本地 n8n..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 获取包名
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo -e "${GREEN}📦 包名: $PACKAGE_NAME${NC}"

# 1. 检查 n8n 是否已全局安装
echo -e "\n${YELLOW}步骤 1/5: 检查 n8n 安装...${NC}"
if ! command -v n8n &> /dev/null; then
    echo -e "${RED}❌ n8n 未安装${NC}"
    echo "正在全局安装 n8n..."
    npm install n8n -g
    echo -e "${GREEN}✅ n8n 安装完成${NC}"
else
    echo -e "${GREEN}✅ n8n 已安装${NC}"
fi

# 2. 构建项目
echo -e "\n${YELLOW}步骤 2/5: 构建项目...${NC}"
npm run build
echo -e "${GREEN}✅ 项目构建完成${NC}"

# 3. 创建本地链接
echo -e "\n${YELLOW}步骤 3/5: 创建项目链接...${NC}"
npm link
echo -e "${GREEN}✅ 项目链接创建完成${NC}"

# 4. 确保 ~/.n8n/custom 目录存在
echo -e "\n${YELLOW}步骤 4/5: 配置 n8n 自定义节点目录...${NC}"
N8N_CUSTOM_DIR="$HOME/.n8n/custom"

if [ ! -d "$N8N_CUSTOM_DIR" ]; then
    echo "创建 $N8N_CUSTOM_DIR 目录..."
    mkdir -p "$N8N_CUSTOM_DIR"
    cd "$N8N_CUSTOM_DIR"
    npm init -y
    echo -e "${GREEN}✅ 自定义节点目录创建完成${NC}"
else
    echo -e "${GREEN}✅ 自定义节点目录已存在${NC}"
fi

# 5. 链接到 n8n
echo -e "\n${YELLOW}步骤 5/5: 链接节点到 n8n...${NC}"
cd "$N8N_CUSTOM_DIR"
npm link "$PACKAGE_NAME"
echo -e "${GREEN}✅ 节点链接完成${NC}"

echo -e "\n${GREEN}🎉 安装完成！${NC}"
echo -e "\n使用以下命令启动 n8n："
echo -e "${YELLOW}n8n start${NC}"
echo -e "\n或使用开发模式（自动重新加载）："
echo -e "${YELLOW}npm run dev${NC}"
echo -e "\n然后在浏览器中访问: ${YELLOW}http://localhost:5678${NC}"
echo -e "\n在节点面板中搜索 ${GREEN}企业微信${NC} 或 ${GREEN}WeCom${NC} 即可找到节点"

