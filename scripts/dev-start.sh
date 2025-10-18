#!/bin/bash

# 企业微信节点本地开发启动脚本

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 启动 n8n 开发环境...${NC}"
echo -e "\n${YELLOW}提示：${NC}"
echo -e "1. n8n 将在 http://localhost:5678 启动"
echo -e "2. 在节点面板中搜索 ${GREEN}企业微信${NC} 或 ${GREEN}WeCom${NC}"
echo -e "3. 按 Ctrl+C 停止 n8n\n"

# 启动 n8n
n8n start

