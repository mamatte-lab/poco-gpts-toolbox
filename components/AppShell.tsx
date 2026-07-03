"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRightStartOnRectangleIcon, Bars3Icon, BookOpenIcon, Cog6ToothIcon, HomeIcon, InboxStackIcon, LinkIcon, MagnifyingGlassIcon,
  SparklesIcon, StarIcon, TagIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const nav = [
  { href: "/", label: "ホーム", icon: HomeIcon },
  { href: "/gpts", label: "すべてのGPT", icon: SparklesIcon },
  { href: "/prompts", label: "プロンプトの引き出し", icon: InboxStackIcon },
  { href: "/links", label: "リンク保管庫", icon: LinkIcon },
  { href: "/favorites", label: "お気に入り", icon: StarIcon },
  { href: "/labels", label: "ラベル管理", icon: TagIcon },
  { href: "/manage", label: "道具を編集", icon: Cog6ToothIcon },
  { href: "/guide", label: "使い方ガイド", icon: BookOpenIcon },
];

export function AppShell({ children, siteName, subcopy }: { children: React.ReactNode; siteName: string; subcopy: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  if (pathname === "/login" || pathname === "/unauthorized") return children;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen lg:flex">
      {open && <button aria-label="メニューを閉じる" className="fixed inset-0 z-40 bg-ink/25 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-line bg-white px-5 py-6 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-9 flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-butter-soft text-xl shadow-card">🧰</span>
            <span><strong className="block text-[17px] tracking-tight">{siteName}</strong><small className="text-xs text-muted">MY AI TOOLBOX</small></span>
          </Link>
          <button className="rounded-xl p-2 lg:hidden" onClick={() => setOpen(false)}><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <nav className="space-y-1.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-butter-soft text-ink" : "text-muted hover:bg-cream hover:text-ink"}`}><Icon className="h-5 w-5" />{label}{active && <span className="ml-auto h-2 w-2 rounded-full bg-butter" />}</Link>;
          })}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-3xl bg-cream p-4 text-xs leading-5 text-muted">
          <span className="mb-1 block text-base">💡</span>
          迷ったら、使いたい場面の言葉で検索してみよう。
          {isSupabaseConfigured && <button onClick={async () => { await createClient().auth.signOut(); location.href = "/login"; }} className="mt-3 flex items-center gap-1.5 font-bold text-ink"><ArrowRightStartOnRectangleIcon className="h-4 w-4" />ログアウト</button>}
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-[280px]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-cream/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-4 sm:px-7 lg:px-10">
            <button aria-label="メニューを開く" className="rounded-xl border border-line bg-white p-2.5 lg:hidden" onClick={() => setOpen(true)}><Bars3Icon className="h-5 w-5" /></button>
            <div className="hidden min-w-0 md:block">
              <div className="font-bold">{siteName}</div>
              <div className="truncate text-xs text-muted">{subcopy}</div>
            </div>
            <form onSubmit={submit} className="relative ml-auto w-full max-w-xl">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-2xl border border-line bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-butter focus:ring-4 focus:ring-butter-soft" placeholder="GPT・プロンプト・リンクを検索" />
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
