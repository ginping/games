import Link from "next/link";

export default function Game1024Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
        >
          <span aria-hidden="true">←</span>
          返回游戏大厅
        </Link>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
          玩法开发中
        </span>
      </div>

      <section className="hero-panel mt-8 overflow-hidden rounded-[2rem] p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700/80">
              /1024
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                1024 游戏入口已经打通，接下来只差把玩法接进来。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                这个页面现在的作用是证明路由结构已经成立：大厅入口可以直达独立游戏目录，
                后续你可以把真正的棋盘、得分逻辑和存档能力直接补到这个目录里。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                路由：/1024
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700">
                技术栈：Next.js + Tailwind
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700">
                部署：Cloudflare Workers
              </span>
            </div>
          </div>

          <div className="grid-panel grid min-h-[320px] grid-cols-4 gap-3 rounded-[1.75rem] p-5">
            {["2", "4", "8", "16", "", "32", "", "64", "", "", "128", "", "", "", "", "256"].map(
              (value, index) => (
                <div
                  key={`${value}-${index}`}
                  className={`flex aspect-square items-center justify-center rounded-[1.1rem] text-2xl font-semibold transition ${
                    value
                      ? "bg-gradient-to-br from-amber-200 via-orange-100 to-white text-slate-900 shadow-[0_16px_40px_rgba(245,158,11,0.16)]"
                      : "bg-white/55 text-transparent"
                  }`}
                >
                  {value || "."}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-slate-500">下一步</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            在这个目录里加入棋盘状态、键盘事件和合并规则，就能把占位页升级成可玩的版本。
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-slate-500">后端预留</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            将来如果要存排行榜、用户记录或截图资源，可以继续往 Cloudflare 的 D1、KV、R2 扩展。
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold text-slate-500">演示价值</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            对非技术背景的观众来说，这已经足够展示“从首页入口到独立游戏子路由”的完整产品形态。
          </p>
        </div>
      </section>
    </main>
  );
}
