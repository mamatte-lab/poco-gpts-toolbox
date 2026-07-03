import { PageIntro } from "@/components/PageIntro";
import { ResourceLinkExplorer } from "@/components/ResourceLinks";
import { getResourceLinks } from "@/lib/repository";

export default async function LinksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const links = await getResourceLinks();
  return <><PageIntro eyebrow="LINK LIBRARY" title="リンク保管庫" description="スプレッドシートや特典、note、Notionなど、あとで見返したい資料をまとめて保存できます。" /><ResourceLinkExplorer items={links} initialQuery={q} /></>;
}
