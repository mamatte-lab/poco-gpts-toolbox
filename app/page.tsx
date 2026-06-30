import Link from "next/link";
import { ArrowRightIcon, InboxStackIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { GptCard, PromptCard } from "@/components/Cards";
import { getGpts, getPrompts } from "@/lib/repository";

function SectionTitle({ title, sub, href, link }: { title: string; sub: string; href: string; link: string }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-muted">{sub}</p></div><Link href={href} className="hidden items-center gap-1 text-sm font-bold text-[#89660D] sm:flex">{link}<ArrowRightIcon className="h-4 w-4" /></Link></div>;
}

export default async function HomePage() {
  const [gpts, prompts] = await Promise.all([getGpts(), getPrompts()]);
  const recent = [...gpts.map((x) => ({ ...x, kind: "GPT" })), ...prompts.map((x) => ({ ...x, kind: "プロンプト" }))].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 4);
  return <>
    <section className="relative mb-10 overflow-hidden rounded-[34px] bg-[#FFE791] px-6 py-8 shadow-card sm:px-10 sm:py-10">
      <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/35" /><div className="absolute bottom-[-80px] right-40 h-40 w-40 rounded-full bg-[#F7C84B]/50" />
      <div className="relative max-w-2xl"><span className="mb-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold">今日も、いい道具をすぐそばに。</span><h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">さて、今日は<br className="sm:hidden" />何をつくろう？</h1><p className="mt-3 text-sm leading-6 text-[#67582F] sm:text-base">よく使うGPTとプロンプトから、いつもの仕事をすぐ始められます。</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/gpts" className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white"><SparklesIcon className="h-5 w-5" />GPTを選ぶ</Link><Link href="/prompts" className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-3 text-sm font-bold"><InboxStackIcon className="h-5 w-5" />引き出しを開く</Link></div></div>
    </section>

    <section className="mb-11"><SectionTitle title="よく使うGPT" sub="一軍の道具を手前に並べました" href="/gpts" link="すべて見る" /><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{gpts.filter((x) => x.label === "一軍").slice(0, 3).map((x) => <GptCard key={x.id} item={x} />)}</div></section>
    <section className="mb-11"><SectionTitle title="よく使うプロンプト" sub="コピーしたら、そのまま使えます" href="/prompts" link="引き出しを見る" /><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{prompts.filter((x) => x.status === "一軍").slice(0, 3).map((x) => <PromptCard key={x.id} item={x} />)}</div></section>
    <section><SectionTitle title="最近追加したもの" sub="新しく道具箱に入ったアイテム" href="/search?q=" link="まとめて見る" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{recent.map((x) => <Link key={`${x.kind}-${x.id}`} href={x.kind === "GPT" ? "/gpts" : "/prompts"} className="rounded-2xl border border-line bg-white p-4 shadow-card transition hover:border-butter"><span className="text-[11px] font-bold text-[#927019]">{x.kind}</span><div className="mt-1 truncate text-sm font-bold">{x.name}</div><div className="mt-2 text-xs text-muted">{x.addedAt.replaceAll("-", ".")}</div></Link>)}</div></section>
  </>;
}
