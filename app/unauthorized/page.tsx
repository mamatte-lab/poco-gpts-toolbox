export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream p-5">
      <section className="max-w-md rounded-[30px] bg-white p-8 text-center shadow-soft">
        <div className="text-4xl">🔐</div>
        <h1 className="mt-4 text-xl font-bold">このページには入れません</h1>
        <p className="mt-3 text-sm leading-6 text-muted">いったんログアウトして、ログインリンクから入り直してください。</p>
      </section>
    </main>
  );
}
