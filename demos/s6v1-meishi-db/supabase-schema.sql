-- =========================================================
-- S6V1 名刺管理アプリ — Supabase テーブル定義
-- Supabase Dashboard → SQL Editor に貼り付けて実行する
-- =========================================================

-- contacts テーブル作成
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  title text,
  email text,
  phone text,
  memo text,
  created_at timestamptz not null default now()
);

-- RLS（Row Level Security）を有効化
alter table contacts enable row level security;

-- ポリシーを設定（教材用：Publishable key から全操作を許可する最小ポリシー）
-- 実サービスで公開するときは「認証済みユーザーのみが自分のデータを操作できる」等の厳密な制約をかける
create policy "anon read"   on contacts for select to anon using (true);
create policy "anon insert" on contacts for insert to anon with check (true);
create policy "anon update" on contacts for update to anon using (true);
create policy "anon delete" on contacts for delete to anon using (true);

-- 初期データ 3件
insert into contacts (name, company, title, email, phone, memo) values
  ('山田 太郎', '株式会社サンプル商事', '代表取締役', 'yamada@example.com', '03-1234-5678', '2026-04-10 経営セミナーで交換。AI活用に興味あり。'),
  ('佐藤 花子', 'クラウドワークス株式会社', 'マーケティング部長', 'sato@example.com', '090-1111-2222', 'BtoBマーケ施策について来月打ち合わせ予定。'),
  ('鈴木 次郎', 'テックスタートアップ合同会社', 'CTO', 'suzuki@example.com', '080-3333-4444', '共通の知人：山田さん経由で紹介。');
