-- schema.sql実行後、必要に応じて実行してください。
insert into public.gpts (id,name,category,use_case,starter,related_prompts,label,favorite,url,sort_order,added_at) values
('note-structure','NOTE｜記事構成','note','noteの記事構成を考え、読者に伝わる流れを設計する','この記事のテーマは〇〇です',array['STRUCTURE｜note｜有料記事構成'],'一軍',true,'https://chatgpt.com/gpts',10,'2026-06-20'),
('threads-care','Threads｜療育投稿','Threads','療育ママ向けに、共感されるThreads投稿文を作る','今日のテーマは〇〇です',array['CREATE｜Threads｜療育あるある投稿'],'一軍',true,'https://chatgpt.com/gpts',20,'2026-06-18'),
('design-banner','DESIGN｜バナー添削','デザイン添削','バナーの改善点を見つけ、より伝わるデザインに整える','このバナーを添削してほしいです',array['CHECK｜デザイン｜視認性確認'],'一軍',true,'https://chatgpt.com/gpts',30,'2026-06-15'),
('image-prompt','IMG｜画像生成プロンプト','画像生成','目的に合った高品質な画像生成プロンプトを作る','〇〇のイメージ画像がほしいです',array['CREATE｜画像生成｜noteサムネ'],'二軍',false,'https://chatgpt.com/gpts',40,'2026-06-12'),
('line-appe','LINE｜あっぺスタンプ','LINEスタンプ','LINEスタンプの感情・ポーズ・表情を言語化する','〇〇の感情でスタンプ案を出して',array[]::text[],'二軍',false,'https://chatgpt.com/gpts',50,'2026-06-08'),
('biz-product','BIZ｜商品設計','商品設計','コンセプト、ペルソナ、販売導線を整理する','〇〇の商品設計を一緒に考えて',array[]::text[],'保管',false,'https://chatgpt.com/gpts',60,'2026-05-30')
on conflict(id) do nothing;

insert into public.prompts (id,name,category,use_case,body,status,source,related_gpt,favorite,sort_order,added_at) values
('edit-natural','EDIT｜文章｜AIっぽさ除去','文章添削','AIで作った文章が整いすぎて、人間味が薄いとき','プロ編集者として、この文章を会話っぽく自然に整えてください。AIっぽい言い回し、硬さ、テンプレ感を減らしてください。意味は変えず、上から目線や説教っぽさを避けて、人間味と少しの余白を残してください。','一軍','自作・文章調整用','NOTE｜記事構成',true,10,'2026-06-22'),
('threads-ideas','CREATE｜Threads｜療育あるある投稿','SNS投稿','療育・子育てあるあるの投稿案を作りたいとき','以下のリアルな育児・療育メモをもとに、Threads投稿案を10個作ってください。3〜5歳ママ向け、療育寄り、200文字以内、子ども・先生・園を悪く言わない、重くしすぎない、最後はコメントしやすい問いで終えてください。','一軍','自作・Threads用','Threads｜療育投稿',true,20,'2026-06-19'),
('note-paid','STRUCTURE｜note｜有料記事構成','note記事','note記事の流れと有料導線を作りたいとき','以下のテーマでnote記事構成を作ってください。無料部分で共感と問題提起を行い、有料部分では具体的な考え方・手順・事例を提示してください。読後に購入してよかったと思える流れにしてください。','一軍','自作・note執筆用','NOTE｜記事構成',true,30,'2026-06-16'),
('design-visibility','CHECK｜デザイン｜視認性確認','デザイン添削','バナーや図解の読みやすさを確認したいとき','プロのデザイナー、アートディレクター、SNSプランナーとして、この画像の視認性を確認してください。最初に目に入る情報、読みにくい箇所、情報の優先順位、改善案を具体的に出してください。','一軍','SNSで見つけた型をアレンジ','DESIGN｜バナー添削',false,40,'2026-06-13'),
('image-note','CREATE｜画像生成｜noteサムネ','画像生成','note見出し画像を作りたいとき','note記事の見出し画像を作るための画像生成プロンプトを作ってください。記事タイトル、読者に伝えたい感情、掲載場所、サイズ比率、文字量、雰囲気、避けたい表現を整理して、画像生成AIにそのまま入れられる形にしてください。','二軍','自作・画像制作用','IMG｜画像生成プロンプト',false,50,'2026-06-10')
on conflict(id) do nothing;

