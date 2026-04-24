# CLAUDE.md — 名刺管理アプリ 開発規約

このファイルは、名刺管理アプリ（ひとり用・ブラウザ完結）の開発ルールを定める。実装・修正・レビュー時は常にこの規約に従うこと。

---

## 1. 技術スタック

| 区分 | 採用技術 |
|---|---|
| マークアップ | HTML5（`index.html` 1枚） |
| スタイル | Tailwind CSS(CDN読み込み) + `styles.css`(補助のみ) |
| スクリプト | JavaScript（vanilla、ES2020+、フレームワーク禁止） |
| 永続化 | ブラウザの `localStorage` |
| ビルド | なし（npm・bundler・トランスパイラすべて使わない） |
| 外部通信 | なし（API・CDN経由のTailwind以外は読み込まない） |

---

## 2. ディレクトリ構成

```
s5v4-meishi/
├── index.html      # マークアップ・Tailwind CDN読み込み・ルートDOM
├── app.js          # 全ロジック（CRUD・描画・イベント・localStorage）
├── styles.css      # Tailwindで賄えない補助スタイルのみ
├── CLAUDE.md       # 本ファイル（開発規約）
└── spec.md         # 仕様書
```

- ファイルは index.html / app.js / styles.css の **3枚で完結** させる。追加ファイルは作らない。
- 画像・アイコンはインラインSVGかUnicode絵文字で賄う（外部画像ファイル禁止）。

---

## 3. コーディング規約

### 3.1 画面切替方式

- 右ペインは **3モード** を DOM として同時に保持し、`hidden` クラスの付け外しで切り替える。
  - `#pane-empty` — 初期表示（何も選択していない状態）
  - `#pane-detail` — 選択中の名刺を表示
  - `#pane-form` — 新規登録・編集フォーム
- ルーティングライブラリは使わない。モード切替は専用関数 `showPane(name)` に集約する。

### 3.2 ID命名規則

- ペインは `pane-*` プレフィックス（例: `pane-empty`, `pane-detail`, `pane-form`）
- 入力要素は `input-*` プレフィックス（例: `input-name`, `input-company`, `input-email`）
- ボタンは `btn-*` プレフィックス（例: `btn-new`, `btn-save`, `btn-delete`, `btn-edit`, `btn-cancel`）
- 動的生成される名刺カードは `card-${id}` の形式（data属性 `data-card-id` も併用）

### 3.3 JavaScript規約

- **関数は50行以内**。超えたら分割する。
- **ネストは3段階まで**。早期リターン・ガード節で平坦化する。
- **変数宣言は `const` を優先**。再代入が必要なものだけ `let`。`var` は禁止。
- **グローバル汚染禁止**：`app.js` 全体を即時実行関数 `(() => { ... })()` で包む。
- **DOM参照はキャッシュ** する（都度 `getElementById` を呼ばない）。
- **イベントリスナーは集約** する。可能な限りイベントデリゲーションを使う。
- **`any` 相当のゆるい扱い禁止**：引数が来ないケースは早期returnで弾く。

### 3.4 コメント方針

- **「なぜ」を書く**。「何をしているか」は識別子で伝える。
- TODO コメントには必ず理由を書く。
- 無意味なコメント（`// データを保存` など）は書かない。

---

## 4. データ構造

### 4.1 名刺1件のオブジェクト

```js
{
  id: "1714012345678",          // 文字列、Date.now() ベースで自動採番
  name: "山田 太郎",             // 必須
  company: "株式会社サンプル",   // 必須
  title: "営業部長",             // 任意
  email: "taro@example.com",    // 任意
  phone: "03-1234-5678",        // 任意
  memo: "展示会で名刺交換",     // 任意、複数行可
  createdAt: "2026-04-24T09:00:00.000Z" // ISO文字列、必須
}
```

### 4.2 localStorage

- **キー**: `meishi-cards`
- **値**: 上記オブジェクトの配列（JSON文字列）
- 読み込み: `JSON.parse(localStorage.getItem("meishi-cards") ?? "[]")`
- 保存: `localStorage.setItem("meishi-cards", JSON.stringify(cards))`
- 並び順は **作成日時の新しい順**（`createdAt` の降順）で表示する。保存時は順序不問。

---

## 5. デザイン規約

| 要素 | ルール |
|---|---|
| 背景 | 白（`#ffffff`）基調 |
| アクセント | `#c15f3c`（Claudeオレンジ）— ボタン・選択状態・アクセント線 |
| テキスト | グレースケール（`text-gray-900` / `text-gray-600` / `text-gray-400`） |
| フォント | `"游ゴシック", "Yu Gothic", sans-serif` |
| 角丸 | `rounded-lg`（8px）で統一 |
| 影 | `shadow-sm` までに抑える。`shadow-lg` 以上は使わない |
| ボタン | プライマリはオレンジ背景・白文字、セカンダリは白背景・グレー枠線 |
| レイアウト | 左340px固定 + 右flex-1 の2カラム。`flex` で組む |
| 選択中カード | 左にオレンジの縦ライン + 薄いオレンジ背景 |

---

## 6. やってはいけないこと

- `npm install` / `package.json` の作成 — ビルド環境は作らない
- webpack / vite / parcel / esbuild など **バンドラ禁止**
- React / Vue / Svelte などの **フレームワーク禁止**
- サーバーサイド（Node.js / Express / Next.js API など）の導入禁止
- localStorage 以外の永続化（IndexedDB・外部DB・クラウドストレージ）
- 外部API呼び出し（`fetch` による通信）
- 外部画像ファイルのダウンロード・同梱
- モバイル対応のためのCSS追加（PC表示のみで十分）
- OCR・画像解析関連のライブラリ導入
