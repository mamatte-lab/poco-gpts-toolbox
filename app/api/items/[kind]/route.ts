import { NextResponse } from "next/server";
import { getAuthorizedClient } from "@/lib/api-auth";

const gptData = (x: Record<string, unknown>) => ({
  id: x.id, name: x.name, category: x.category, use_case: x.useCase ?? "", starter: x.starter ?? "",
  related_prompts: Array.isArray(x.relatedPrompts) ? x.relatedPrompts : String(x.relatedPrompts ?? "").split("、").filter(Boolean),
  label: x.label ?? "保管", favorite: Boolean(x.favorite), url: x.url ?? "", sort_order: Number(x.sortOrder ?? 0), added_at: x.addedAt,
});
const promptData = (x: Record<string, unknown>) => ({
  id: x.id, name: x.name, category: x.category, use_case: x.useCase ?? "", body: x.body ?? "", status: x.status ?? "未検証",
  source: x.source ?? "", related_gpt: x.relatedGpt ?? "", favorite: Boolean(x.favorite), sort_order: Number(x.sortOrder ?? 0), added_at: x.addedAt,
});

async function context(kind: string) {
  const supabase = await getAuthorizedClient();
  const table = kind === "gpt" ? "gpts" : kind === "prompt" ? "prompts" : null;
  return { supabase, table };
}

export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params, { supabase, table } = await context(kind);
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); if (!table) return NextResponse.json({ error: "Unknown kind" }, { status: 404 });
  const input = await request.json(); if (!input.name || !input.category) return NextResponse.json({ error: "名前とカテゴリは必須です" }, { status: 400 });
  input.id ||= crypto.randomUUID(); input.addedAt ||= new Date().toISOString().slice(0, 10);
  const payload = kind === "gpt" ? gptData(input) : promptData(input);
  const { error } = await supabase.from(table).insert(payload as never);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true, id: input.id });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params, { supabase, table } = await context(kind);
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); if (!table) return NextResponse.json({ error: "Unknown kind" }, { status: 404 });
  const input = await request.json(); if (!input.id) return NextResponse.json({ error: "IDがありません" }, { status: 400 });
  const payload = kind === "gpt" ? gptData(input) : promptData(input); delete (payload as { id?: unknown }).id;
  const { error } = await supabase.from(table).update(payload as never).eq("id", input.id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params, { supabase, table } = await context(kind);
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); if (!table) return NextResponse.json({ error: "Unknown kind" }, { status: 404 });
  const { id } = await request.json(); const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params, { supabase, table } = await context(kind);
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); if (!table) return NextResponse.json({ error: "Unknown kind" }, { status: 404 });
  const { id } = await request.json(); const { error } = await supabase.from(table).update({ deleted_at: null }).eq("id", id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
