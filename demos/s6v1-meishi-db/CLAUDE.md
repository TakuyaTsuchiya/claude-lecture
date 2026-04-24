# CLAUDE.md — 名刺管理アプリ 開発規約（S6V1：DB連携版）

このファイルは、名刺管理アプリの開発ルールを定める。S5V4のローカル版（localStorage）からSupabase接続版に移行した状態。実装・修正・レビュー時は常にこの規約に従うこと。

---

## 1. 技術スタック

| 区分 | 採用技術 |
|---|---|
| マークアップ | HTML5（`index.html` 1枚） |
| スタイル | Tailwind CSS（CDN読み込み）+ `styles.css`（補助のみ） |
| スクリプト | JavaScript（vanilla、ES2020+、フレームワーク禁止） |
| ビルドツール | **Vite**（`.env` を標準機能として扱うため） |
| データベース | **Supabase**（PostgreSQL + REST API + JS SDK） |
| ホスティング | Vercel（Viteを自動認識してデプロイ） |

---

## 2. ディレクトリ構成

```
s6v1-meishi-db/
├── index.html              # マークアップ（<script type="module">でapp.js読み込み）
├── app.js                  # 全ロジック（Supabase連携・描画・イベント）
├── styles.css              # Tailwindで賄えない補助スタイルのみ
├── package.json            # Vite / @supabase/supabase-js の依存
├── vite.config.js          # Vite 設定
├── supabase-schema.sql     # Supabase用 CREATE TABLE / INSERT SQL
├── .env                    # Supabase URL と anon key（Git除外）
├── .env.example            # .env のサンプル
├── .gitignore              # node_modules / dist / .env を除外
├── CLAUDE.md               # 本ファイル
└── spec.md                 # 仕様書
```

- 画面コードは `index.html` / `app.js` / `styles.css` の **3枚で完結** させる（S5V4から継承）
- `package.json` / `vite.config.js` / `.env*` / `supabase-schema.sql` はVite＋Supabase連携のために追加

---

## 3. 環境変数 / 鍵の管理

- `.env` に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を書く
- `VITE_` プレフィックスを付けると Vite がブラウザに露出させてくれる
- `.env` は `.gitignore` に入れるため GitHub には送られない
- Vercel 本番では「Environment Variables」画面で同じ2つのキーを登録する
- **初回デプロイは環境変数未登録で失敗する**のが仕様（自然発生の山場）
- `.env.example` は共有用のサンプル（中身はダミー）

## 4. Supabase 接続

- `app.js` 冒頭で `createClient(URL, ANON_KEY)` を呼んでクライアントを取得
- CRUD は以下で実装
  - 一覧取得: `.from('contacts').select('*').order('created_at', { ascending: false })`
  - 作成: `.from('contacts').insert({...}).select().single()`
  - 更新: `.from('contacts').update({...}).eq('id', id).select().single()`
  - 削除: `.from('contacts').delete().eq('id', id)`
- anon key は公開前提の鍵だが、リポジトリに含めない実務習慣
- RLS はテーブル作成時に `DISABLE` する（本番運用ではポリシーを作ることが推奨）

---

## 5. コーディング規約（S5V4から継承）

### 5.1 画面切替方式
- 右ペインは **3モード** を DOM として同時に保持し、`hidden` クラスの付け外しで切り替える
  - `#pane-empty` — 初期表示（何も選択していない状態）
  - `#pane-detail` — 選択中の名刺を表示
  - `#pane-form` — 新規登録・編集フォーム
- モード切替は専用関数 `showPane(name)` に集約

### 5.2 ID命名規則
- ペインは `pane-*` プレフィックス
- 入力要素は `input-*` プレフィックス
- ボタンは `btn-*` プレフィックス（`btn-new`, `btn-save`, `btn-delete`, `btn-edit`, `btn-cancel`）

### 5.3 JavaScript規約
- **関数は50行以内**。超えたら分割する
- **ネストは3段階まで**。早期リターン・ガード節で平坦化する
- **変数宣言は `const` を優先**。再代入が必要なものだけ `let`。`var` は禁止
- **Supabase呼び出しは async/await で書く**（コールバック禁止）
- DOM参照はキャッシュする
- 起こり得ない異常系のフォールバックは書かない（過剰防衛しない）

### 5.4 コメント方針
- **「なぜ」を書く**。「何をしているか」は識別子で伝える
- 無意味なコメント（`// データを保存` など）は書かない

---

## 6. データ構造

### 6.1 contacts テーブル（Supabase）

| カラム | 型 | 制約 |
|---|---|---|
| `id` | `uuid` | primary key, default `gen_random_uuid()` |
| `name` | `text` | not null |
| `company` | `text` | not null |
| `title` | `text` | null 許容 |
| `email` | `text` | null 許容 |
| `phone` | `text` | null 許容 |
| `memo` | `text` | null 許容 |
| `created_at` | `timestamptz` | not null, default `now()` |

- JavaScript 側も snake_case でアクセス（`c.created_at` など）
- 表示順は `created_at` の降順

---

## 7. デザイン規約（S5V4から継承、変更なし）

| 要素 | ルール |
|---|---|
| 背景 | 白（`#ffffff`）基調 |
| アクセント | `#c15f3c`（Claudeオレンジ）— ボタン・選択状態・アクセント線 |
| テキスト | グレースケール（`text-stone-900` / `text-stone-700` / `text-stone-500`） |
| フォント | `"游ゴシック", "Yu Gothic", sans-serif` |
| 角丸 | `rounded-lg`（8px）で統一 |
| 影 | `shadow-sm` までに抑える。`shadow-lg` 以上は使わない |
| ボタン | プライマリはオレンジ背景・白文字、セカンダリは白背景・グレー枠線 |
| レイアウト | 左340px固定 + 右flex-1 の2カラム |
| 選択中カード | ボーダーを濃い stone-900 に切り替える |

---

## 8. やってはいけないこと

- **anon key を `index.html` や `app.js` に直書き**（`.env` 経由で読む）
- **Service role key をブラウザに露出**（絶対禁止）
- フレームワーク導入（React / Vue など）
- サーバーサイドコード追加（Node.js Express 等）
- 外部画像ファイルのダウンロード・同梱
- モバイル対応のためのCSS追加（PC表示のみ）
