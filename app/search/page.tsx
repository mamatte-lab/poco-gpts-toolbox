import Link from "next/link";
import { GptCard, PromptCard } from "@/components/Cards";
import { PageIntro } from "@/components/PageIntro";
import { EmptyState } from "@/components/ui";
import { getGpts, getPrompts } from "@/lib/repository";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams; const needle = q.toLowerCase();
  const [gpts, prompts] = await Promise.all([getGpts(), getPrompts()]);
  const fg = gpts.filter((x) => `${x.name} ${x.category} ${x.useCase} ${x.starter}`.toLowerCase().includes(needle));
  const fp = prompts.filter((x) => `${x.name} ${x.category} ${x.useCase} ${x.body}`.toLowerCase().includes(needle));
  return <><PageIntro eyebrow="SEARCH" title={`「${q}」の検索結果`} description={`GPTとプロンプトから ${fg.length + fp.length} 件見つかりました。`} />{!q || fg.length + fp.length === 0 ? <EmptyState /> : <>{fg.length > 0 && <section className="mb-10"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">GPT <span className="text-sm text-muted">{fg.length}件</span></h2><Link href={`/gpts?q=${encodeURIComponent(q)}`} className="text-sm font-bold text-[#89660D]">GPTだけで見る</Link></div><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{fg.map((x) => <GptCard key={x.id} item={x} />)}</div></section>}{fp.length > 0 && <section><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">プロンプト <span className="text-sm text-muted">{fp.length}件</span></h2><Link href={`/prompts?q=${encodeURIComponent(q)}`} className="text-sm font-bold text-[#89660D]">プロンプトだけで見る</Link></div><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{fp.map((x) => <PromptCard key={x.id} item={x} />)}</div></section>}</>}</>;
}
