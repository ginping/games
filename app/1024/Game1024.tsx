"use client";

import { useGame } from "./use-game";

const TILE_STYLES: Record<number, { bg: string; color: string }> = {
  2: { bg: "#eee4da", color: "#776e65" },
  4: { bg: "#ede0c8", color: "#776e65" },
  8: { bg: "#f2b179", color: "#f9f6f2" },
  16: { bg: "#f59563", color: "#f9f6f2" },
  32: { bg: "#f67c5f", color: "#f9f6f2" },
  64: { bg: "#f65e3b", color: "#f9f6f2" },
  128: { bg: "#edcf72", color: "#f9f6f2" },
  256: { bg: "#edcc61", color: "#f9f6f2" },
  512: { bg: "#edc850", color: "#f9f6f2" },
  1024: { bg: "#edc53f", color: "#f9f6f2" },
};

const FALLBACK_STYLE = { bg: "#3c3a32", color: "#f9f6f2" };

function tileStyle(value: number) {
  return TILE_STYLES[value] ?? FALLBACK_STYLE;
}

function tileFontSize(value: number) {
  if (value >= 1000) return "0.85rem";
  if (value >= 100) return "1rem";
  return "1.25rem";
}

export function Game1024() {
  const { state, bestScore, newGame, continueGame, onTouchStart, onTouchEnd } =
    useGame();

  return (
    <div className="fade-up mt-8" style={{ animationDelay: "80ms" }}>
      {/* 标题 */}
      <h1 className="text-center text-4xl font-bold tracking-tight text-amber-500">
        1024
      </h1>

      {/* 分数栏 */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="min-w-[5rem] rounded-xl bg-zinc-800 px-4 py-2 text-center">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            分数
          </p>
          <p className="text-lg font-bold tabular-nums text-zinc-100">
            {state.score}
          </p>
        </div>
        <div className="min-w-[5rem] rounded-xl bg-zinc-800 px-4 py-2 text-center">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            最高
          </p>
          <p className="text-lg font-bold tabular-nums text-zinc-100">
            {bestScore}
          </p>
        </div>
        <button
          onClick={newGame}
          className="rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-200"
        >
          新游戏
        </button>
      </div>

      {/* 棋盘 */}
      <div className="relative mx-auto mt-6 w-full max-w-xs">
        <div
          className="tile-grid"
          style={{ touchAction: "none", userSelect: "none" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {state.board.flat().map((cell, i) => {
            if (!cell) {
              return <div key={`empty-${i}`} className="tile tile--empty" />;
            }
            const s = tileStyle(cell.value);
            return (
              <div
                key={cell.id}
                className={`tile${cell.isNew ? " tile--new" : ""}${cell.merged ? " tile--merged" : ""}`}
                style={{
                  background: s.bg,
                  color: s.color,
                  fontSize: tileFontSize(cell.value),
                }}
              >
                {cell.value}
              </div>
            );
          })}
        </div>

        {/* 胜利遮罩 */}
        {state.status === "won" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-amber-500/20 backdrop-blur-sm">
            <p className="text-2xl font-bold text-amber-400">
              到达 1024！
            </p>
            <div className="flex gap-3">
              <button
                onClick={continueGame}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
              >
                继续游戏
              </button>
              <button
                onClick={newGame}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
              >
                再来一局
              </button>
            </div>
          </div>
        )}

        {/* 失败遮罩 */}
        {state.status === "lost" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-black/50 backdrop-blur-sm">
            <p className="text-2xl font-bold text-zinc-300">游戏结束</p>
            <p className="text-sm text-zinc-500">
              得分：{state.score}
            </p>
            <button
              onClick={newGame}
              className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
            >
              再来一局
            </button>
          </div>
        )}
      </div>

      {/* 操作提示 */}
      <div className="mt-6 flex justify-center gap-1.5">
        {["←", "↑", "↓", "→"].map((k) => (
          <span
            key={k}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-500"
          >
            {k}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-zinc-600">
        使用方向键或滑动操作
      </p>
    </div>
  );
}
