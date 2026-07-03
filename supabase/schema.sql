-- ぽこGPT道具箱：Supabase SQL Editorで一度だけ実行してください。
create extension if not exists pgcrypto;

create or replace function public.is_toolbox_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null;
$$;

create table if not exists public.gpts (
  id text primary key,
  name text not null,
  category text not null default 'その他',
  use_case text not null default '',
  starter text not null default '',
  related_prompts text[] not null default '{}',
  label text not null default '保管' check (label in ('一軍','二軍','保管')),
  favorite boolean not null default false,
  url text not null default '',
  sort_order integer not null default 0,
  added_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.prompts (
  id text primary key,
  name text not null,
  category text not null default 'その他',
  use_case text not null default '',
  body text not null default '',
  status text not null default '未検証' check (status in ('一軍','二軍','未検証','要アレンジ','保管')),
  source text not null default '',
  related_gpt text not null default '',
  favorite boolean not null default false,
  sort_order integer not null default 0,
  added_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

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

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('gpt','prompt')),
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(kind, name)
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'ぽこGPT道具箱',
  subcopy text not null default '増えてきたGPTとプロンプトを、すぐ使える道具箱に。',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id text not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  changed_by text,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs(table_name, record_id, action, before_data, after_data, changed_by)
  values (
    tg_table_name,
    coalesce(new.id::text, old.id::text),
    tg_op,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end,
    auth.jwt() ->> 'email'
  );
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

drop trigger if exists gpts_touch on public.gpts;
create trigger gpts_touch before update on public.gpts for each row execute function public.touch_updated_at();
drop trigger if exists prompts_touch on public.prompts;
create trigger prompts_touch before update on public.prompts for each row execute function public.touch_updated_at();
drop trigger if exists resource_links_touch on public.resource_links;
create trigger resource_links_touch before update on public.resource_links for each row execute function public.touch_updated_at();
drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();
drop trigger if exists gpts_audit on public.gpts;
create trigger gpts_audit after insert or update or delete on public.gpts for each row execute function public.write_audit_log();
drop trigger if exists prompts_audit on public.prompts;
create trigger prompts_audit after insert or update or delete on public.prompts for each row execute function public.write_audit_log();
drop trigger if exists resource_links_audit on public.resource_links;
create trigger resource_links_audit after insert or update or delete on public.resource_links for each row execute function public.write_audit_log();

alter table public.gpts enable row level security;
alter table public.prompts enable row level security;
alter table public.resource_links enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

do $$
declare t text;
begin
  foreach t in array array['gpts','prompts','resource_links','categories','site_settings','audit_logs'] loop
    execute format('drop policy if exists "owner all %s" on public.%I', t, t);
    execute format('create policy "owner all %s" on public.%I for all using (public.is_toolbox_owner()) with check (public.is_toolbox_owner())', t, t);
  end loop;
end $$;

-- 初期カテゴリ
insert into public.categories(kind, name, sort_order) values
('gpt','note',10),('gpt','Threads',20),('gpt','Instagram',30),('gpt','LINE',40),('gpt','Brain',50),
('gpt','Substack',60),('gpt','デザイン制作',70),('gpt','デザイン添削',80),('gpt','画像生成',90),
('gpt','LINEスタンプ',100),('gpt','商品設計',110),('gpt','師匠相談文',120),('gpt','ラジオ台本',130),('gpt','その他',140),
('prompt','SNS投稿',10),('prompt','note記事',20),('prompt','文章添削',30),('prompt','デザイン添削',40),
('prompt','画像生成',50),('prompt','LINEスタンプ',60),('prompt','商品設計',70),('prompt','リサーチ',80),
('prompt','師匠相談文',90),('prompt','ラジオ台本',100),('prompt','AIっぽさ除去',110),('prompt','その他',120)
on conflict(kind, name) do nothing;
