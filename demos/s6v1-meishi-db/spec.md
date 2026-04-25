# 仕様書 — 名刺管理アプリ（S6V1：DB連携版）

S5V4 で作ったローカル版（localStorage）に Supabase 連携を追加し、ブラウザを閉じてもデータが消えない／別端末からも同じデータが見える状態にする。

---

## 1. 目的・利用シーン

- ひとり営業が、商談で交換した名刺をブラウザ1枚で管理する
- 従来の紙の名刺・Excel台帳・連絡先アプリの代替として、登録・検索・編集・削除の最小機能を提供する
- Supabase 連携により **別端末・別ブラウザから同じデータが見える**

---

## 2. データ項目（contacts テーブル）

| カラム | 型 | 必須 | 備考 |
|---|---|---|---|
| `id` | uuid | ○ | 自動採番 |
| `name` | text | ○ | 氏名（例：山田 太郎） |
| `company` | text | ○ | 会社名 |
| `title` | text | | 役職（任意） |
| `email` | text | | メール（任意） |
| `phone` | text | | 電話（任意） |
| `memo` | text | | メモ（任意、複数行可） |
| `created_at` | timestamptz | ○ | 登録日時（自動付与） |

- 並び順は `created_at` の降順
- RLS は有効化、Publishable keyからの全操作を許可するポリシーを設定（教材用の最小権限）

---

## 3. 画面構成

### ツーカラムレイアウト
- 左ペイン（幅340px固定）
  - 検索ボックス（氏名・会社名・役職を横断検索）
  - 「＋ 新規登録」ボタン
  - 名刺カードの縦リスト
- 右ペイン（flex-1）
  - モード① 空状態（`#pane-empty`） — 初期表示
  - モード② 詳細（`#pane-detail`） — 選択中の名刺表示
  - モード③ フォーム（`#pane-form`） — 新規・編集

モバイル対応は対象外（PC表示のみ）。

---

## 4. CRUD操作フロー

| 操作 | 導線 | Supabase呼び出し |
|---|---|---|
| Create | 「＋ 新規登録」→ フォーム → 保存 → 詳細 | `.insert({...}).select().single()` |
| Read（一覧） | 起動時に左ペインで表示 | `.select('*').order('created_at', {ascending:false})` |
| Read（検索） | 検索ボックスでフィルタ | クライアント側で filter |
| Update | 詳細 → 編集 → フォーム → 保存 → 詳細 | `.update({...}).eq('id', id).select().single()` |
| Delete | 詳細 → 削除 → 確認 → 空状態 | `.delete().eq('id', id)` |

---

## 5. 永続化方針

- 旧：`localStorage` の `meishi-cards` キーに JSON 配列で保存
- 新：Supabase の `contacts` テーブルに保存
- 接続情報は `.env` から `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` を読む
- 初期データ（3件）はテーブル作成時に SQL の `INSERT` で投入する（アプリ側のseed処理は持たない）

---

## 6. 環境変数

| 変数名 | 用途 | 書く場所 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase プロジェクトのURL | `.env`（ローカル）/ Vercel Environment Variables（本番） |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 匿名キー | 同上 |

`.env` は `.gitignore` により GitHub には送られない。Vercel側には別途登録が必要で、**push前にVercel Dashboardで環境変数を登録**しておくのが基本フロー（登録忘れのままpushするとビルド失敗）。

---

## 7. 対象外の機能

- ユーザー認証・マルチユーザー（Publishable key で全員が同じデータを見る設計）
- Row Level Security のポリシー（本番運用では必要だが、本教材では扱わない）
- 画像・添付ファイル保存（Supabase Storage 未使用）
- CSV インポート／エクスポート
- モバイル対応
- スマホアプリ化
