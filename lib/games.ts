export type GameMeta = {
  slug: string;
  title: string;
  description: string;
  status: "ready" | "coming-soon";
};

export const games: GameMeta[] = [
  {
    slug: "1024",
    title: "1024",
    description: "首个演示入口。点击后进入独立游戏目录，后续会补上完整玩法。",
    status: "ready",
  },
  {
    slug: "snake",
    title: "贪吃蛇",
    description: "后续示例游戏。首版先保留入口位，演示如何持续扩展游戏中心。",
    status: "coming-soon",
  },
  {
    slug: "memory-flip",
    title: "记忆翻牌",
    description: "另一个待接入的小游戏，方便展示游戏列表如何继续增长。",
    status: "coming-soon",
  },
];
