# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリの目的

中級者向け有料動画教材「**Claude Code入門・実践**」のスライド・台本・実演コードを管理するリポジトリ。ScreenStudioで画面収録して販売する前提。

## 制作フロー

モジュール単位で進行する。各動画は **約5分**。

1. 構成を壁打ち（このリポジトリ内でClaudeと対話）
2. HTMLスライドを生成（`{section}/index.html`）
3. 台本を作成（`{section}/script.md`）
4. Claude Code の実演を検証
5. ScreenStudioで収録

撮影順は **S1→S2→...** の順番。先の回の確定を待ってから次へ進む。

## コース構成

| セクション | 内容 |
|---|---|
| S1 / S2 | Claude Code の基本 |
| S3 / S4 | 業務効率化（Skills / MCP） |
| S5 / S6 | アプリ開発（フロント / サーバー） |

ディレクトリ命名は `s{section}v{video}`（例: `s1v1/`, `s2v3/`）。

## スライドの技術構成

**HTMLスライド**（自由度重視、Revealなどのフレームワークは不採用）。
- `styles/slide.css` に共通スタイル。**全モジュールで使い回す**（CSSはここだけに置く）
- 各動画の `index.html` は `../styles/slide.css` を相対パスで読み込む
- 1枚 = `<section class="slide">`。`.slide.active` で表示、JSで切り替え
- 操作: `→` / `Space` / クリックで次、`←` で前、`Home` / `End` で端へ
- `#N` ハッシュでスライド番号指定可能（再収録時の頭出しに便利）

## スライドデザインの統一ルール（必守）

動画越しの視認性が最優先。全モジュールで一貫させる。

- **フォント**: 游ゴシック系（`"游ゴシック", "Yu Gothic", YuGothic, "Noto Sans JP", sans-serif`）
- **フォントサイズ**: **最小18pt**（ナビUIも含む）。本文28pt、見出し44pt、カバー80pt目安
- **配色**: 白基調。文字は `#1a1a1a`、サブ `#555`、ミュート `#888`
- **アクセント**: Claudeオレンジ系 `#c15f3c`（`--color-accent`）
- **文字量**: 1スライド1メッセージ。長文は台本で話し、スライドはキーワードのみ
- **コードブロック**: `font-family: var(--font-mono)`、サイズも18pt以上を維持

CSS変数は `:root` で定義済み。値を変えるときは `styles/slide.css` だけをいじる。

## プレビュー

ローカルで `open s1v1/index.html` するだけで開ける（ビルドツール不要）。
収録時はブラウザをフルスクリーン（`F`キー等）にしてScreenStudioでキャプチャ。

## 台本の書き方

- **ファイル**: `{section}/script.md`
- **文体**: 敬体（ですます調）
- **一人称**: 「私」（「僕」は使わない）
- **構造**: 冒頭に想定尺・実演有無などのメタ情報、以降は `## [PN] タイトル` でスライドと番号同期
- **分量の目安**: 約 **1,600字** ＝ **5.3字/秒 × 300秒**（ゆったりめ。丁寧に読むと5分、普通に読むと4〜4.5分）
- **役割分担**: スライドに書いた情報は読み上げない。削った補足・具体例・感情の動かし方は台本で話す（スライドと**重複させない**）

## 画像・出典

- 外部画像は `assets/` に保存。ファイル名は内容ベース（例: `mcp-architecture.png`、`claude-design.svg`）
- 画像を使ったら必ず **出典URL** をスライドに記載する
- 出典表記だけは **12pt で例外的に表記OK**（通常の最小18ptルールの除外）。インラインで `style="font-size:12pt;"` を当てる

## コミットの粒度

1コミット = 1論理変更。メッセージは命令形1〜2行 + Co-Authored-By。
- モジュールごとに分ける（S1V1の修正とS2V1の追加は混ぜない）
- スライド変更・台本変更・アセット追加は分けてよい（関連していれば同一コミットでも可）

## メモリ（永続コンテキスト）

`/Users/tchytky/.claude/projects/-Users-tchytky-Desktop-claude-lecture/memory/` に
プロジェクト固有のメモリがある。セッション開始時に `MEMORY.md` を確認すること。
