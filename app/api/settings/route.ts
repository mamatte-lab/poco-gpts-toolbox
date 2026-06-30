import { NextResponse } from "next/server";
import { getAuthorizedClient } from "@/lib/api-auth";
export async function PATCH(request: Request) { const supabase = await getAuthorizedClient(); if (!supabase) return NextResponse.json({}, { status: 401 }); const { siteName, subcopy } = await request.json(); const { error } = await supabase.from("site_settings").update({ site_name: siteName, subcopy }).eq("id", 1); return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true }); }

