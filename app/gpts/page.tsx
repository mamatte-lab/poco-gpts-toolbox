import { GptExplorer } from "@/components/Explorers";
import { PageIntro } from "@/components/PageIntro";
import { getCategories, getGpts } from "@/lib/repository";

export default async function GptsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [gpts, categories] = await Promise.all([getGpts(), getCategories()]);
  return <><PageIntro eyebrow="MY GPTs" title="すべてのGPT" description="使いたい場面から選んで、最初のひとことをコピー。迷わずすぐに使い始められます。" /><GptExplorer items={gpts} categories={categories.filter((x) => x.kind === "gpt").map((x) => x.name)} initialQuery={q} /></>;
}
