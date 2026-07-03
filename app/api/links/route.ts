import { NextResponse } from "next/server";
import { getAuthorizedClient } from "@/lib/api-auth";

const linkData = (x: Record<string, unknown>) => ({
  id: x.id,
  name: String(x.name ?? "").trim(),
  url: String(x.url ?? "").trim(),
  category: String(x.category ?? "その他").trim(),
  description: String(x.description ?? "").trim(),
  tags: Array.isArray(x.tags) ? x.tags : String(x.tags ?? "").split(/[、,]/).map((tag) => tag.trim()).filter(Boolean),
  favorite: Boolean(x.favorite),
  sort_order: Number(x.sortOrder ?? 0),
  added_at: x.addedAt,
});

export async function POST(request: Request) {
  const supabase = await getAuthorizedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const input = await request.json();
  if (!input.name || !input.url) return NextResponse.json({ error: "名前とURLは必須です" }, { status: 400 });
  try { new URL(input.url); } catch { return NextResponse.json({ error: "正しいURLを入力してください" }, { status: 400 }); }
  const { data: duplicate } = await supabase.from("resource_links").select("id").eq("url", String(input.url).trim()).is("deleted_at", null).maybeSingle();
  if (duplicate) return NextResponse.json({ error: "同じURLはすでに登録されています" }, { status: 409 });
  input.id ||= crypto.randomUUID(); input.addedAt ||= new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("resource_links").upsert(linkData(input) as never, { onConflict: "id", ignoreDuplicates: true });
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true, id: input.id });
}

export async function PATCH(request: Request) {
  const supabase = await getAuthorizedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const input = await request.json();
  if (!input.id) return NextResponse.json({ error: "IDがありません" }, { status: 400 });
  const payload = linkData(input); delete (payload as { id?: unknown }).id;
  const { error } = await supabase.from("resource_links").update(payload as never).eq("id", input.id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await getAuthorizedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const { error } = await supabase.from("resource_links").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const supabase = await getAuthorizedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const { error } = await supabase.from("resource_links").update({ deleted_at: null }).eq("id", id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
