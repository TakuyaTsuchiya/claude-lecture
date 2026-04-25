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

-- RLS を無効化（Publishable keyで読み書きするため）
-- 本番運用では Row Level Security のポリシーを作ることが推奨
alter table contacts disable row level security;

-- 初期データ 3件
insert into contacts (name, company, title, email, phone, memo) values
  ('山田 太郎', '株式会社サンプル商事', '代表取締役', 'yamada@example.com', '03-1234-5678', '2026-04-10 経営セミナーで交換。AI活用に興味あり。'),
  ('佐藤 花子', 'クラウドワークス株式会社', 'マーケティング部長', 'sato@example.com', '090-1111-2222', 'BtoBマーケ施策について来月打ち合わせ予定。'),
  ('鈴木 次郎', 'テックスタートアップ合同会社', 'CTO', 'suzuki@example.com', '080-3333-4444', '共通の知人：山田さん経由で紹介。');
