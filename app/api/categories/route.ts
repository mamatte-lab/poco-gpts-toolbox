import { NextResponse } from "next/server";
import { getAuthorizedClient } from "@/lib/api-auth";

export async function POST(request: Request) { const supabase = await getAuthorizedClient(); if (!supabase) return NextResponse.json({}, { status: 401 }); const input = await request.json(); const { error } = await supabase.from("categories").insert({ kind: input.kind, name: input.name, sort_order: input.sortOrder ?? 0 }); return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true }); }
export async function PATCH(request: Request) { const supabase = await getAuthorizedClient(); if (!supabase) return NextResponse.json({}, { status: 401 }); const input = await request.json(); const { error } = await supabase.from("categories").update({ name: input.name, sort_order: input.sortOrder ?? 0 }).eq("id", input.id); return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true }); }
export async function DELETE(request: Request) { const supabase = await getAuthorizedClient(); if (!supabase) return NextResponse.json({}, { status: 401 }); const { id } = await request.json(); const { error } = await supabase.from("categories").delete().eq("id", id); return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true }); }

