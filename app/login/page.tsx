"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const login = async () => {
    setLoading(true);
    setSent(false);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cream p-5">
      <section className="w-full max-w-md rounded-[32px] border border-line bg-white p-8 text-center shadow-soft">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-butter-soft text-3xl">🧰</div>
        <p className="text-xs font-bold tracking-[.16em] text-[#9A7313]">PRIVATE TOOLBOX</p>
        <h1 className="mt-2 text-2xl font-bold">ぽこGPT道具箱</h1>
        <p className="mt-3 text-sm leading-6 text-muted">メールに届くログインリンクで入れます。Google Cloud の設定は不要です。</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="mt-6 w-full rounded-2xl border border-line bg-[#FCFAF3] px-4 py-3 text-sm outline-none ring-0 placeholder:text-muted focus:border-butter"
        />
        <button
          onClick={login}
          disabled={loading || !email}
          className="mt-4 w-full rounded-2xl bg-ink px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "送信中…" : "ログインリンクを送る"}
        </button>
        {sent ? <p className="mt-3 text-sm text-[#8A6A18]">メールを送りました。届いたリンクを開くとログインできます。</p> : null}
        <p className="mt-5 text-xs leading-5 text-muted">このサイトは自分だけが使う個人用ダッシュボードです。</p>
      </section>
    </main>
  );
}
