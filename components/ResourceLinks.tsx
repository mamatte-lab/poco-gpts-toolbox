"use client";

import { ArrowTopRightOnSquareIcon, LinkIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import type { ResourceLink } from "@/lib/types";
import { Badge, EmptyState, FavoriteButton } from "@/components/ui";

export const resourceLinkCategories = ["スプレッドシート", "特典", "note", "Notion", "資料", "その他"];

export function ResourceLinkCard({ item }: { item: ResourceLink }) {
  return <article className="flex h-full flex-col rounded-[26px] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
    <div className="mb-4 flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#E8F2F8]"><LinkIcon className="h-5 w-5 text-[#42667C]" /></div><div className="min-w-0 flex-1"><Badge>{item.category}</Badge><h3 className="mt-2 font-bold leading-snug">{item.name}</h3></div><FavoriteButton id={item.id} type="link" initial={item.favorite} /></div>
    {item.description && <p className="mb-4 text-sm leading-6 text-muted">{item.description}</p>}
    {item.tags.length > 0 && <div className="mb-5 flex flex-wrap gap-1.5">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-muted">#{tag}</span>)}</div>}
    <a href={item.url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white">リンクを開く<ArrowTopRightOnSquareIcon className="h-4 w-4" /></a>
  </article>;
}

export function ResourceLinkExplorer({ items, initialQuery = "" }: { items: ResourceLink[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery), [category, setCategory] = useState("");
  const categories = [...new Set(items.map((item) => item.category))];
  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.name} ${item.category} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!category || item.category === category);
  }), [items, query, category]);
  return <>
    <div className="mb-7 rounded-3xl border border-line bg-white p-4 shadow-card"><div className="relative"><MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3 h-5 w-5 text-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="リンク名・説明・タグから検索" className="h-11 w-full rounded-xl border border-line bg-white pl-12 pr-10 text-sm outline-none focus:border-butter focus:ring-4 focus:ring-butter-soft" />{query && <button onClick={() => setQuery("")} aria-label="検索をクリア" className="absolute right-3 top-3"><XMarkIcon className="h-5 w-5 text-muted" /></button>}</div><div className="pretty-scroll mt-3 flex gap-2 overflow-x-auto pb-1"><button onClick={() => setCategory("")} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${!category ? "bg-ink text-white" : "bg-cream text-muted"}`}>すべて {items.length}</button>{categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${category === name ? "bg-ink text-white" : "bg-cream text-muted"}`}>{name} {items.filter((item) => item.category === name).length}</button>)}</div></div>
    <div className="mb-4 text-sm text-muted"><strong className="text-ink">{filtered.length}</strong> 件の保存リンク</div>
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{filtered.length ? filtered.map((item) => <ResourceLinkCard key={item.id} item={item} />) : <EmptyState title="保存リンクがありません" text="管理画面から、あとで見返したいURLを追加できます。" />}</div>
  </>;
}
