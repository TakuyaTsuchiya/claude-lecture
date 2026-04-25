# PROMPT — S6V1 Vite + Supabase 移行

以下をClaude Codeにそのまま貼って渡すと、Vite導入・Supabase接続・SQL生成・規約ドキュメント更新まで一括で実行される。
教材S6V1の実演で使うフル版プロンプト。スライドには要約版を表示し、実演時はこのファイルを貼り付ける運用。

---

これから名刺管理アプリにデータベース連携を追加します。
今は localStorage で動いていますが、Supabase に接続して「ブラウザを閉じても消えない」永続化に置き換えます。
以下をすべて実行してください。

## 前提
- 現状：Vanilla HTML + JS + Tailwind CDN + localStorage
- 目標：Vite + Supabase に移行する

## やってほしいこと

### 1. Vite を導入
- `package.json`, `vite.config.js` を作成
- `vite` と `@supabase/supabase-js` を依存に追加
- `index.html` の `<script>` を `type="module"` に変更
- `.gitignore` に `node_modules/`, `dist/`, `.env`, `.env.local` を追加
- `.env.example` を作成（`VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` のサンプル）

### 2. Supabase 接続への書き換え
- `app.js` 冒頭で `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)` を呼ぶ
- `localStorage` の `load/save/seed` を Supabase の `select/insert/update/delete` に置き換え
- データ構造は snake_case（`id`, `name`, `company`, `title`, `email`, `phone`, `memo`, `created_at`）
- 一覧は `created_at` の降順で取得
- 初期データは SQL で投入するので `app.js` 側の seed ロジックは削除

### 3. Supabase SQL を生成
`supabase-schema.sql` として以下を含めて保存：
- `CREATE TABLE contacts`（id uuid pk default gen_random_uuid(), name text not null, company text not null, title/email/phone/memo text, created_at timestamptz not null default now()）
- `ALTER TABLE contacts DISABLE ROW LEVEL SECURITY`（Publishable key で読み書きするため。本番運用ではポリシーを作ることが推奨）
- 初期データ 3件の INSERT（山田 太郎／佐藤 花子／鈴木 次郎）

### 4. CLAUDE.md / spec.md の更新
既存の `CLAUDE.md` と `spec.md` の「永続化：localStorage」記述を「Vite + Supabase」に書き換え。`.env` 管理方針・テーブル定義・RLS方針も追記する。

実装が完了したら、`npm install` と `npm run dev` を実行して、ブラウザで動作確認できる状態にしてください。
