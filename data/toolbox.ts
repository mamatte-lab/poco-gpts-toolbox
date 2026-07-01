import type { GptItem, PromptItem } from "@/lib/types";
import { addedGpts20260701 } from "@/data/gpts-2026-07-01";

// 新しいGPTはこの配列に1件追加するだけで画面へ反映されます。
export const gpts: GptItem[] = [
  { id: "note-structure", name: "NOTE｜記事構成", category: "note", useCase: "noteの記事構成を考え、読者に伝わる流れを設計する", starter: "この記事のテーマは〇〇です", relatedPrompts: ["STRUCTURE｜note｜有料記事構成"], label: "一軍", favorite: true, url: "https://chatgpt.com/gpts", addedAt: "2026-06-20" },
  { id: "threads-care", name: "Threads｜療育投稿", category: "Threads", useCase: "療育ママ向けに、共感されるThreads投稿文を作る", starter: "今日のテーマは〇〇です", relatedPrompts: ["CREATE｜Threads｜療育あるある投稿"], label: "一軍", favorite: true, url: "https://chatgpt.com/gpts", addedAt: "2026-06-18" },
  { id: "design-banner", name: "DESIGN｜バナー添削", category: "デザイン添削", useCase: "バナーの改善点を見つけ、より伝わるデザインに整える", starter: "このバナーを添削してほしいです", relatedPrompts: ["CHECK｜デザイン｜視認性確認"], label: "一軍", favorite: true, url: "https://chatgpt.com/gpts", addedAt: "2026-06-15" },
  { id: "image-prompt", name: "IMG｜画像生成プロンプト", category: "画像生成", useCase: "目的に合った高品質な画像生成プロンプトを作る", starter: "〇〇のイメージ画像がほしいです", relatedPrompts: ["CREATE｜画像生成｜noteサムネ"], label: "二軍", favorite: false, url: "https://chatgpt.com/gpts", addedAt: "2026-06-12" },
  { id: "line-appe", name: "LINE｜あっぺスタンプ", category: "LINEスタンプ", useCase: "LINEスタンプの感情・ポーズ・表情を言語化する", starter: "〇〇の感情でスタンプ案を出して", relatedPrompts: [], label: "二軍", favorite: false, url: "https://chatgpt.com/gpts", addedAt: "2026-06-08" },
  { id: "biz-product", name: "BIZ｜商品設計", category: "商品設計", useCase: "コンセプト、ペルソナ、販売導線を整理する", starter: "〇〇の商品設計を一緒に考えて", relatedPrompts: [], label: "保管", favorite: false, url: "https://chatgpt.com/gpts", addedAt: "2026-05-30" },
  ...addedGpts20260701,
];

// 新しいプロンプトも同様に、この配列へ追加できます。
export const prompts: PromptItem[] = [
  { id: "edit-natural", name: "EDIT｜文章｜AIっぽさ除去", category: "文章添削", useCase: "AIで作った文章が整いすぎて、人間味が薄いとき", status: "一軍", body: "プロ編集者として、この文章を会話っぽく自然に整えてください。AIっぽい言い回し、硬さ、テンプレ感を減らしてください。意味は変えず、上から目線や説教っぽさを避けて、人間味と少しの余白を残してください。", source: "自作・文章調整用", relatedGpt: "NOTE｜記事構成", favorite: true, addedAt: "2026-06-22" },
  { id: "threads-ideas", name: "CREATE｜Threads｜療育あるある投稿", category: "SNS投稿", useCase: "療育・子育てあるあるの投稿案を作りたいとき", status: "一軍", body: "以下のリアルな育児・療育メモをもとに、Threads投稿案を10個作ってください。3〜5歳ママ向け、療育寄り、200文字以内、子ども・先生・園を悪く言わない、重くしすぎない、最後はコメントしやすい問いで終えてください。", source: "自作・Threads用", relatedGpt: "Threads｜療育投稿", favorite: true, addedAt: "2026-06-19" },
  { id: "note-paid", name: "STRUCTURE｜note｜有料記事構成", category: "note記事", useCase: "note記事の流れと有料導線を作りたいとき", status: "一軍", body: "以下のテーマでnote記事構成を作ってください。無料部分で共感と問題提起を行い、有料部分では具体的な考え方・手順・事例を提示してください。読後に購入してよかったと思える流れにしてください。", source: "自作・note執筆用", relatedGpt: "NOTE｜記事構成", favorite: true, addedAt: "2026-06-16" },
  { id: "design-visibility", name: "CHECK｜デザイン｜視認性確認", category: "デザイン添削", useCase: "バナーや図解の読みやすさを確認したいとき", status: "一軍", body: "プロのデザイナー、アートディレクター、SNSプランナーとして、この画像の視認性を確認してください。最初に目に入る情報、読みにくい箇所、情報の優先順位、改善案を具体的に出してください。", source: "SNSで見つけた型をアレンジ", relatedGpt: "DESIGN｜バナー添削", favorite: false, addedAt: "2026-06-13" },
  { id: "image-note", name: "CREATE｜画像生成｜noteサムネ", category: "画像生成", useCase: "note見出し画像を作りたいとき", status: "二軍", body: "note記事の見出し画像を作るための画像生成プロンプトを作ってください。記事タイトル、読者に伝えたい感情、掲載場所、サイズ比率、文字量、雰囲気、避けたい表現を整理して、画像生成AIにそのまま入れられる形にしてください。", source: "自作・画像制作用", relatedGpt: "IMG｜画像生成プロンプト", favorite: false, addedAt: "2026-06-10" },
];

export const gptCategories = ["note", "Threads", "Instagram", "LINE", "Brain", "Substack", "デザイン制作", "デザイン添削", "画像生成", "LINEスタンプ", "商品設計", "師匠相談文", "ラジオ台本", "その他"];
export const promptCategories = ["SNS投稿", "note記事", "文章添削", "デザイン添削", "画像生成", "LINEスタンプ", "商品設計", "リサーチ", "師匠相談文", "ラジオ台本", "AIっぽさ除去", "その他"];
