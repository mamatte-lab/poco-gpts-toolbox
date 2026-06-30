# ぽこGPT道具箱

自分だけがメールのログインリンクで利用でき、GPT・プロンプトをサイト上から管理できる個人用ダッシュボードです。データはSupabaseへ保存されるため、スマホとPCで同期され、ブラウザのキャッシュを消しても失われません。

## 主な機能

- メールのマジックリンク認証
- Supabase Row Level Securityによるデータ保護
- GPT・プロンプトの追加／編集／ゴミ箱／復元
- カテゴリ、サイト名、サブコピーの編集
- お気に入り・並び順の端末間同期
- 変更履歴
- JSONバックアップ／復元
- `noindex`による検索エンジン対策

## 1. Supabaseを準備する

1. Supabaseで新しいプロジェクトを作成
2. SQL Editorを開く
3. `supabase/schema.sql` をそのまま実行
4. 続けて `supabase/seed.sql` を実行
5. Authentication → Providers でメール認証が有効になっていることを確認

Google Cloudは使いません。請求設定を追加しなくても、Supabaseのメールログインで運用できます。

## 2. 環境変数を設定する

`.env.example` を `.env.local` として複製し、SupabaseのProject Settings → APIにある値を設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Service Role Keyは使用しません。ブラウザへ公開しないでください。

## 3. ローカルで起動する

Node.js 20以降を用意して実行します。

```bash
npm install
npm run dev
```

Supabase未設定時は既存のサンプルデータを表示するデモモードになります。クラウド編集とログインはSupabase設定後に有効になります。

## 4. URL設定

SupabaseのAuthentication → URL Configurationで以下を設定します。

- Site URL：本番のVercel URL
- Redirect URLs：`http://localhost:3000/auth/callback`
- Redirect URLs：`https://あなたのVercelドメイン/auth/callback`

## 5. Vercelへ公開する

1. GitHubへプッシュ
2. Vercelで `New Project` を押してこのリポジトリを選ぶ
3. Settings → Environment Variables に次の2つを登録する

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

4. Deploy を実行する
5. Vercel の公開URLをコピーして、Supabase の `Authentication → URL Configuration` に追加する

登録する Redirect URL はこれです。

```text
https://あなたのVercelドメイン/auth/callback
```

公開後は、その Vercel URL をスマホでブックマークして使えます。`localhost` は使いません。

サイトはメールログインで保護されます。

## データ管理

ログイン後、サイドバーの「道具を編集」からすべて操作できます。定期的に「バックアップ」タブからJSONを書き出してください。

初期サンプルは `data/toolbox.ts` に残してあり、Supabase未設定時の表示と初期移行の参考として利用します。本番運用中の編集はサイト画面から行います。
