import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Games Center",
  description: "一些好玩的浏览器小游戏。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
