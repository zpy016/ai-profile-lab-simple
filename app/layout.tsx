import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "实验同学录 · AI Profile POC",
  description: "用 AI 重新认识彼此",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
