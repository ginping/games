export type GameMeta = {
  slug: string;
  title: string;
  description: string;
  status: "ready" | "coming-soon";
  color: string;
  icon: string;
};

export const games: GameMeta[] = [
  {
    slug: "1024",
    title: "1024",
    description: "滑动数字方块，相同数字合并翻倍，挑战最高分。",
    status: "ready",
    color: "#f59e0b",
    icon: "🎯",
  },
  {
    slug: "snake",
    title: "贪吃蛇",
    description: "控制蛇吃食物不断变长，别撞墙也别咬到自己。",
    status: "coming-soon",
    color: "#10b981",
    icon: "🐍",
  },
  {
    slug: "memory-flip",
    title: "记忆翻牌",
    description: "翻开两张卡片，找出所有配对，考验你的记忆力。",
    status: "coming-soon",
    color: "#8b5cf6",
    icon: "🃏",
  },
];
