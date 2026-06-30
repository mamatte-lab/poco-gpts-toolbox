import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { getCategories, getGpts, getPrompts } from "@/lib/repository";

const dots: Record<string, string> = { "一軍": "bg-butter", "二軍": "bg-[#A9CEE3]", "未検証": "bg-[#A9CEE3]", "要アレンジ": "bg-[#EEB17C]", "保管": "bg-[#C9C7BF]" };

export default async function LabelsPage() {
  const [gpts, prompts, categories] = await Promise.all([getGpts(), getPrompts(), getCategories()]);
  const statuses = ["一軍", "二軍", "未検証", "要アレンジ", "保管"];
  return <><PageIntro eyebrow="LABELS" title="ラベル管理" description="道具箱で使っている分類の状況です。追加や削除は編集画面から行えます。" action={<Link href="/manage?tab=categories" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white">カテゴリを編集</Link>} />
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="mb-1 text-lg font-bold">状態ラベル</h2><p className="mb-5 text-sm text-muted">今の立ち位置をひと目で判断</p><div className="space-y-2">{statuses.map((x) => { const count = gpts.filter((g) => g.label === x).length + prompts.filter((p) => p.status === x).length; return <div key={x} className="flex items-center rounded-2xl bg-cream px-4 py-3"><span className={`mr-3 h-3 w-3 rounded-full ${dots[x]}`} /><span className="font-bold">{x}</span><span className="ml-auto text-sm text-muted">{count}件</span></div>; })}</div></section>
      <section className="rounded-[28px] border border-line bg-white p-6 shadow-card"><h2 className="mb-1 text-lg font-bold">カテゴリ</h2><p className="mb-5 text-sm text-muted">使う目的ごとの仕分け</p><h3 className="mb-3 text-xs font-bold tracking-wider text-muted">GPT</h3><div className="mb-6 flex flex-wrap gap-2">{categories.filter((x) => x.kind === "gpt").map((x) => <span key={x.id} className="rounded-full border border-line bg-cream px-3 py-1.5 text-sm">{x.name}</span>)}</div><h3 className="mb-3 text-xs font-bold tracking-wider text-muted">プロンプト</h3><div className="flex flex-wrap gap-2">{categories.filter((x) => x.kind === "prompt").map((x) => <span key={x.id} className="rounded-full border border-line bg-cream px-3 py-1.5 text-sm">{x.name}</span>)}</div></section>
    </div>
  </>;
}
