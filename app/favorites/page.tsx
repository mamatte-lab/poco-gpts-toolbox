import { PageIntro } from "@/components/PageIntro";
import { GptCard, PromptCard } from "@/components/Cards";
import { EmptyState } from "@/components/ui";
import { ResourceLinkCard } from "@/components/ResourceLinks";
import { getGpts, getPrompts, getResourceLinks } from "@/lib/repository";

export default async function FavoritesPage() {
  const [allGpts, allPrompts, allLinks] = await Promise.all([getGpts(), getPrompts(), getResourceLinks()]);
  const gpts = allGpts.filter((x) => x.favorite), prompts = allPrompts.filter((x) => x.favorite), links = allLinks.filter((x) => x.favorite);
  return <><PageIntro eyebrow="FAVORITES" title="お気に入り" description="お気に入りはクラウドに保存され、スマホとPCで同じ状態になります。" />
    {gpts.length + prompts.length + links.length === 0 ? <EmptyState title="お気に入りはまだありません" text="GPT・プロンプト・リンクの星を押すと、ここに並びます。" /> : <>
      {gpts.length > 0 && <section className="mb-10"><h2 className="mb-4 text-lg font-bold">お気に入りGPT <span className="ml-1 text-sm text-muted">{gpts.length}</span></h2><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{gpts.map((x) => <GptCard key={x.id} item={x} />)}</div></section>}
      {prompts.length > 0 && <section className="mb-10"><h2 className="mb-4 text-lg font-bold">お気に入りプロンプト <span className="ml-1 text-sm text-muted">{prompts.length}</span></h2><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{prompts.map((x) => <PromptCard key={x.id} item={x} gptUrl={allGpts.find((g) => g.name === x.relatedGpt)?.url} />)}</div></section>}
      {links.length > 0 && <section><h2 className="mb-4 text-lg font-bold">お気に入りリンク <span className="ml-1 text-sm text-muted">{links.length}</span></h2><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{links.map((x) => <ResourceLinkCard key={x.id} item={x} />)}</div></section>}
    </>}
  </>;
}
