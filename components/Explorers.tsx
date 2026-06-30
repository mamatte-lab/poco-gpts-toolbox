"use client";

import { FunnelIcon, Squares2X2Icon, StarIcon, ViewColumnsIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import type { GptItem, PromptItem } from "@/lib/types";
import { GptCard, PromptCard } from "./Cards";
import { EmptyState } from "./ui";

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  return <label className="relative"><span className="sr-only">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 min-w-[140px] appearance-none rounded-xl border border-line bg-white pl-4 pr-9 text-sm font-semibold outline-none focus:border-butter"><option value="">{label}：すべて</option>{options.map((o) => <option key={o}>{o}</option>)}</select><FunnelIcon className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted" /></label>;
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <div className="relative min-w-[220px] flex-1"><input value={value} onChange={(e) => onChange(e.target.value)} placeholder="この一覧から検索" className="h-11 w-full rounded-xl border border-line bg-white px-4 pr-10 text-sm outline-none focus:border-butter focus:ring-4 focus:ring-butter-soft" />{value && <button onClick={() => onChange("")} aria-label="検索をクリア" className="absolute right-3 top-3"><XMarkIcon className="h-5 w-5 text-muted" /></button>}</div>;
}

export function GptExplorer({ items, categories, initialQuery = "" }: { items: GptItem[]; categories: string[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery), [category, setCategory] = useState(""), [label, setLabel] = useState(""), [favorite, setFavorite] = useState(false), [list, setList] = useState(false);
  const filtered = useMemo(() => items.filter((x) => {
    const text = `${x.name} ${x.category} ${x.useCase} ${x.starter} ${x.relatedPrompts.join(" ")}`.toLowerCase();
    return (!q || text.includes(q.toLowerCase())) && (!category || x.category === category) && (!label || x.label === label) && (!favorite || x.favorite);
  }).sort((a, b) => (a.label === "一軍" ? -1 : 1) - (b.label === "一軍" ? -1 : 1)), [items, q, category, label, favorite]);
  return <>
    <div className="mb-7 flex flex-col gap-3 rounded-3xl border border-line bg-white p-4 shadow-card xl:flex-row xl:items-center"><SearchBox value={q} onChange={setQ} /><div className="flex flex-wrap gap-2"><FilterSelect value={category} onChange={setCategory} label="カテゴリ" options={categories} /><FilterSelect value={label} onChange={setLabel} label="ラベル" options={["一軍", "二軍", "保管"]} /><button onClick={() => setFavorite(!favorite)} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${favorite ? "border-butter bg-butter-soft" : "border-line bg-white"}`}><StarIcon className="h-4 w-4" />お気に入り</button><div className="flex rounded-xl border border-line bg-white p-1"><button aria-label="カード表示" onClick={() => setList(false)} className={`rounded-lg p-2 ${!list ? "bg-butter-soft" : "text-muted"}`}><Squares2X2Icon className="h-5 w-5" /></button><button aria-label="リスト表示" onClick={() => setList(true)} className={`rounded-lg p-2 ${list ? "bg-butter-soft" : "text-muted"}`}><ViewColumnsIcon className="h-5 w-5 rotate-90" /></button></div></div></div>
    <div className="mb-4 text-sm text-muted"><strong className="text-ink">{filtered.length}</strong> 件のGPT</div>
    <div className={list ? "space-y-3" : "grid gap-5 md:grid-cols-2 2xl:grid-cols-3"}>{filtered.length ? filtered.map((x) => <GptCard key={x.id} item={x} list={list} />) : <EmptyState />}</div>
  </>;
}

export function PromptExplorer({ items, categories, gpts, initialQuery = "" }: { items: PromptItem[]; categories: string[]; gpts: GptItem[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery), [category, setCategory] = useState(""), [status, setStatus] = useState(""), [favorite, setFavorite] = useState(false);
  const filtered = useMemo(() => items.filter((x) => {
    const text = `${x.name} ${x.category} ${x.useCase} ${x.body} ${x.source} ${x.relatedGpt}`.toLowerCase();
    return (!q || text.includes(q.toLowerCase())) && (!category || x.category === category) && (!status || x.status === status) && (!favorite || x.favorite);
  }).sort((a, b) => (a.status === "一軍" ? -1 : 1) - (b.status === "一軍" ? -1 : 1)), [items, q, category, status, favorite]);
  return <>
    <div className="mb-7 flex flex-col gap-3 rounded-3xl border border-line bg-white p-4 shadow-card xl:flex-row xl:items-center"><SearchBox value={q} onChange={setQ} /><div className="flex flex-wrap gap-2"><FilterSelect value={category} onChange={setCategory} label="カテゴリ" options={categories} /><FilterSelect value={status} onChange={setStatus} label="状態" options={["一軍", "未検証", "要アレンジ", "二軍", "保管"]} /><button onClick={() => setFavorite(!favorite)} className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold ${favorite ? "border-butter bg-butter-soft" : "border-line bg-white"}`}><StarIcon className="h-4 w-4" />お気に入り</button></div></div>
    <div className="mb-4 text-sm text-muted"><strong className="text-ink">{filtered.length}</strong> 件のプロンプト</div>
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{filtered.length ? filtered.map((x) => <PromptCard key={x.id} item={x} gptUrl={gpts.find((g) => g.name === x.relatedGpt)?.url} />) : <EmptyState />}</div>
  </>;
}
