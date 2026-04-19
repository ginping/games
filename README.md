# Games Center

一个基于 `Next.js 16 + Tailwind + Cloudflare Workers` 的 Web 游戏中心脚手架。

当前版本先只做前端骨架，用来演示两件事：

1. 首页如何作为“很多游戏的统一入口”。
2. 点击某个入口后，如何进入这个游戏自己的目录页面，例如 `/1024`。

## 当前包含什么

- 首页游戏大厅
- 一个可访问的示例游戏路由：`/1024`
- Cloudflare Workers / OpenNext 部署配置

当前**不包含**：

- 数据库
- 对象存储
- 登录
- 排行榜
- 后台管理

## 本地启动

这个项目默认使用 `mise` 管理 Node.js 版本，并使用 `pnpm` 作为包管理器。

```bash
mise exec node@24 -- pnpm install
mise exec node@24 -- pnpm dev
```

然后打开 [http://localhost:3000](http://localhost:3000)。

你会看到：

- 首页展示游戏大厅
- 点击 `1024` 卡片后进入 `/1024`

## 新增一个游戏入口

最短路径只要两步：

1. 在 [lib/games.ts](lib/games.ts) 里追加一个游戏对象。
2. 如果这个游戏已经要开放访问，就新增对应页面目录，例如 `app/snake/page.tsx`。

示例：

```ts
{
  slug: "snake",
  title: "贪吃蛇",
  description: "经典街机小游戏。",
  status: "ready",
}
```

如果你把 `status` 设为 `"ready"`，首页会把它渲染成可点击入口，访问路径就是 `/<slug>`。

## 部署到 Cloudflare

这个项目不是静态导出方案，而是部署到 `Cloudflare Workers`。
这样后面要补数据库、KV、R2 或服务端逻辑时，不需要推翻当前架构。

### 第一次部署

先确认本机已经登录 Cloudflare：

```bash
zsh -lic 'source ~/.config/zsh/cloudflare.local.zsh; cfcloze on; mise exec node@24 -- pnpm exec wrangler whoami'
```

然后执行：

```bash
zsh -lic 'source ~/.config/zsh/cloudflare.local.zsh; cfcloze on; mise exec node@24 -- pnpm deploy'
```

部署脚本会：

1. 构建 Next.js 应用
2. 生成 OpenNext Worker 输出
3. 发布到 Cloudflare Workers

## 自定义域名

项目默认目标域名是：

- `https://games.cloze.cc`

对应配置已经写在 [wrangler.jsonc](wrangler.jsonc) 里。

需要注意：

- 你的 Cloudflare 账号必须拥有 `cloze.cc` 这个 zone
- `games.cloze.cc` 不能已经被别的冲突记录占用
- 首次绑定自定义域名时，Cloudflare 会自动创建记录并签发证书

如果部署账号不是目标账号，部署可能成功，但自定义域名绑定会失败。
不要假设 iTerm2 里之前手动执行过的 `cfcloze on` 会自动影响 Codex 或其他新开的 shell。

## 常用命令

```bash
mise exec node@24 -- pnpm dev
mise exec node@24 -- pnpm build
mise exec node@24 -- pnpm lint
mise exec node@24 -- pnpm preview
mise exec node@24 -- pnpm deploy
mise exec node@24 -- pnpm cf-typegen
```

## 目录说明

- [app/page.tsx](app/page.tsx)：首页游戏大厅
- [app/1024/page.tsx](app/1024/page.tsx)：1024 示例游戏页
- [lib/games.ts](lib/games.ts)：游戏入口注册表
- [open-next.config.ts](open-next.config.ts)：OpenNext 配置
- [wrangler.jsonc](wrangler.jsonc)：Cloudflare Worker 配置
