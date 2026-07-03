import { NextResponse } from "next/server";
import { getAuthorizedClient } from "@/lib/api-auth";
export async function POST(request: Request) {
  const supabase = await getAuthorizedClient(); if (!supabase) return NextResponse.json({}, { status: 401 });
  const data = await request.json();
  if (!Array.isArray(data.gpts) || !Array.isArray(data.prompts)) return NextResponse.json({ error: "バックアップ形式が違います" }, { status: 400 });
  const gpts = data.gpts.map((x: Record<string, unknown>) => ({ id: x.id, name: x.name, category: x.category, use_case: x.useCase, starter: x.starter, related_prompts: x.relatedPrompts ?? [], label: x.label, favorite: x.favorite, url: x.url, sort_order: x.sortOrder ?? 0, added_at: x.addedAt, deleted_at: x.deletedAt ?? null }));
  const prompts = data.prompts.map((x: Record<string, unknown>) => ({ id: x.id, name: x.name, category: x.category, use_case: x.useCase, body: x.body, status: x.status, source: x.source, related_gpt: x.relatedGpt, favorite: x.favorite, sort_order: x.sortOrder ?? 0, added_at: x.addedAt, deleted_at: x.deletedAt ?? null }));
  const links = Array.isArray(data.links) ? data.links.map((x: Record<string, unknown>) => ({ id: x.id, name: x.name, url: x.url, category: x.category, description: x.description ?? "", tags: x.tags ?? [], favorite: x.favorite, sort_order: x.sortOrder ?? 0, added_at: x.addedAt, deleted_at: x.deletedAt ?? null })) : [];
  const categories = Array.isArray(data.categories) ? data.categories.map((x: Record<string, unknown>) => ({ id: x.id, kind: x.kind, name: x.name, sort_order: x.sortOrder ?? 0 })) : [];
  const gptResult = await supabase.from("gpts").upsert(gpts);
  const promptResult = await supabase.from("prompts").upsert(prompts);
  const linkResult = links.length ? await supabase.from("resource_links").upsert(links) : { error: null };
  const categoryResult = categories.length ? await supabase.from("categories").upsert(categories) : { error: null };
  const settingsResult = data.settings
    ? await supabase.from("site_settings").update({ site_name: data.settings.siteName, subcopy: data.settings.subcopy }).eq("id", 1)
    : { error: null };
  const error = gptResult.error ?? promptResult.error ?? linkResult.error ?? categoryResult.error ?? settingsResult.error;
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
