import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Games Center",
  description: "基于 Next.js 和 Cloudflare Workers 的 Web 游戏中心脚手架。",
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
