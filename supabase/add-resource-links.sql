-- 既存の「ぽこGPT道具箱」にリンク保管庫を追加するため、Supabase SQL Editorで1回実行してください。
create table if not exists public.resource_links (
  id text primary key,
  name text not null,
  url text not null,
  category text not null default 'その他',
  description text not null default '',
  tags text[] not null default '{}',
  favorite boolean not null default false,
  sort_order integer not null default 0,
  added_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists resource_links_active_url_key on public.resource_links(url) where deleted_at is null;

drop trigger if exists resource_links_touch on public.resource_links;
create trigger resource_links_touch before update on public.resource_links for each row execute function public.touch_updated_at();
drop trigger if exists resource_links_audit on public.resource_links;
create trigger resource_links_audit after insert or update or delete on public.resource_links for each row execute function public.write_audit_log();

alter table public.resource_links enable row level security;
drop policy if exists "owner all resource_links" on public.resource_links;
create policy "owner all resource_links" on public.resource_links for all
using (public.is_toolbox_owner()) with check (public.is_toolbox_owner());
