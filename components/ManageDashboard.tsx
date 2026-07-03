"use client";

import {
  ArrowDownTrayIcon, ArrowPathIcon, ClockIcon, Cog6ToothIcon, InboxArrowDownIcon,
  MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TagIcon, TrashIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addedGpts20260701 } from "@/data/gpts-2026-07-01";
import { resourceLinkCategories } from "@/components/ResourceLinks";
import type { AuditLog, CategoryItem, GptItem, PromptItem, ResourceLink, SiteSettings } from "@/lib/types";

type Tab = "tools" | "categories" | "settings" | "trash" | "history" | "backup";
type ToolKind = "gpt" | "prompt" | "link";
type ToolItem = GptItem | PromptItem | ResourceLink;
type EditState = { kind: ToolKind; item: Record<string, unknown>; isNew: boolean } | null;
const inputClass = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-butter focus:ring-4 focus:ring-butter-soft";

export function ManageDashboard({ initialGpts, initialPrompts, initialLinks, initialCategories, settings, logs, configured }: {
  initialGpts: GptItem[]; initialPrompts: PromptItem[]; initialLinks: ResourceLink[]; initialCategories: CategoryItem[];
  settings: SiteSettings; logs: AuditLog[]; configured: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("tools"), [toolKind, setToolKind] = useState<ToolKind>("gpt");
  const [toolCategory, setToolCategory] = useState(""), [toolQuery, setToolQuery] = useState("");
  const [edit, setEdit] = useState<EditState>(null), [dirty, setDirty] = useState(false), [toast, setToast] = useState("");
  const [site, setSite] = useState(settings), [newCategory, setNewCategory] = useState(""), [categoryKind, setCategoryKind] = useState<"gpt" | "prompt">("gpt");
  const [busy, setBusy] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const activeGpts = initialGpts.filter((item) => !item.deletedAt);
  const activePrompts = initialPrompts.filter((item) => !item.deletedAt);
  const activeLinks = initialLinks.filter((item) => !item.deletedAt);
  const deleted = [
    ...initialGpts.filter((item) => item.deletedAt).map((item) => ({ ...item, kind: "gpt" as const })),
    ...initialPrompts.filter((item) => item.deletedAt).map((item) => ({ ...item, kind: "prompt" as const })),
    ...initialLinks.filter((item) => item.deletedAt).map((item) => ({ ...item, kind: "link" as const })),
  ];
  const bundledGptsSynced = addedGpts20260701.every((added) => initialGpts.some((item) => item.id === added.id));
  const currentItems: ToolItem[] = toolKind === "gpt" ? activeGpts : toolKind === "prompt" ? activePrompts : activeLinks;
  const currentCategories = toolKind === "link"
    ? [...new Set([...resourceLinkCategories, ...activeLinks.map((item) => item.category)])]
    : initialCategories.filter((item) => item.kind === toolKind).map((item) => item.name);
  const filteredItems = useMemo(() => currentItems.filter((item) => {
    const details = "useCase" in item ? item.useCase : "description" in item ? `${item.description} ${item.tags.join(" ")}` : "";
    return (!toolCategory || item.category === toolCategory) && (!toolQuery || `${item.name} ${item.category} ${details}`.toLowerCase().includes(toolQuery.toLowerCase()));
  }), [currentItems, toolCategory, toolQuery]);

  useEffect(() => { const guard = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; addEventListener("beforeunload", guard); return () => removeEventListener("beforeunload", guard); }, [dirty]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const change = (key: string, value: unknown) => { if (!edit) return; setEdit({ ...edit, item: { ...edit.item, [key]: value } }); setDirty(true); };
  const close = () => { if (dirty && !confirm("保存していない変更があります。閉じますか？")) return; setEdit(null); setDirty(false); };
  const switchToolKind = (kind: ToolKind) => { setToolKind(kind); setToolCategory(""); setToolQuery(""); };
  const openNew = (kind: ToolKind) => {
    const today = new Date().toISOString().slice(0, 10);
    const id = crypto.randomUUID();
    const item = kind === "gpt"
      ? { id, name: "", category: initialCategories.find((x) => x.kind === "gpt")?.name ?? "その他", useCase: "", starter: "", relatedPrompts: [], label: "一軍", favorite: false, url: "", sortOrder: activeGpts.length * 10, addedAt: today }
      : kind === "prompt"
        ? { id, name: "", category: initialCategories.find((x) => x.kind === "prompt")?.name ?? "その他", useCase: "", body: "", status: "未検証", source: "", relatedGpt: "", favorite: false, sortOrder: activePrompts.length * 10, addedAt: today }
        : { id, name: "", category: resourceLinkCategories[0], url: "", description: "", tags: [], favorite: false, sortOrder: activeLinks.length * 10, addedAt: today };
    setEdit({ kind, isNew: true, item });
  };

  const save = async () => {
    if (!edit || !configured || busy) return;
    setBusy("save");
    try {
      const endpoint = edit.kind === "link" ? "/api/links" : `/api/items/${edit.kind}`;
      const response = await fetch(endpoint, { method: edit.isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit.item) });
      const result = await response.json();
      if (!response.ok) return notify(result.error ?? "保存できませんでした");
      setDirty(false); setEdit(null); notify(edit.isNew ? "追加しました" : "保存しました"); router.refresh();
    } finally { setBusy(null); }
  };
  const moveTrash = async (kind: ToolKind, id: string) => {
    if (!configured || busy || !confirm("ゴミ箱へ移動しますか？")) return;
    const key = `delete:${kind}:${id}`; setBusy(key);
    try { const endpoint = kind === "link" ? "/api/links" : `/api/items/${kind}`; const response = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); const result = await response.json(); if (!response.ok) return notify(result.error ?? "削除できませんでした"); notify("ゴミ箱へ移動しました"); router.refresh(); } finally { setBusy(null); }
  };
  const restore = async (kind: ToolKind, id: string) => {
    if (busy) return; const key = `restore:${kind}:${id}`; setBusy(key);
    try { const endpoint = kind === "link" ? "/api/links" : `/api/items/${kind}`; const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); const result = await response.json(); if (!response.ok) return notify(result.error ?? "復元できませんでした"); notify("復元しました"); router.refresh(); } finally { setBusy(null); }
  };
  const addCategory = async () => {
    if (!newCategory.trim() || !configured || busy) return; setBusy("category:add");
    try { const response = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: categoryKind, name: newCategory.trim(), sortOrder: initialCategories.filter((item) => item.kind === categoryKind).length * 10 }) }); const result = await response.json(); if (!response.ok) return notify(result.error?.includes("duplicate") ? "同じカテゴリはすでにあります" : result.error ?? "追加できませんでした"); setNewCategory(""); notify("カテゴリを追加しました"); router.refresh(); } finally { setBusy(null); }
  };
  const removeCategory = async (id: string) => {
    if (!configured || busy || !confirm("カテゴリを削除しますか？既存の道具のカテゴリ名はそのまま残ります。")) return; setBusy(`category:delete:${id}`);
    try { const response = await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); const result = await response.json(); if (!response.ok) return notify(result.error ?? "削除できませんでした"); notify("カテゴリを削除しました"); router.refresh(); } finally { setBusy(null); }
  };
  const saveSettings = async () => {
    if (busy) return; setBusy("settings");
    try { const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(site) }); const result = await response.json(); if (!response.ok) return notify(result.error ?? "保存できませんでした"); notify("設定を保存しました"); router.refresh(); } finally { setBusy(null); }
  };
  const syncBundledGpts = async () => {
    if (!configured || busy) return; setBusy("sync");
    try { const response = await fetch("/api/sync-bundled-gpts", { method: "POST" }); const result = await response.json(); if (!response.ok) return notify(result.error ?? "追加できませんでした"); notify(`${result.count}件のGPTを追加しました`); router.refresh(); } finally { setBusy(null); }
  };
  const exportData = () => { const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), gpts: initialGpts, prompts: initialPrompts, links: initialLinks, categories: initialCategories, settings }, null, 2)], { type: "application/json" }); const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(blob); anchor.download = `poko-toolbox-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(anchor.href); };
  const importData = async (file?: File) => {
    if (!file || !configured || busy || !confirm("バックアップの内容でデータを更新しますか？")) return; setBusy("import");
    try { const response = await fetch("/api/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: await file.text() }); const result = await response.json(); if (!response.ok) return notify(result.error ?? "読み込めませんでした"); notify("バックアップを読み込みました"); router.refresh(); } catch { notify("ファイルを読み込めませんでした"); } finally { setBusy(null); if (importRef.current) importRef.current.value = ""; }
  };
  const tabs: { id: Tab; label: string; icon: typeof PencilSquareIcon }[] = [
    { id: "tools", label: "道具", icon: PencilSquareIcon }, { id: "categories", label: "カテゴリ", icon: TagIcon },
    { id: "settings", label: "サイト設定", icon: Cog6ToothIcon }, { id: "trash", label: `ゴミ箱 ${deleted.length}`, icon: TrashIcon },
    { id: "history", label: "変更履歴", icon: ClockIcon }, { id: "backup", label: "バックアップ", icon: ArrowDownTrayIcon },
  ];
  const categoryItems = initialCategories.filter((item) => item.kind === categoryKind);

  return <div className="relative">
    <div className="pretty-scroll mb-6 flex gap-2 overflow-x-auto pb-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${tab === id ? "bg-ink text-white" : "border border-line bg-white"}`}><Icon className="h-4 w-4" />{label}</button>)}</div>

    {tab === "tools" && <>
      {!bundledGptsSynced && <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-butter bg-butter-soft p-4 sm:flex-row sm:items-center"><div><h2 className="text-sm font-bold">共有GPTをまとめて追加</h2><p className="mt-1 text-xs text-muted">わど・りこ・まと作のGPT 28件を、重複させず道具箱へ入れます。</p></div><BusyButton onClick={syncBundledGpts} busy={busy === "sync"} disabled={!configured || Boolean(busy)} className="sm:ml-auto">{busy === "sync" ? "追加中…" : "28件を一括追加"}</BusyButton></section>}
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-card">
        <div className="mb-5 flex flex-wrap gap-2">{([[
          "gpt", `GPT ${activeGpts.length}`], ["prompt", `プロンプト ${activePrompts.length}`], ["link", `保存リンク ${activeLinks.length}`],
        ] as [ToolKind, string][]).map(([kind, label]) => <button key={kind} onClick={() => switchToolKind(kind)} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${toolKind === kind ? "bg-ink text-white" : "bg-cream text-muted"}`}>{label}</button>)}</div>
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center"><div className="relative min-w-[240px] flex-1"><MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input value={toolQuery} onChange={(e) => setToolQuery(e.target.value)} placeholder={`${toolKind === "gpt" ? "GPT" : toolKind === "prompt" ? "プロンプト" : "リンク"}を検索`} className={inputClass + " pl-10"} /></div><button onClick={() => openNew(toolKind)} className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-butter px-4 py-2.5 text-sm font-bold"><PlusIcon className="h-4 w-4" />新規追加</button></div>
        <div className="pretty-scroll mb-4 flex gap-2 overflow-x-auto pb-1"><button onClick={() => setToolCategory("")} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${!toolCategory ? "bg-ink text-white" : "bg-cream text-muted"}`}>すべて {currentItems.length}</button>{currentCategories.map((name) => <button key={name} onClick={() => setToolCategory(name)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${toolCategory === name ? "bg-ink text-white" : "bg-cream text-muted"}`}>{name} {currentItems.filter((item) => item.category === name).length}</button>)}</div>
        <ToolList kind={toolKind} items={filteredItems} busy={busy} onEdit={(item) => setEdit({ kind: toolKind, item: { ...item }, isNew: false })} onDelete={(id) => moveTrash(toolKind, id)} />
      </section>
    </>}

    {tab === "categories" && <section className="rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="text-lg font-bold">カテゴリ管理</h2><div className="mt-5 flex gap-2"><button onClick={() => { setCategoryKind("gpt"); setNewCategory(""); }} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${categoryKind === "gpt" ? "bg-ink text-white" : "bg-cream text-muted"}`}>GPTカテゴリ {initialCategories.filter((x) => x.kind === "gpt").length}</button><button onClick={() => { setCategoryKind("prompt"); setNewCategory(""); }} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${categoryKind === "prompt" ? "bg-ink text-white" : "bg-cream text-muted"}`}>プロンプトカテゴリ {initialCategories.filter((x) => x.kind === "prompt").length}</button></div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void addCategory(); }} placeholder={`新しい${categoryKind === "gpt" ? "GPT" : "プロンプト"}カテゴリ名`} className={inputClass} /><BusyButton onClick={addCategory} busy={busy === "category:add"} disabled={!newCategory.trim() || Boolean(busy)}>{busy === "category:add" ? "追加中…" : "追加"}</BusyButton></div><div className="mt-6 space-y-2">{categoryItems.map((item) => <div key={item.id} className="flex items-center rounded-xl bg-cream px-4 py-3 text-sm"><span className="font-semibold">{item.name}</span><button onClick={() => removeCategory(item.id)} disabled={Boolean(busy)} className="ml-auto rounded-lg p-2 text-muted hover:bg-white hover:text-red-600 disabled:opacity-40"><TrashIcon className="h-4 w-4" /></button></div>)}</div></section>}

    {tab === "settings" && <section className="max-w-2xl rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="text-lg font-bold">サイト設定</h2><label className="mt-5 block text-xs font-bold text-muted">サイト名<input value={site.siteName} onChange={(e) => setSite({ ...site, siteName: e.target.value })} className={inputClass + " mt-2"} /></label><label className="mt-4 block text-xs font-bold text-muted">サブコピー<input value={site.subcopy} onChange={(e) => setSite({ ...site, subcopy: e.target.value })} className={inputClass + " mt-2"} /></label><BusyButton onClick={saveSettings} busy={busy === "settings"} disabled={Boolean(busy)} className="mt-5">{busy === "settings" ? "保存中…" : "設定を保存"}</BusyButton></section>}

    {tab === "trash" && <section className="rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="text-lg font-bold">ゴミ箱</h2><p className="mt-1 text-sm text-muted">間違えて削除した道具やリンクを戻せます。</p><div className="mt-5 space-y-2">{deleted.length ? deleted.map((item) => <div key={`${item.kind}-${item.id}`} className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3"><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold">{item.kind === "gpt" ? "GPT" : item.kind === "prompt" ? "PROMPT" : "LINK"}</span><span className="min-w-0 flex-1 truncate text-sm font-bold">{item.name}</span><button onClick={() => restore(item.kind, item.id)} disabled={Boolean(busy)} className="inline-flex items-center gap-1 text-xs font-bold disabled:opacity-40"><ArrowPathIcon className="h-4 w-4" />{busy === `restore:${item.kind}:${item.id}` ? "復元中…" : "復元"}</button></div>) : <p className="py-8 text-center text-sm text-muted">ゴミ箱は空です</p>}</div></section>}

    {tab === "history" && <section className="rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="text-lg font-bold">最近の変更</h2><div className="mt-5 space-y-2">{logs.length ? logs.map((item) => <div key={item.id} className="flex flex-col gap-1 rounded-xl bg-cream px-4 py-3 text-sm sm:flex-row sm:items-center"><strong>{item.action === "INSERT" ? "追加" : item.action === "UPDATE" ? "更新" : "削除"}</strong><span className="text-muted">{item.tableName} / {item.recordId}</span><time className="text-xs text-muted sm:ml-auto">{new Date(item.createdAt).toLocaleString("ja-JP")}</time></div>) : <p className="py-8 text-center text-sm text-muted">変更履歴はまだありません</p>}</div></section>}

    {tab === "backup" && <section className="max-w-2xl rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="text-lg font-bold">バックアップと復元</h2><p className="mt-2 text-sm leading-6 text-muted">GPT・プロンプト・保存リンクをJSONファイルとして保存できます。</p><div className="mt-5 flex flex-wrap gap-3"><button onClick={exportData} className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white"><ArrowDownTrayIcon className="h-4 w-4" />バックアップを書き出す</button><button onClick={() => importRef.current?.click()} disabled={Boolean(busy)} className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-bold disabled:opacity-50"><InboxArrowDownIcon className="h-4 w-4" />{busy === "import" ? "読み込み中…" : "バックアップから復元"}</button><input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => importData(e.target.files?.[0])} /></div></section>}

    {edit && <EditModal edit={edit} categories={initialCategories} gpts={activeGpts} busy={busy === "save"} change={change} close={close} save={save} />}
    {toast && <div role="status" className="fixed bottom-6 right-6 z-[90] rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white shadow-soft">✓ {toast}</div>}
  </div>;
}

function ToolList({ kind, items, busy, onEdit, onDelete }: { kind: ToolKind; items: ToolItem[]; busy: string | null; onEdit: (item: ToolItem) => void; onDelete: (id: string) => void }) {
  if (!items.length) return <div className="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-muted">この条件に合う項目はありません</div>;
  return <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">{items.map((item) => <div key={item.id} className="flex items-center gap-2 rounded-xl bg-cream p-3"><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{item.name}</div><div className="mt-1 flex items-center gap-2 text-xs text-muted"><span>{item.category}{"label" in item ? ` ・ ${item.label}` : "status" in item ? ` ・ ${item.status}` : ""}</span>{("url" in item) && <span className={`h-2 w-2 rounded-full ${item.url.startsWith("http") ? "bg-green-500" : "bg-red-400"}`} />}</div></div><button onClick={() => onEdit(item)} disabled={Boolean(busy)} aria-label="編集" className="rounded-lg bg-white p-2 disabled:opacity-40"><PencilSquareIcon className="h-4 w-4" /></button><button onClick={() => onDelete(item.id)} disabled={Boolean(busy)} aria-label="削除" className="rounded-lg bg-white p-2 text-muted hover:text-red-600 disabled:opacity-40">{busy === `delete:${kind}:${item.id}` ? <span className="block h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-transparent" /> : <TrashIcon className="h-4 w-4" />}</button></div>)}</div>;
}

function EditModal({ edit, categories, gpts, busy, change, close, save }: { edit: NonNullable<EditState>; categories: CategoryItem[]; gpts: GptItem[]; busy: boolean; change: (key: string, value: unknown) => void; close: () => void; save: () => void }) {
  const item = edit.item, isGpt = edit.kind === "gpt", isPrompt = edit.kind === "prompt";
  const categoryOptions = edit.kind === "link" ? resourceLinkCategories : categories.filter((category) => category.kind === edit.kind).map((category) => category.name);
  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/35 p-4"><div className="mx-auto my-4 w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-soft"><div className="flex items-start"><div><p className="text-xs font-bold tracking-wider text-[#927019]">{isGpt ? "GPT" : isPrompt ? "PROMPT" : "LINK"}</p><h2 className="mt-1 text-xl font-bold">{edit.isNew ? "新しく追加" : "内容を編集"}</h2></div><button onClick={close} disabled={busy} className="ml-auto rounded-xl border border-line p-2 disabled:opacity-40"><XMarkIcon className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="名前"><input value={String(item.name ?? "")} onChange={(e) => change("name", e.target.value)} className={inputClass} /></Field><Field label="カテゴリ"><select value={String(item.category ?? "")} onChange={(e) => change("category", e.target.value)} className={inputClass}>{categoryOptions.map((name) => <option key={name}>{name}</option>)}</select></Field>
    {isGpt && <><Field label="使う場面" wide><textarea value={String(item.useCase ?? "")} onChange={(e) => change("useCase", e.target.value)} rows={2} className={inputClass} /></Field><Field label="最初に投げる言葉" wide><textarea value={String(item.starter ?? "")} onChange={(e) => change("starter", e.target.value)} rows={2} className={inputClass} /></Field><Field label="GPTのURL" wide><input type="url" value={String(item.url ?? "")} onChange={(e) => change("url", e.target.value)} placeholder="https://chatgpt.com/g/..." className={inputClass} /></Field><Field label="関連プロンプト（読点区切り）" wide><input value={Array.isArray(item.relatedPrompts) ? item.relatedPrompts.join("、") : String(item.relatedPrompts ?? "")} onChange={(e) => change("relatedPrompts", e.target.value.split("、").filter(Boolean))} className={inputClass} /></Field><Field label="ラベル"><select value={String(item.label ?? "一軍")} onChange={(e) => change("label", e.target.value)} className={inputClass}><option>一軍</option><option>二軍</option><option>保管</option></select></Field></>}
    {isPrompt && <><Field label="使う場面" wide><textarea value={String(item.useCase ?? "")} onChange={(e) => change("useCase", e.target.value)} rows={2} className={inputClass} /></Field><Field label="プロンプト本文" wide><textarea value={String(item.body ?? "")} onChange={(e) => change("body", e.target.value)} rows={7} className={inputClass} /></Field><Field label="状態"><select value={String(item.status ?? "未検証")} onChange={(e) => change("status", e.target.value)} className={inputClass}><option>一軍</option><option>二軍</option><option>未検証</option><option>要アレンジ</option><option>保管</option></select></Field><Field label="関連GPT"><select value={String(item.relatedGpt ?? "")} onChange={(e) => change("relatedGpt", e.target.value)} className={inputClass}><option value="">選択なし</option>{gpts.map((gpt) => <option key={gpt.id}>{gpt.name}</option>)}</select></Field><Field label="出典メモ" wide><input value={String(item.source ?? "")} onChange={(e) => change("source", e.target.value)} className={inputClass} /></Field></>}
    {!isGpt && !isPrompt && <><Field label="URL" wide><input type="url" value={String(item.url ?? "")} onChange={(e) => change("url", e.target.value)} placeholder="https://..." className={inputClass} /></Field><Field label="説明" wide><textarea value={String(item.description ?? "")} onChange={(e) => change("description", e.target.value)} rows={3} className={inputClass} /></Field><Field label="タグ（読点区切り）" wide><input value={Array.isArray(item.tags) ? item.tags.join("、") : String(item.tags ?? "")} onChange={(e) => change("tags", e.target.value.split(/[、,]/).map((tag) => tag.trim()).filter(Boolean))} className={inputClass} /></Field></>}
    <Field label="表示順"><input type="number" value={Number(item.sortOrder ?? 0)} onChange={(e) => change("sortOrder", Number(e.target.value))} className={inputClass} /></Field><label className="flex items-center gap-2 self-end pb-3 text-sm font-bold"><input type="checkbox" checked={Boolean(item.favorite)} onChange={(e) => change("favorite", e.target.checked)} className="h-4 w-4 accent-[#F9C846]" />お気に入り</label></div><div className="mt-6 flex justify-end gap-2"><button onClick={close} disabled={busy} className="rounded-xl border border-line px-5 py-2.5 text-sm font-bold disabled:opacity-40">キャンセル</button><BusyButton onClick={save} busy={busy} disabled={busy || !String(item.name ?? "").trim()}>{busy ? (edit.isNew ? "追加中…" : "保存中…") : (edit.isNew ? "追加する" : "保存する")}</BusyButton></div></div></div>;
}

function BusyButton({ busy, disabled, className = "", onClick, children }: { busy: boolean; disabled?: boolean; className?: string; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} disabled={disabled || busy} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-55 ${className}`}>{busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}{children}</button>;
}
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`block text-xs font-bold text-muted ${wide ? "sm:col-span-2" : ""}`}><span className="mb-2 block">{label}</span>{children}</label>; }
