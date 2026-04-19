---
title: 项目文档与变更维护机制
status: accepted
scope: repo
date: 2026-04-20
related_paths:
  - docs
  - scripts/docs
  - .githooks
  - .agents/skills/project-doc-maintainer
---

# Context

项目刚起步，业务实现还轻，但后续会同时增长游戏入口、部署配置、玩法实现和方案讨论。如果没有文档分层和提交流程约束，背景、进展和历史变更会很快混杂。

# Decision

建立四层文档体系：

- `docs/context/` 保存稳定上下文。
- `docs/decisions/` 保存较大方案定稿。
- `docs/progress.md` 保存当前阶段进展。
- `CHANGELOG.md` 与 `docs/changelog/` 保存近期变更和月度归档。

同时建立三类自动化：

- `scripts/docs/*` 做改动分析、文档同步、归档和守卫。
- `.githooks/*` 做轻量提交前校验。
- 仓库私有 skill `project-doc-maintainer` 作为提交前总控入口。

# Alternatives

- 只保留一个大 README：信息会很快混在一起，不适合长期演进。
- 只依赖 git hook 自动生成所有内容：规则难以覆盖高语义判断，误判成本高。
- 把 skill 做成全局能力：当前规则明显依赖项目语境，不适合一开始就抽成全局方案。

# Impact

- 中大型改动提交前有了统一的文档整理入口。
- 近期进展与长期上下文被拆开，文档膨胀速度更可控。
- 旧 changelog 和旧 progress 可以按月压缩归档，而不是长期堆在主文件。

# Follow-ups

- 后续如果游戏数量和目录职责变复杂，再新增更多领域上下文文档。
- 如果判定规则误报较多，再调整 `trivial / notable / major` 的阈值。
