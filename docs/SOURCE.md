# 文档来源说明

- **本地知识库**：`docs/`
- **初始镜像**：[wxkingstar/doc-hub-mcp](https://github.com/wxkingstar/doc-hub-mcp) 的 `wecom/`
- **校准来源**：[SpecFusion](https://github.com/wxkingstar/SpecFusion) 云端 API（`http://specfusion.inagora.org/api`）
- **官方站点**：[企业微信开发者中心](https://developer.work.weixin.qq.com/document)

## 校准结果（摘要）

| 项 | 数量 |
|----|------|
| 本地文档 | ~2760 |
| 已用 SpecFusion 校准 | ~2492 |
| 未在 SpecFusion 匹配到 | ~268（保留镜像原文） |

详情见 `calibrate-summary.json`。

## 校准规则

1. 优先用路径计算 ID：`wecom_` + `sha256(path)` 前 12 位  
2. 路径不一致时用标题搜索 SpecFusion 再拉全文  
3. 校准后 frontmatter 含 `specfusion_id`、`calibrated_from: SpecFusion`、`last_updated` 等  
4. 接口最终以官网最新文档为准  

## Agent 读文档

本项目已安装 SpecFusion Skill：

- `.agents/skills/specfusion/SKILL.md`
- `skills-lock.json`

Agent 可按 Skill 用 curl 在线检索；本地 `docs/` 作为离线副本。
