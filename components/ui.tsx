"use client";

import { CheckIcon, ClipboardIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "yellow" | "green" | "orange" | "gray" | "blue" }) {
  const colors = { yellow: "bg-[#FFF0B5] text-[#725000]", green: "bg-[#E3F4E8] text-[#3B7049]", orange: "bg-[#FBE8D8] text-[#8A542B]", gray: "bg-[#F1F0EB] text-[#68655D]", blue: "bg-[#E5F0F8] text-[#42667C]" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${colors[tone]}`}>{children}</span>;
}

export function FavoriteButton({ id, type, initial = false }: { id: string; type: "gpt" | "prompt" | "link"; initial?: boolean }) {
  const [active, setActive] = useState(initial), [saving, setSaving] = useState(false);
  const router = useRouter();
  useEffect(() => setActive(initial), [initial]);
  const toggle = async () => {
    if (saving) return;
    setSaving(true);
    const previous = active, next = !active; setActive(next);
    try {
      const response = await fetch("/api/favorite", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type, favorite: next }) });
      if (!response.ok) setActive(previous); else router.refresh();
    } catch { setActive(previous); } finally { setSaving(false); }
  };
  return <button onClick={toggle} disabled={saving} aria-label={active ? "お気に入りから外す" : "お気に入りに追加"} className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition disabled:cursor-wait disabled:opacity-60 ${active ? "border-butter bg-butter-soft text-[#D39A00]" : "border-line bg-white text-muted hover:border-butter"}`}>{active ? <StarSolidIcon className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}</button>;
}

export function CopyButton({ text, compact = false }: { text: string; compact?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setDone(true); window.setTimeout(() => setDone(false), 1800); };
  return <button onClick={copy} className={`${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} inline-flex items-center justify-center gap-2 rounded-xl border font-bold transition ${done ? "border-[#9ACAA7] bg-[#E8F5EB] text-[#397148]" : "border-line bg-white hover:border-butter hover:bg-butter-soft"}`}>{done ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}{done ? "コピーしました" : "コピー"}</button>;
}

export function EmptyState({ title = "該当する道具がありません", text = "検索条件を変えて、もう一度探してみてください。" }: { title?: string; text?: string }) {
  return <div className="col-span-full rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center"><div className="mb-3 text-4xl">🫧</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-muted">{text}</p></div>;
}
