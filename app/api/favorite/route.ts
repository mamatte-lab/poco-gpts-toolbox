import { NextResponse } from "next/server";
import { getAuthorizedClient } from "@/lib/api-auth";

export async function PATCH(request: Request) {
  const supabase = await getAuthorizedClient(); if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, type, favorite } = await request.json();
  if (!id || !["gpt", "prompt", "link"].includes(type) || typeof favorite !== "boolean") return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const table = type === "gpt" ? "gpts" : type === "prompt" ? "prompts" : "resource_links";
  const { error } = await supabase.from(table).update({ favorite }).eq("id", id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
