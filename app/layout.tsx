import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { getSiteSettings } from "@/lib/repository";

export const metadata: Metadata = {
  title: "ぽこGPT道具箱",
  description: "増えてきたGPTとプロンプトを、すぐ使える道具箱に。",
  robots: { index: false, follow: false, nocache: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <html lang="ja">
      <body><AppShell siteName={settings.siteName} subcopy={settings.subcopy}>{children}</AppShell></body>
    </html>
  );
}
