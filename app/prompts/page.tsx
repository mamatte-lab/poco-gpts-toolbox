import { PromptExplorer } from "@/components/Explorers";
import { PageIntro } from "@/components/PageIntro";
import { getCategories, getGpts, getPrompts } from "@/lib/repository";

export default async function PromptsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [prompts, gpts, categories] = await Promise.all([getPrompts(), getGpts(), getCategories()]);
  return <><PageIntro eyebrow="PROMPT DRAWER" title="プロンプトの引き出し" description="よく使う型も、SNSで見つけた良い言葉もここへ。コピーして、そのまま仕事を始められます。" /><PromptExplorer items={prompts} gpts={gpts} categories={categories.filter((x) => x.kind === "prompt").map((x) => x.name)} initialQuery={q} /></>;
}
