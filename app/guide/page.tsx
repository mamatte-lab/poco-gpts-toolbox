import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PageIntro } from "@/components/PageIntro";

const steps = [
  { n: "01", emoji: "🔎", title: "使う場面から探す", text: "検索窓に「note」「バナー」「療育」など、今やりたいことを入れます。カテゴリやラベルで絞り込むこともできます。" },
  { n: "02", emoji: "📋", title: "最初の言葉をコピー", text: "GPTカードなら最初に投げる言葉、プロンプトカードなら本文をコピー。準備で迷う時間を減らします。" },
  { n: "03", emoji: "✨", title: "GPTを開いて使う", text: "「GPTを開く」「GPTで使う」から目的のGPTへ移動。〇〇の部分や素材を置き換えたら、すぐ開始できます。" },
];

export default function GuidePage() {
  return <><PageIntro eyebrow="HOW TO USE" title="使い方ガイド" description="ぽこGPT道具箱は、きれいに集めるためではなく、すぐ使い始めるための場所です。" />
    <div className="grid gap-5 lg:grid-cols-3">{steps.map((s) => <section key={s.n} className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-card"><span className="absolute right-5 top-3 text-5xl font-black text-cream">{s.n}</span><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-butter-soft text-xl">{s.emoji}</div><h2 className="text-lg font-bold">{s.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{s.text}</p></section>)}</div>
    <section className="mt-7 rounded-[30px] bg-ink p-6 text-white sm:p-8"><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><span className="text-xs font-bold tracking-wider text-butter">TINY TIPS</span><h2 className="mt-2 text-xl font-bold">一軍だけに絞ると、さらに速い。</h2><p className="mt-2 text-sm leading-6 text-white/65">よく使うものには星を付け、調整中のものは「要アレンジ」へ。道具箱の手前を軽く保つのがコツです。</p></div><Link href="/favorites" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-butter px-5 py-3 text-sm font-bold text-ink">お気に入りを見る<ArrowRightIcon className="h-4 w-4" /></Link></div></section>
    <section className="mt-7 rounded-[28px] border border-line bg-white p-6 shadow-card sm:p-8"><h2 className="text-lg font-bold">データを追加・編集したいとき</h2><p className="mt-3 text-sm leading-7 text-muted">サイドバーの「道具を編集」を開きます。GPT・プロンプトの追加、カテゴリ、サイト名、ゴミ箱、変更履歴、バックアップまで画面から操作できます。保存内容はクラウドへ反映され、スマホとPCで共有されます。</p><Link href="/manage" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white">編集画面を開く<ArrowRightIcon className="h-4 w-4" /></Link></section>
  </>;
}
