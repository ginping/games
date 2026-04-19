"use client";

import {
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  createGame,
  move,
  initialState,
  type GameState,
  type Direction,
} from "./game-logic";

type Action =
  | { type: "move"; direction: Direction }
  | { type: "new-game" }
  | { type: "continue" };

type HookState = {
  game: GameState;
  bestScore: number;
};

function loadBestScore(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("1024-best") ?? 0);
}

function reducer(state: HookState, action: Action): HookState {
  let game: GameState;

  switch (action.type) {
    case "move":
      game = move(state.game, action.direction);
      break;
    case "new-game":
      game = createGame();
      break;
    case "continue":
      game = { ...state.game, status: "playing" };
      break;
  }

  return {
    game,
    bestScore: Math.max(state.bestScore, game.score),
  };
}

function initState(): HookState {
  return {
    game: initialState(),
    bestScore: loadBestScore(),
  };
}

const KEY_DIR: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const SWIPE_THRESHOLD = 30;

export function useGame() {
  // 初始用空棋盘（SSR 安全），mount 后生成随机棋盘
  const [{ game: state, bestScore }, dispatch] = useReducer(
    reducer,
    undefined,
    initState,
  );

  useEffect(() => {
    dispatch({ type: "new-game" });
  }, []);

  // ── 最高分（localStorage）──
  useEffect(() => {
    localStorage.setItem("1024-best", String(bestScore));
  }, [bestScore]);

  // ── 键盘 ──
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const dir = KEY_DIR[e.key];
      if (dir && state.status === "playing") {
        e.preventDefault();
        dispatch({ type: "move", direction: dir });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.status]);

  // ── 触摸滑动 ──
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || state.status !== "playing") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD)
      return;

    const dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up";
    dispatch({ type: "move", direction: dir });
  }, [state.status]);

  return {
    state,
    bestScore,
    newGame: useCallback(() => dispatch({ type: "new-game" }), []),
    continueGame: useCallback(() => dispatch({ type: "continue" }), []),
    onTouchStart,
    onTouchEnd,
  };
}
