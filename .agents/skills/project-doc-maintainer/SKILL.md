---
name: project-doc-maintainer
description: Maintain this repository's project context, technical decision records, progress log, changelog, and pre-commit doc hygiene. Use when Codex needs to prepare a commit, decide whether a change should update docs/progress/CHANGELOG, archive old progress or changelog entries, record a larger technical方案定稿, or refresh stable project context for this repo.
---

# Project Doc Maintainer

## Overview

用这个 skill 统一处理本仓库的长期上下文、阶段进展、月度 changelog 归档，以及提交前的文档补写判断。它是高语义入口，仓库内的 `scripts/docs/*` 则提供可重复执行的底层命令。

## Entry Points

按用户意图选择下面三个入口，不要混用职责：

- `capture-context`
  - 用于更新 `docs/context/*`
  - 适合新增项目背景、目录职责、前端规范、部署约束、单游戏上下文
- `capture-decision`
  - 用于新增或修订 `docs/decisions/YYYY-MM-DD-<slug>.md`
  - 适合把较大的方案讨论沉淀为定稿
- `commit`
  - 用于提交前总控
  - 适合在 medium / large 变更提交前检查是否需要更新 `CHANGELOG.md`、`docs/progress.md` 或归档历史内容

## Commit Workflow

执行 `commit` 时，固定按这个顺序做：

1. 先读 `git diff --cached`，必要时补读 `docs/context/*`、`docs/progress.md`、`CHANGELOG.md`
2. 运行 `mise exec node@24 -- npm run docs:analyze -- --staged`
3. 判断变更级别：
   - `trivial`：通常跳过文档更新
   - `notable`：默认至少补 `CHANGELOG.md`
   - `major`：默认同时补 `CHANGELOG.md` 和 `docs/progress.md`
4. 需要落地时，运行：
   - `mise exec node@24 -- npm run docs:sync -- --staged`
   - 必要时带 `--summary "..."` 覆盖自动摘要
5. 如果月份切换，或 `docs/progress.md` 的 milestones 超过上限，再运行：
   - `mise exec node@24 -- npm run docs:archive`
6. 再次检查：
   - `mise exec node@24 -- npm run docs:guard -- --staged`
7. 守卫通过后，再执行 `git commit`

## Context Rules

- 不要把短期进展写进 `docs/context/*`
- 不要把长篇讨论过程塞进 `docs/progress.md`
- 不要自动篡改已定稿的决策文档，除非用户明确要求修订该决策
- 如果变更只是一两行代码、纯注释、纯文案、纯格式，通常按 `trivial` 处理

## Decision Rules

- `docs/context/*`
  - 写稳定事实、边界、约束、目录职责
  - 不写一次性执行过程
- `docs/decisions/*`
  - 写方案定稿
  - 固定遵循 `Context`、`Decision`、`Alternatives`、`Impact`、`Follow-ups`
- `docs/progress.md`
  - 只保留当前阶段快照
  - `Recent Milestones` 最多保留 8 条
- `CHANGELOG.md`
  - 只保留当前月的有意义变更
  - 历史月份进入 `docs/changelog/YYYY-MM.md`

## References

- 提交前整理和命令入口：`references/workflow.md`
- 仓库中的自动化命令：
  - `scripts/docs/analyze.mjs`
  - `scripts/docs/sync.mjs`
  - `scripts/docs/archive.mjs`
  - `scripts/docs/guard.mjs`
  - `scripts/git/validate-commit-msg.mjs`

如果需要更具体的命令约束或文档分层规则，再读取 `references/workflow.md`。
