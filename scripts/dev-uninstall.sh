#!/bin/bash

# 企业微信节点本地开发卸载脚本

set -e

echo "🗑️  开始卸载企业微信节点..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 获取包名
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo -e "${GREEN}📦 包名: $PACKAGE_NAME${NC}"

# 1. 从 n8n 中取消链接
echo -e "\n${YELLOW}步骤 1/2: 从 n8n 中取消链接...${NC}"
N8N_CUSTOM_DIR="$HOME/.n8n/custom"

if [ -d "$N8N_CUSTOM_DIR" ]; then
    cd "$N8N_CUSTOM_DIR"
    npm unlink "$PACKAGE_NAME" --no-save 2>/dev/null || echo "节点未链接或已取消链接"
    echo -e "${GREEN}✅ n8n 链接已移除${NC}"
else
    echo -e "${YELLOW}⚠️  自定义节点目录不存在${NC}"
fi

# 2. 取消项目本地链接
echo -e "\n${YELLOW}步骤 2/2: 取消项目链接...${NC}"
cd "$(dirname "$0")/.."
npm unlink 2>/dev/null || echo "项目未链接或已取消链接"
echo -e "${GREEN}✅ 项目链接已移除${NC}"

echo -e "\n${GREEN}🎉 卸载完成！${NC}"
echo -e "\n如需重新安装，请运行："
echo -e "${YELLOW}npm run install:local${NC}"

