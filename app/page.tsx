import type { Route } from "next";
import Link from "next/link";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
      <section className="hero-panel reveal rounded-[2rem] p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] sm:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700/80">
              Games Center
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              用一个 Next.js 应用，承载很多个可独立访问的 Web 游戏。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              这个版本先把产品骨架搭起来：首页负责展示游戏入口，每个游戏使用自己的目录独立承载。
              现在点击 1024，就会进入 <span className="font-mono text-slate-900">/1024</span>。
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] bg-white/70 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">前端</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Next.js 16</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">样式</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Tailwind</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">部署</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Cloudflare</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-slate-500">入口层</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            首页用统一卡片管理游戏入口，后续可以继续往这里增加新游戏。
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-slate-500">路由层</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            每个游戏都是一个独立目录，便于逐个实现、逐个上线。
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-slate-500">部署层</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            直接面向 Cloudflare Workers，后面补 D1、KV、R2 时不需要重做架构。
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              游戏列表
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              先放一个可进入的示例，再逐步把更多游戏接进来。
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-6 text-slate-500 md:block">
            “ready” 表示路由已经接通；“coming soon” 表示这个入口位已经预留好，等后续补内容。
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game, index) => {
            const statusLabel =
              game.status === "ready" ? "ready" : "coming soon";

            const cardContent = (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                    {game.title}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      game.status === "ready"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-10 space-y-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {game.title}
                  </h3>
                  <p className="text-base leading-7 text-slate-600">
                    {game.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-5 text-sm font-medium text-slate-700">
                  <span className="font-mono">/{game.slug}</span>
                  <span>{game.status === "ready" ? "进入页面" : "等待接入"}</span>
                </div>
              </>
            );

            return game.status === "ready" ? (
              <Link
                key={game.slug}
                href={`/${game.slug}` as Route}
                className="game-card reveal rounded-[1.75rem] border border-white/70 bg-white/78 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.1)]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {cardContent}
              </Link>
            ) : (
              <article
                key={game.slug}
                className="game-card reveal rounded-[1.75rem] border border-white/70 bg-white/58 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {cardContent}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
