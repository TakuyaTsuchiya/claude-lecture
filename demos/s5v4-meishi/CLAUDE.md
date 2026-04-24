# 名刺管理アプリ — Claude Code設定

Claude Codeがこのリポジトリで作業するときに守るルール。新しいセッションの最初に自動で読み込まれる。

## 技術スタック

- **HTML / CSS / JavaScript（vanilla）** — フレームワークなし
- **Tailwind CSS（CDN）** — スタイリングはTailwindで行う
- **localStorage** — データ永続化（DB・サーバーは使わない）
- ビルドツール・npm不要。`index.html` をブラウザで開けば動く

## ディレクトリ構成

```
.
├── index.html   # 画面マークアップ（全セクションをここに集約）
├── app.js       # 状態管理・localStorage・画面切替ロジック
├── styles.css   # Tailwindで表現できない独自スタイル
└── CLAUDE.md
```

ファイルを増やさない。画面が増えてもすべて `index.html` 内の `<section>` で切り替える。

## コーディング規約

- **ツーカラムレイアウト**。左=名刺一覧（常時表示）、右=詳細／フォーム／空状態（モード切替）
- **右ペインのモード**: `empty` / `detail` / `form` の3種。`<section>` を `display: none/block` で切り替える
- **ID規約**: 右ペインのセクションには `pane-empty` / `pane-detail` / `pane-form` のように `pane-*` を付ける
- **関数は50行以内**。超えたら分割する
- **関数名は動詞で始める**（`renderList`, `saveCard`, `deleteCard` など）
- `var` は使わない。`const` を優先、再代入が必要なときだけ `let`
- **グローバル変数を汚染しない**。即時実行関数 `(function(){ ... })()` で全体を包む
- コメントは「なぜ」を書く。「何をしているか」はコードで示す

## データ構造

名刺1枚を以下のオブジェクトで表現する。

```js
{
  id: "uuid文字列",
  name: "山田 太郎",
  company: "株式会社サンプル",
  title: "代表取締役",
  email: "yamada@example.com",
  phone: "03-1234-5678",
  memo: "2026-04-15 展示会で交換",
  createdAt: "2026-04-15T10:00:00.000Z"
}
```

localStorageのキーは `meishi-cards`。配列として保存する。

## デザイン規約

- **配色**: 白基調（`bg-white`）、アクセントは `#c15f3c`（Claudeオレンジ）
- **フォント**: 游ゴシック系（`font-family: "游ゴシック", "Yu Gothic", sans-serif`）
- **レイアウト**: ツーカラム（左=一覧 340px 固定、右=詳細／フォーム flex-1）。モバイルは対象外
- **角丸**: `rounded-lg`（8px）で統一
- **影**: カードは `shadow-sm` 程度の軽いものに留める
- **ボタン**: プライマリはアクセントカラー、セカンダリは白ボタン＋枠線

## ワークフロー

1. 変更前に既存コードを読む
2. 規約に沿って実装する
3. ブラウザで実際に開いて動作確認する
4. CRUD全操作（作成・一覧・詳細・編集・削除）が動くことを確認する

## やってはいけないこと

- npm パッケージをインストールしない（CDNで済ませる）
- ビルドツール（Webpack / Vite 等）を導入しない
- サーバーサイドコードを書かない
- 外部APIを呼ばない（全てlocalStorageで完結）
