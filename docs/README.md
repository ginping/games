# Docs

这个目录保存项目的长期知识、阶段进展和按月归档的历史变更。

## 目录职责

- `context/`：稳定上下文，只保留当前有效事实。
- `decisions/`：较大的技术方案讨论与定稿结果。
- `progress.md`：当前阶段的短期工作记忆。
- `progress/archive/`：被压缩的历史进展条目。
- `changelog/`：按月归档的历史变更。

## 更新规则

- `docs/context/*` 记录项目背景、架构、规范、部署约束、单游戏上下文。
- `docs/decisions/*` 按 `YYYY-MM-DD-<slug>.md` 命名，模板见 `docs/decisions/README.md`。
- `docs/progress.md` 只保留 `Current Snapshot`、`Active Tracks`、`Recent Milestones`、`Next Focus` 四段。
- `CHANGELOG.md` 只保留当前月的有意义变更；旧月份移动到 `docs/changelog/YYYY-MM.md`。

## 自动化入口

- `mise exec node@24 -- pnpm docs:analyze -- --staged`
- `mise exec node@24 -- pnpm docs:sync -- --staged`
- `mise exec node@24 -- pnpm docs:archive`
- `mise exec node@24 -- pnpm docs:guard -- --staged`

提交前如果是中型或大型改动，优先在 Codex 中调用 `/project-doc-maintainer`，由 skill 结合 diff 和上下文判断是否需要补写文档。
