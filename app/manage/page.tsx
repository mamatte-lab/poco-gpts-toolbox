import { PageIntro } from "@/components/PageIntro";
import { ManageDashboard } from "@/components/ManageDashboard";
import { getAuditLogs, getCategories, getGpts, getPrompts, getResourceLinks, getSiteSettings } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ManagePage() {
  const [gpts, prompts, links, categories, settings, logs] = await Promise.all([getGpts({ includeDeleted: true }), getPrompts({ includeDeleted: true }), getResourceLinks({ includeDeleted: true }), getCategories(), getSiteSettings(), getAuditLogs()]);
  return <><PageIntro eyebrow="MANAGE TOOLBOX" title="道具を編集" description="ここで保存した内容はクラウドへ反映され、スマホとPCで共有されます。" />{!isSupabaseConfigured && <div className="mb-6 rounded-2xl border border-[#EBCB68] bg-butter-soft p-4 text-sm leading-6"><strong>現在はデモモードです。</strong> Supabaseを設定すると編集と端末間同期が有効になります。設定手順はREADMEをご覧ください。</div>}<ManageDashboard initialGpts={gpts} initialPrompts={prompts} initialLinks={links} initialCategories={categories} settings={settings} logs={logs} configured={isSupabaseConfigured} /></>;
}
