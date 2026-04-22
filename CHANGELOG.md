# Changelog

记录当前月的有意义变更。更早月份的归档位于 `docs/changelog/`。

## 2026-04

- 2026-04-20 `major` `1024` 已完成多轮人工试玩并成功通关一次，验收通过，项目主线转向第二款游戏 `snake`
- 2026-04-20 `major` 初始化项目文档维护机制，建立上下文文档、进展记录、月度变更归档、git hooks 与项目私有 skill。
- 2026-04-20 `minor` 补充 Cloudflare 部署账号约束，约定部署前显式执行 `cfcloze on`，避免 Codex 或新 shell 落到默认 OAuth 账号。
- 2026-04-20 `major` 建立项目文档维护机制、git hooks 与项目私有 skill
- 2026-04-20 `minor` 移除构建期依赖远程 Google Fonts 的配置，避免 Cloudflare 部署前构建失败
- 2026-04-20 `minor` 修正 README 部署命令为 `pnpm run deploy`，并将 Wrangler compatibility date 调整到可发布日期
- 2026-04-20 `major` 新增 GitHub Actions 自动部署工作流，在 `main` 分支 push 后自动 lint 并发布到 `games.cloze.cc`
- 2026-04-20 `minor` 清理公开仓库前的本地调试残留，新增 `.local` 约定并移除 README 中的本机绝对路径
- 2026-04-20 `major` 将 1024 从占位页推进到可玩版本，并更新首页与项目说明
- 2026-04-22 `notable` 更新 README.md
