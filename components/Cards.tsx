"use client";

import { ArrowTopRightOnSquareIcon, BoltIcon, ChatBubbleBottomCenterTextIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { GptItem, PromptItem } from "@/lib/types";
import { Badge, CopyButton, FavoriteButton } from "./ui";

const labelTone = (label: string): "yellow" | "blue" | "orange" | "gray" => label === "一軍" ? "yellow" : label === "未検証" ? "blue" : label === "要アレンジ" ? "orange" : "gray";

export function GptCard({ item, list = false }: { item: GptItem; list?: boolean }) {
  if (list) return <article className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-butter-soft text-lg">✨</div><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><h3 className="font-bold">{item.name}</h3><Badge tone={labelTone(item.label)}>{item.label}</Badge><Badge>{item.category}</Badge></div><p className="truncate text-sm text-muted">{item.useCase}</p></div><div className="flex items-center gap-2"><FavoriteButton id={item.id} type="gpt" initial={item.favorite} /><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white">開く<ArrowTopRightOnSquareIcon className="h-4 w-4" /></a></div></article>;
  return <article className="group flex h-full flex-col rounded-[26px] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:p-6">
    <div className="mb-5 flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-butter-soft text-lg">✨</div><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-1.5"><Badge tone={labelTone(item.label)}>{item.label}</Badge><Badge>{item.category}</Badge></div><h3 className="text-[17px] font-bold leading-snug">{item.name}</h3></div><FavoriteButton id={item.id} type="gpt" initial={item.favorite} /></div>
    <div className="mb-4"><p className="mb-1.5 text-[11px] font-bold tracking-wider text-muted">使う場面</p><p className="text-sm leading-6">{item.useCase}</p></div>
    <div className="mb-5 rounded-2xl bg-cream p-4"><div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B6812]"><BoltIcon className="h-4 w-4" />最初に投げる言葉</div><p className="text-sm font-semibold leading-6">「{item.starter}」</p></div>
    <div className="mb-5 space-y-1.5 text-xs text-muted">{item.relatedPrompts.length > 0 && <p><span className="font-bold text-ink">関連プロンプト：</span>{item.relatedPrompts.join("、")}</p>}<p className="truncate"><span className="font-bold text-ink">URL：</span><a href={item.url} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-ink">{item.url}</a></p></div>
    <div className="mt-auto flex gap-2"><CopyButton text={item.starter} compact /><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#514B42]">GPTを開く<ArrowTopRightOnSquareIcon className="h-4 w-4" /></a></div>
  </article>;
}

export function PromptCard({ item, gptUrl }: { item: PromptItem; gptUrl?: string }) {
  const [detail, setDetail] = useState(false);
  const targetUrl = gptUrl ?? "https://chatgpt.com/gpts";
  const copyAndOpen = () => { void navigator.clipboard.writeText(item.body); };
  useEffect(() => { document.body.style.overflow = detail ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [detail]);
  return <>
    <article className="flex h-full flex-col rounded-[26px] border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:p-6">
      <div className="mb-4 flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F3EAFE] text-lg">📝</div><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-1.5"><Badge tone={labelTone(item.status)}>{item.status}</Badge><Badge>{item.category}</Badge></div><h3 className="text-[17px] font-bold leading-snug">{item.name}</h3></div><FavoriteButton id={item.id} type="prompt" initial={item.favorite} /></div>
      <div className="mb-4"><p className="mb-1.5 text-[11px] font-bold tracking-wider text-muted">使う場面</p><p className="text-sm leading-6">{item.useCase}</p></div>
      <button onClick={() => setDetail(true)} className="mb-4 rounded-2xl bg-cream p-4 text-left transition hover:bg-butter-soft/60"><p className="line-clamp-3 text-sm leading-6 text-[#514E48]">{item.body}</p><span className="mt-3 flex items-center justify-end gap-1 text-xs font-bold text-[#8B6812]">全文を見る<ChevronRightIcon className="h-3.5 w-3.5" /></span></button>
      <div className="mb-5 space-y-1.5 text-xs text-muted"><p><span className="font-bold text-ink">関連GPT：</span>{item.relatedGpt}</p><p><span className="font-bold text-ink">出典メモ：</span>{item.source}</p></div>
      <div className="mt-auto flex gap-2"><CopyButton text={item.body} /><a href={targetUrl} target="_blank" rel="noreferrer" onClick={copyAndOpen} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-sm font-bold text-white"><ChatBubbleBottomCenterTextIcon className="h-4 w-4" />GPTで使う</a></div>
    </article>
    {detail && <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/35 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setDetail(false); }}><div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-soft sm:p-8"><div className="mb-6 flex items-start gap-4"><div className="flex-1"><div className="mb-2 flex gap-2"><Badge tone={labelTone(item.status)}>{item.status}</Badge><Badge>{item.category}</Badge></div><h2 className="text-xl font-bold sm:text-2xl">{item.name}</h2></div><button onClick={() => setDetail(false)} className="rounded-xl border border-line p-2"><XMarkIcon className="h-5 w-5" /></button></div><p className="mb-2 text-xs font-bold tracking-wider text-muted">プロンプト全文</p><div className="mb-6 whitespace-pre-wrap rounded-2xl bg-cream p-5 text-sm leading-7">{item.body}</div><div className="flex flex-col gap-2 sm:flex-row sm:justify-end"><CopyButton text={item.body} /><a href={targetUrl} target="_blank" rel="noreferrer" onClick={copyAndOpen} className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white">GPTで使う<ArrowTopRightOnSquareIcon className="h-4 w-4" /></a></div></div></div>}
  </>;
}
