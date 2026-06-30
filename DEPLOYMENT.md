# Vercel公開メモ

このプロジェクトをスマホからも使うには、`localhost` ではなく Vercel に公開する。

## 1. 先にGitHubへ置く

このフォルダを GitHub リポジトリに push する。

## 2. Vercelで公開する

1. Vercel にログインする
2. `New Project` を押す
3. この GitHub リポジトリを選ぶ
4. Environment Variables に次を入れる

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

5. Deploy を押す

## 3. SupabaseのURL設定

Supabase の `Authentication → URL Configuration` に次を追加する。

```text
https://あなたのVercelドメイン/auth/callback
```

ローカル開発用に使うなら、これも残してよい。

```text
http://127.0.0.1:3001/auth/callback
```

## 4. 使い方

- Vercel の本番URLをスマホでブックマークする
- そのURLを開いてメールログインする
- `localhost` は使わない
