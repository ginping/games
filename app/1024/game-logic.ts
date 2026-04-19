// 1024 游戏纯逻辑引擎 — 零 React / DOM 依赖

export type Direction = "up" | "down" | "left" | "right";

export type Tile = {
  id: number;
  value: number;
  isNew?: boolean;
  merged?: boolean;
};

export type Cell = Tile | null;
export type Board = Cell[][]; // 4×4, board[row][col]
export type GameStatus = "playing" | "won" | "lost";

export type GameState = {
  board: Board;
  score: number;
  status: GameStatus;
  hasWon: boolean; // 曾到达 1024（防重复弹窗）
  nextId: number; // 方块 ID 自增器
};

const SIZE = 4;
const WIN_VALUE = 1024;

// ── 内部工具 ──

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(null));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((c) => (c ? { ...c } : null)));
}

function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) cells.push([r, c]);
    }
  }
  return cells;
}

function spawnTile(
  board: Board,
  nextId: number,
): { board: Board; nextId: number } {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return { board, nextId };

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newBoard = cloneBoard(board);
  newBoard[r][c] = { id: nextId, value, isNew: true };
  return { board: newBoard, nextId: nextId + 1 };
}

function hasValidMove(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) return true;
      if (c < SIZE - 1 && board[r][c]!.value === board[r][c + 1]?.value)
        return true;
      if (r < SIZE - 1 && board[r][c]!.value === board[r + 1][c]?.value)
        return true;
    }
  }
  return false;
}

function hasWinTile(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] && board[r][c]!.value >= WIN_VALUE) return true;
    }
  }
  return false;
}

// ── 单行/列滑动合并 ──

type LineResult = {
  line: Cell[];
  score: number;
  moved: boolean;
  nextId: number;
};

function processLine(line: Cell[], nextId: number): LineResult {
  const originalValues = line.map((c) => c?.value ?? 0);

  // 1. 压缩：去掉空格
  const tiles = line.filter((c): c is Tile => c !== null);

  // 2. 相邻同值合并
  const merged: Cell[] = [];
  let score = 0;
  let currentNextId = nextId;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const newValue = tiles[i].value * 2;
      merged.push({ id: currentNextId++, value: newValue, merged: true });
      score += newValue;
      i += 2;
    } else {
      merged.push({ ...tiles[i] });
      i += 1;
    }
  }

  // 3. 补空
  while (merged.length < SIZE) {
    merged.push(null);
  }

  const newValues = merged.map((c) => c?.value ?? 0);
  const moved = !originalValues.every((v, idx) => v === newValues[idx]);

  return { line: merged, score, moved, nextId: currentNextId };
}

// ── 公开 API ──

/** 空棋盘（SSR 安全，无 Math.random） */
export function initialState(): GameState {
  return { board: emptyBoard(), score: 0, status: "playing", hasWon: false, nextId: 1 };
}

export function createGame(): GameState {
  let board = emptyBoard();
  let nextId = 1;

  const s1 = spawnTile(board, nextId);
  board = s1.board;
  nextId = s1.nextId;

  const s2 = spawnTile(board, nextId);
  board = s2.board;
  nextId = s2.nextId;

  return { board, score: 0, status: "playing", hasWon: false, nextId };
}

export function move(state: GameState, direction: Direction): GameState {
  if (state.status !== "playing") return state;

  // 1. 清除上一轮动画标记
  const board = cloneBoard(state.board);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c]) {
        board[r][c] = { ...board[r][c]!, isNew: false, merged: false };
      }
    }
  }

  // 2. 按方向处理各行/列
  let totalScore = 0;
  let anyMoved = false;
  let nextId = state.nextId;
  const newBoard = emptyBoard();

  if (direction === "left" || direction === "right") {
    for (let r = 0; r < SIZE; r++) {
      const line = board[r].slice();
      if (direction === "right") line.reverse();

      const result = processLine(line, nextId);
      nextId = result.nextId;
      totalScore += result.score;
      if (result.moved) anyMoved = true;

      const processed = result.line;
      if (direction === "right") processed.reverse();
      newBoard[r] = processed;
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      const line: Cell[] = [];
      for (let r = 0; r < SIZE; r++) line.push(board[r][c]);
      if (direction === "down") line.reverse();

      const result = processLine(line, nextId);
      nextId = result.nextId;
      totalScore += result.score;
      if (result.moved) anyMoved = true;

      const processed = result.line;
      if (direction === "down") processed.reverse();
      for (let r = 0; r < SIZE; r++) newBoard[r][c] = processed[r];
    }
  }

  // 3. 无变化 → 无效移动
  if (!anyMoved) return state;

  // 4. 生成新方块
  const spawned = spawnTile(newBoard, nextId);

  // 5. 判定胜负
  const newScore = state.score + totalScore;
  let status: GameStatus = "playing";
  let hasWon = state.hasWon;

  if (hasWinTile(spawned.board) && !hasWon) {
    status = "won";
    hasWon = true;
  } else if (!hasValidMove(spawned.board)) {
    status = "lost";
  }

  return {
    board: spawned.board,
    score: newScore,
    status,
    hasWon,
    nextId: spawned.nextId,
  };
}
