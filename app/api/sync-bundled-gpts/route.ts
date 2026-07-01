import { NextResponse } from "next/server";
import { addedGpts20260701 } from "@/data/gpts-2026-07-01";
import { getAuthorizedClient } from "@/lib/api-auth";

export async function POST() {
  const supabase = await getAuthorizedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = [...new Set(addedGpts20260701.map((item) => item.category))].map((name, index) => ({
    kind: "gpt",
    name,
    sort_order: 200 + index * 10,
  }));
  const items = addedGpts20260701.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    use_case: item.useCase,
    starter: item.starter,
    related_prompts: item.relatedPrompts,
    label: item.label,
    favorite: item.favorite,
    url: item.url,
    sort_order: item.sortOrder ?? 0,
    added_at: item.addedAt,
  }));

  const categoryResult = await supabase.from("categories").upsert(categories as never, { onConflict: "kind,name", ignoreDuplicates: true });
  if (categoryResult.error) return NextResponse.json({ error: categoryResult.error.message }, { status: 400 });
  const itemResult = await supabase.from("gpts").upsert(items as never, { onConflict: "id", ignoreDuplicates: true });
  if (itemResult.error) return NextResponse.json({ error: itemResult.error.message }, { status: 400 });

  return NextResponse.json({ ok: true, count: items.length });
}
