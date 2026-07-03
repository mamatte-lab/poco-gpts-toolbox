import { gpts as fallbackGpts, prompts as fallbackPrompts, gptCategories, promptCategories } from "@/data/toolbox";
import type { AuditLog, CategoryItem, GptItem, PromptItem, ResourceLink, SiteSettings } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const mapGpt = (x: Record<string, unknown>): GptItem => ({
  id: String(x.id), name: String(x.name), category: String(x.category), useCase: String(x.use_case ?? ""),
  starter: String(x.starter ?? ""), relatedPrompts: (x.related_prompts as string[]) ?? [], label: x.label as GptItem["label"],
  favorite: Boolean(x.favorite), url: String(x.url ?? ""), addedAt: String(x.added_at ?? ""), sortOrder: Number(x.sort_order ?? 0),
  updatedAt: String(x.updated_at ?? ""), deletedAt: x.deleted_at ? String(x.deleted_at) : null,
});
const mapPrompt = (x: Record<string, unknown>): PromptItem => ({
  id: String(x.id), name: String(x.name), category: String(x.category), useCase: String(x.use_case ?? ""), body: String(x.body ?? ""),
  status: x.status as PromptItem["status"], source: String(x.source ?? ""), relatedGpt: String(x.related_gpt ?? ""), favorite: Boolean(x.favorite),
  addedAt: String(x.added_at ?? ""), sortOrder: Number(x.sort_order ?? 0), updatedAt: String(x.updated_at ?? ""), deletedAt: x.deleted_at ? String(x.deleted_at) : null,
});
const mapResourceLink = (x: Record<string, unknown>): ResourceLink => ({
  id: String(x.id), name: String(x.name), url: String(x.url), category: String(x.category ?? "その他"),
  description: String(x.description ?? ""), tags: (x.tags as string[]) ?? [], favorite: Boolean(x.favorite),
  addedAt: String(x.added_at ?? ""), sortOrder: Number(x.sort_order ?? 0), updatedAt: String(x.updated_at ?? ""),
  deletedAt: x.deleted_at ? String(x.deleted_at) : null,
});

export async function getGpts(options: { includeDeleted?: boolean } = {}): Promise<GptItem[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackGpts;
  let query = supabase.from("gpts").select("*").order("sort_order").order("updated_at", { ascending: false });
  if (!options.includeDeleted) query = query.is("deleted_at", null);
  const { data } = await query;
  return data?.map((x) => mapGpt(x)) ?? [];
}

export async function getPrompts(options: { includeDeleted?: boolean } = {}): Promise<PromptItem[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackPrompts;
  let query = supabase.from("prompts").select("*").order("sort_order").order("updated_at", { ascending: false });
  if (!options.includeDeleted) query = query.is("deleted_at", null);
  const { data } = await query;
  return data?.map((x) => mapPrompt(x)) ?? [];
}

export async function getResourceLinks(options: { includeDeleted?: boolean } = {}): Promise<ResourceLink[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase.from("resource_links").select("*").order("sort_order").order("updated_at", { ascending: false });
  if (!options.includeDeleted) query = query.is("deleted_at", null);
  const { data } = await query;
  return data?.map((x) => mapResourceLink(x)) ?? [];
}

export async function getCategories(): Promise<CategoryItem[]> {
  const supabase = await createClient();
  if (!supabase) return [...gptCategories.map((name, i) => ({ id: `g-${i}`, kind: "gpt" as const, name, sortOrder: i })), ...promptCategories.map((name, i) => ({ id: `p-${i}`, kind: "prompt" as const, name, sortOrder: i }))];
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data?.map((x) => ({ id: String(x.id), kind: x.kind as "gpt" | "prompt", name: String(x.name), sortOrder: Number(x.sort_order) })) ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback = { siteName: "ぽこGPT道具箱", subcopy: "増えてきたGPTとプロンプトを、すぐ使える道具箱に。" };
  const supabase = await createClient(); if (!supabase) return fallback;
  const { data } = await supabase.from("site_settings").select("site_name,subcopy").eq("id", 1).maybeSingle();
  return data ? { siteName: data.site_name, subcopy: data.subcopy } : fallback;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = await createClient(); if (!supabase) return [];
  const { data } = await supabase.from("audit_logs").select("id,table_name,record_id,action,changed_by,created_at").order("created_at", { ascending: false }).limit(50);
  return data?.map((x) => ({ id: x.id, tableName: x.table_name, recordId: x.record_id, action: x.action, changedBy: x.changed_by ?? "", createdAt: x.created_at })) ?? [];
}
