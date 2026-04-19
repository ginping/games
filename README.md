# 游戏中心

一个基于 `Next.js 16 + React 19 + Tailwind CSS 4 + Cloudflare Workers` 的 Web 游戏中心项目。

这个仓库不是单个小游戏仓库，而是一个“游戏宿主应用”示例：用一个统一入口承载多个可以独立访问、独立演进的浏览器游戏。当前阶段主要用它来演示三件事：

1. 如何组织一个多游戏入口的 Next.js 项目。
2. 如何给每个游戏保留自己的独立路由，例如 `/1024`。
3. 如何把这样的项目部署到 Cloudflare Workers。

如果你是第一次接触这些技术，也可以把它当成一个用来学习和试部署的样板仓库。

## 你会在这里看到什么

- 一个首页游戏大厅
- 一个可访问的示例游戏路由：`/1024`
- 一个简单的游戏入口注册表
- 一套已经接好的 Cloudflare Workers / OpenNext 部署骨架

## 你不会在这里看到什么

当前版本还没有接入下面这些能力：

- 登录
- 数据库
- 排行榜
- 对象存储
- 后台管理
- 完整可玩的正式游戏内容

## 项目定位

- 宿主应用：`Next.js + React + TypeScript`
- 单游戏入口：每个游戏单独拥有自己的 URL
- 当前部署目标：`Cloudflare Workers`
- 当前适配方式：`OpenNext`

这个项目不是静态导出网站。  
这样设计的目的是保留后续继续接入服务端能力的空间，例如 `D1`、`KV`、`R2`、排行榜或存档，而不需要把整个项目重做一遍。

## 技术栈

- `Next.js 16`
- `React 19`
- `TypeScript 5`
- `Tailwind CSS 4`
- `@opennextjs/cloudflare`
- `Wrangler 4`
- `pnpm`
- `mise`

## 环境准备

这个仓库推荐使用 `mise` 管理 Node.js 版本，但 `mise` 不是唯一选择。

### 为什么 README 里会写 `mise`

仓库根目录有一个 [`.mise.toml`](.mise.toml)，里面固定了：

```toml
[tools]
node = "24"
```

这表示项目默认希望你使用 `Node.js 24`。  
README 里写 `mise exec node@24 -- ...`，主要是为了让命令在不同人的电脑上都更稳定，避免有人本地装的是别的 Node 版本，结果命令能跑但行为不一致。

### 如果你没有安装 `mise`，还能不能运行这个项目

可以。  
`mise` 只是这个仓库推荐的版本管理方式，不是运行项目的硬性前提。

如果你已经自己安装好了：

- `Node.js 24`
- `pnpm 10`

那么通常可以直接执行：

```bash
pnpm install
pnpm dev
```

也就是说：

- `mise exec node@24 -- pnpm install` 更显式、更稳
- `pnpm install` 更短、更好记

如果你的本地环境已经默认就是正确版本，这两种写法通常没有实际区别。

### 如何安装 `mise`

如果你想按仓库推荐方式准备环境，可以先安装 `mise`。

官方文档：

- [mise Getting Started](https://mise.jdx.dev/getting-started.html)
- [mise Installing](https://mise.jdx.dev/installing-mise.html)

官方文档当前推荐的安装方式包括：

- macOS：`Homebrew`
- Linux/macOS 通用脚本：`curl https://mise.run | sh`

例如在 macOS 上，如果你已经有 `Homebrew`，通常可以使用：

```bash
brew install mise
```

安装完成后，可以先确认版本：

```bash
mise --version
```

### 安装完 `mise` 之后要做什么

在这个仓库目录里执行：

```bash
mise install
```

它会根据 [`.mise.toml`](.mise.toml) 安装项目需要的 Node 版本。

如果你的 shell 还没有自动启用 `mise`，也没关系。  
你仍然可以直接使用这种显式写法运行命令：

```bash
mise exec node@24 -- pnpm install
mise exec node@24 -- pnpm dev
```

## 本地开发

本项目统一使用 `pnpm` 作为包管理器，并推荐通过 `mise` 管理 Node.js 版本。

### 1. 安装依赖

如果你已经装好了 `mise`：

```bash
mise exec node@24 -- pnpm install
```

如果你没有使用 `mise`，但本地已经是正确版本的 `Node.js` 和 `pnpm`，也可以直接执行：

```bash
pnpm install
```

### 2. 启动开发环境

使用 `mise`：

```bash
mise exec node@24 -- pnpm dev
```

不使用 `mise`：

```bash
pnpm dev
```

默认访问地址：

- [http://localhost:3000](http://localhost:3000)

你会看到：

- 首页游戏大厅
- 点击 `1024` 卡片后进入 `/1024`

## 本地预览 Cloudflare 运行方式

`pnpm dev` 跑的是 Next.js 本地开发服务器。  
如果你想在部署前更接近 Cloudflare Workers 的真实运行环境，可以使用：

```bash
mise exec node@24 -- pnpm preview
```

这个命令会先构建 OpenNext 输出，再用本地 Worker 方式预览，更适合做上线前检查。

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
- [app/1024/page.tsx](app/1024/page.tsx)：`1024` 示例游戏页
- [lib/games.ts](lib/games.ts)：游戏入口注册表
- [open-next.config.ts](open-next.config.ts)：OpenNext 配置
- [wrangler.jsonc](wrangler.jsonc)：Cloudflare Worker 配置
- [docs/context/project.md](docs/context/project.md)：项目背景
- [docs/context/deployment.md](docs/context/deployment.md)：部署约束

## 新增一个游戏入口

最短路径通常只要两步：

1. 在 [lib/games.ts](lib/games.ts) 里追加一个游戏对象。
2. 新增对应页面目录，例如 `app/snake/page.tsx`。

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

### 先理解这个仓库是怎么部署的

这个项目当前不是部署到 Cloudflare Pages，而是部署到 `Cloudflare Workers`。

仓库里已经准备好了核心配置：

- [package.json](package.json) 中包含 `preview` 和 `deploy` 脚本
- [open-next.config.ts](open-next.config.ts) 已启用 OpenNext Cloudflare 适配
- [wrangler.jsonc](wrangler.jsonc) 已配置 Worker 入口、静态资源目录和路由

你可以把部署理解成下面三步：

- `pnpm build`：把项目构建出来
- `OpenNext`：把 Next.js 输出转换成 Cloudflare Workers 能运行的产物
- `Wrangler`：把这个产物发布到 Cloudflare

对这个仓库来说，正常情况下你不需要手动上传文件到某个控制台页面。  
执行部署命令后，Wrangler 会直接把它发布到 Cloudflare。

### 如果你是非技术背景，建议按这两个阶段理解

#### 阶段一：先跑起来，先看到结果

目标是先把项目发到一个临时地址，体验一次完整部署流程。  
这一阶段不要求你已经有自己的正式域名。

#### 阶段二：再绑定你自己的域名

等你确认项目能跑、流程能走通，再去接自己的域名，例如：

- `games.example.com`
- `play.yourdomain.com`

这样更容易理解每一步在做什么，也更不容易一开始就被域名配置卡住。

## 给非技术背景朋友的完整上手路径

### 第 1 步：注册 Cloudflare 账号

如果你还没有 Cloudflare 账号，先去官网注册一个。

- [Cloudflare](https://www.cloudflare.com/)

你后面会用这个账号做三件事：

1. 登录并管理你的域名解析
2. 管理 Worker 应用
3. 绑定你的正式域名

### 第 2 步：准备一个你自己的域名

如果你想用正式域名访问项目，需要先拥有一个自己的域名。  
你可以在任意域名注册商购买，比如：

- `example.com`
- `mygamehub.com`

买好之后，把这个域名接入 Cloudflare 管理。通常需要：

1. 在 Cloudflare 添加这个域名
2. 按 Cloudflare 提示去域名注册商修改 nameserver
3. 等待 Cloudflare 完成接管

当这一步完成后，你就可以在 Cloudflare 里管理这个域名的 DNS 记录和自定义子域名。

### 第 3 步：决定你要用哪个网址

你通常不会直接把项目挂在根域名，而是先用一个子域名，例如：

- `games.example.com`
- `play.example.com`

这样更清晰，也更方便以后继续扩展主站和其他子站点。

### 第 4 步：把仓库下载到本地

如果你只是想学习和试跑，可以直接克隆这个仓库。

```bash
git clone <your-repo-url>
cd games
```

### 第 5 步：准备本地环境

这个仓库默认使用：

- `mise` 管理 Node.js 版本
- `pnpm` 管理依赖

安装依赖：

```bash
mise exec node@24 -- pnpm install
```

### 第 6 步：登录 Cloudflare

第一次使用 `wrangler` 时，需要先登录 Cloudflare。  
通常执行下面命令后，它会引导你在浏览器里完成登录：

```bash
mise exec node@24 -- pnpm exec wrangler login
```

你也可以用下面命令确认自己当前登录的是哪个账号：

```bash
mise exec node@24 -- pnpm exec wrangler whoami
```

### 第 7 步：先在本地预览

正式发到 Cloudflare 之前，建议先在本地预览一次：

```bash
mise exec node@24 -- pnpm preview
```

这样能先确认：

- 首页能不能打开
- `/1024` 能不能访问
- 样式和资源有没有明显问题

### 第 8 步：先发布到 Cloudflare 临时地址

如果你还没有准备好正式域名，或者只是想先体验部署流程，建议先发布到 Cloudflare 提供的临时地址。

这里有一个重要点：  
这个仓库当前的 [wrangler.jsonc](wrangler.jsonc) 里默认写的是维护者自己的示例域名 `games.cloze.cc`。  
如果你是在自己的账号里试部署，应该先把它改成你自己的域名，或者先临时移除 `routes` 配置。

当前文件里的相关配置大致是这样：

```jsonc
"routes": [
  {
    "pattern": "games.cloze.cc",
    "custom_domain": true
  }
]
```

如果你只是想先拿到 Cloudflare 自动提供的 `*.workers.dev` 地址，可以先把 `routes` 这一段删掉或注释掉，再执行部署：

```bash
mise exec node@24 -- pnpm deploy
```

当没有配置自定义域名时，Cloudflare 通常会给你一个 `*.workers.dev` 地址，方便你先访问和验证。

### 第 9 步：改成你自己的正式域名

等你确认项目已经可以正常部署之后，再把 [wrangler.jsonc](wrangler.jsonc) 里的域名改成你自己的子域名，例如：

```jsonc
"routes": [
  {
    "pattern": "games.example.com",
    "custom_domain": true
  }
]
```

这里的 `games.example.com` 只是示例。  
你应该替换成你自己已经接入 Cloudflare 管理的域名或子域名。

### 第 10 步：再次部署，让正式域名生效

改完域名配置之后，再执行一次部署：

```bash
mise exec node@24 -- pnpm deploy
```

如果一切正常，Cloudflare 会：

1. 发布你的 Worker
2. 创建对应的域名绑定
3. 自动处理证书

之后你就可以通过自己的正式域名访问它。

## 当前版本是否需要额外云资源

按当前代码状态，这个项目还没有接入下面这些能力：

- `D1`
- `KV`
- `R2`
- 额外环境变量

因此，当前版本通常不需要你先创建数据库、对象存储或复杂密钥配置，就可以先完成基础部署。

## 最容易踩到的坑

### 1. 以为这是 Cloudflare Pages 项目

不是。  
当前仓库走的是 `Next.js + OpenNext + Cloudflare Workers` 路线。

### 2. 直接拿仓库里的示例域名不改

README 和配置里出现的域名示例，只是为了说明仓库当前的默认设置。  
如果你在自己的账号里部署，应该改成你自己的域名，而不是直接照抄。

### 3. 还没准备好域名就硬上正式配置

更推荐的顺序是：

1. 先本地跑通
2. 先发 `workers.dev`
3. 再接自己的正式域名

### 4. 以为本地能跑，线上就一定没问题

不等于。  
本地 `pnpm dev` 跑的是 Next.js 开发服务器，线上跑的是 Cloudflare Workers。  
部署前最好至少执行一次：

```bash
mise exec node@24 -- pnpm preview
```

### 5. 忘了确认域名已经由 Cloudflare 管理

只有当你的域名已经真正接入 Cloudflare 管理后，你才能顺利把 Worker 绑定到自己的正式域名上。

## 部署完成后怎么验收

至少检查下面这些事情：

1. 首页是否能正常打开。
2. `/1024` 是否能正常访问。
3. 桌面和手机视口下页面是否都能打开。
4. 是否访问到了你预期的域名。
5. 页面里是否出现资源 404、白屏或明显样式错乱。

## 如果你完全不想碰命令行

对于非技术背景的人，更稳妥的长期方案通常不是自己手动部署，而是让技术同学额外补一层自动化：

- 代码推到指定分支后自动部署
- 自动区分预览环境和正式环境
- 自动管理 Cloudflare 登录、密钥和发布记录

这一步当前仓库还没有默认接好，但后续可以补：

- `GitHub Actions`
- `Workers Builds`

## 参考资料

- [Cloudflare Workers 上的 Next.js 官方文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Cloudflare Workers 自定义域名官方文档](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [OpenNext Cloudflare 入门文档](https://opennext.js.org/cloudflare/get-started)
