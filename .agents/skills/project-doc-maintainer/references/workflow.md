# Workflow Reference

## 文档落点判断

- 项目背景、核心边界、目录职责：写入 `docs/context/project.md`
- 架构和稳定技术约束：写入 `docs/context/architecture.md`
- 前端实现约束：写入 `docs/context/frontend.md`
- Cloudflare / OpenNext / Wrangler 相关约束：写入 `docs/context/deployment.md`
- 单游戏的玩法和技术结构：写入 `docs/context/games/<slug>.md`
- 方案定稿：写入 `docs/decisions/YYYY-MM-DD-<slug>.md`
- 当前阶段进展：写入 `docs/progress.md`
- 当前月有意义变更：写入 `CHANGELOG.md`

## 提交前命令

```bash
mise exec node@24 -- npm run docs:analyze -- --staged
mise exec node@24 -- npm run docs:sync -- --staged
mise exec node@24 -- npm run docs:archive
mise exec node@24 -- npm run docs:guard -- --staged
```

## 触发词

以下请求应优先触发本 skill：

- “提交前整理文档”
- “更新 progress”
- “更新 changelog”
- “文档归档”
- “记录方案定稿”
- “更新项目背景”
