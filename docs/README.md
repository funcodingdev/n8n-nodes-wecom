# 企业微信开发者文档知识库

本目录为企业微信开放平台文档的本地知识库，内容直接来自开源镜像 [wxkingstar/doc-hub-mcp](https://github.com/wxkingstar/doc-hub-mcp) 的 `wecom/` 数据。

详见 [SOURCE.md](./SOURCE.md)。

## 目录结构

| 目录 | 说明 |
|------|------|
| [001-企业内部开发](./001-企业内部开发/) | 服务端 API、客户端 API、工具与资源、附录等 |
| [002-第三方应用开发](./002-第三方应用开发/) | 第三方应用相关文档 |
| [003-服务商代开发](./003-服务商代开发/) | 服务商代开发相关文档 |
| [004-智慧硬件开发](./004-智慧硬件开发/) | 智慧硬件相关文档 |
| [INDEX.md](./INDEX.md) | 顶层索引 |

入口也可从官网对照：[企业微信开发者中心](https://developer.work.weixin.qq.com/document/path/90664)。

## 更新镜像

```bash
git clone --depth 1 https://github.com/wxkingstar/doc-hub-mcp.git /tmp/doc-hub-mcp
rsync -a --delete /tmp/doc-hub-mcp/wecom/ docs/ \
  --exclude README.md   # 保留本仓库 README 时按需调整
# 或手动覆盖 001–004 目录与 INDEX.md / SOURCE.md
```

> 以官方在线文档为最终准绳；镜像可能存在时间差。
