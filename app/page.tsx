import type { Route } from "next";
import Link from "next/link";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-14 pb-2">
        <div className="fade-up flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-xl">
            🎮
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-100">
            Games Center
          </span>
        </div>
        <p className="fade-up mt-6 max-w-md text-[15px] leading-relaxed text-zinc-500" style={{ animationDelay: "80ms" }}>
          一些好玩的浏览器小游戏。选一个开始吧。
        </p>
      </header>

      {/* Game Grid */}
      <section className="mx-auto max-w-5xl px-6 pt-8 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => {
            const isReady = game.status === "ready";

            const cardInner = (
              <>
                {/* Preview area */}
                <div
                  className="flex h-44 items-center justify-center text-5xl select-none"
                  style={{
                    background: `radial-gradient(circle at 50% 80%, ${game.color}18 0%, transparent 70%)`,
                  }}
                >
                  <span
                    className="drop-shadow-lg"
                    style={{
                      filter: isReady ? "none" : "grayscale(0.6)",
                    }}
                  >
                    {game.icon}
                  </span>
                </div>

                {/* Info */}
                <div className="px-5 pb-5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[17px] font-semibold text-zinc-100">
                      {game.title}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isReady
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-800 text-zinc-600"
                      }`}
                    >
                      {isReady ? "可游玩" : "开发中"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {game.description}
                  </p>
                </div>
              </>
            );

            if (isReady) {
              return (
                <Link
                  key={game.slug}
                  href={`/${game.slug}` as Route}
                  className="game-card fade-up"
                  style={{
                    "--card-accent": `${game.color}50`,
                    animationDelay: `${i * 100}ms`,
                  } as React.CSSProperties}
                >
                  {cardInner}
                </Link>
              );
            }

            return (
              <div
                key={game.slug}
                className="game-card game-card--disabled fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {cardInner}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
