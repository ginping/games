# 部署约束

## 当前部署方案

- 构建方式：`OpenNext`
- 目标平台：`Cloudflare Workers`
- 主要配置文件：`open-next.config.ts`、`wrangler.jsonc`
- 自动部署入口：`.github/workflows/deploy.yml`

## 约束

- 该项目不是静态导出站点，后续要保留服务端扩展空间。
- 需要优先兼容 Cloudflare Worker 的部署模型，而不是 Node 服务器专属能力。
- 部署相关改动通常应至少更新 `CHANGELOG.md`。

## 运维提醒

- 自定义域名为 `games.cloze.cc`。
- 通过 Codex 或其他新开的 shell 执行部署前，先显式运行 `source ~/.config/zsh/cloudflare.local.zsh && cfcloze on`，确保切到 `cloze` 账号。
- GitHub Actions 自动部署通过仓库 secrets 注入 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID`，不复用本地 `cfcloze on`。
- `main` 分支的 `push` 会触发自动部署；Pull Request 合并进 `main` 后也会因为产生 `push` 而触发。
- 自动部署前固定先执行 `pnpm lint`，再执行 `pnpm run deploy`。
- 需要手动重试部署时，优先使用 GitHub Actions 的 `workflow_dispatch`。
- 不要假设 iTerm2 里手动执行过的 `cfcloze on` 会自动传播到 Codex 或其他桌面应用会话。
- 如果部署账号不拥有目标 zone，自定义域名绑定可能失败。
- 部署能力和文档机制都属于高影响改动，提交前应检查是否需要补写进展或 changelog。
