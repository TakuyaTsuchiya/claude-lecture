# 引き継ぎ: S6V1のVercel Sensitive環境変数パートを拡充する

## 経緯

修了課題の運用ルールはシンプル化し、セキュリティ系（Sensitive・RLS等）は修了課題ドキュメントには書かない方針にした（受講生に細かいルールを覚えてもらうのは現実的でないため）。

ただしVercel上にDB接続アプリをデプロイする受講生は出るため、**セキュリティの説明はS6V1の動画で完結させる必要がある**。修了課題ドキュメントが薄くなった分、動画側の責任は重くなった。

現状S6V1の台本は以下の1行しかSensitiveに触れていない:
> `VITE_SUPABASE_URL`を入力し、Add Another をクリックして`VITE_SUPABASE_PUBLISHABLE_KEY`も入力、Sensitive はONのまま Save で保存し、Redeployします。

「ONのまま」だけだと、なぜONなのか・どんな事故を防げるのかが伝わらない。
特に **Vercel April 2026 security incident** の直後なので、受講生に環境変数管理の重要性を実感してもらえるタイミング。

参考: https://vercel.com/kb/bulletin/vercel-april-2026-security-incident

## やってほしいこと

S6V1の台本とスライドを拡充して、Vercelの環境変数管理の重要性（特にSensitive）が伝わる構成にする。

具体的には:
- **なぜSensitiveにするか** を1〜2文で説明（ダッシュボード上で値が読み取れなくなる、ログにも出ない等）
- **Vercel April 2026 incident** に1文だけ言及（「直近こういう事故もあったので環境変数の扱いには気をつけましょう」程度）。深追いはしない、視聴者が当事者意識を持つトリガーとして使う
- **修了課題のルール（Sensitive必須）への布石**: 「修了課題でもSensitiveをONにしてもらいます」のような一言で、課題と動画を接続

## 制約

- **台本の分量**: 現在の長さ（135行・約1600字目安）を大きく超えないこと。拡充するなら他のどこを削るか同時に検討する
- **スライドの最小フォント**: 18pt（出典は12pt例外OK）
- **動画の想定尺**: 5分。実演パートが既に長いので、概念解説を増やすほどキツくなる
- **既収録の可能性**: S6V1がすでに収録済みの場合は再収録のコストが発生する。台本/スライド変更前にユーザーに収録状況を確認すること

## 参考ファイル

- 該当動画: `s6v1/index.html` / `s6v1/script.md`
- 既存のSensitive言及箇所: `s6v1/script.md` 90行目
- 既存の.env説明: `s6v1/script.md` 34行目（"Vite + .env"）
- 修了課題（Sensitive必須のソース）: `docs/completion-criteria.html`
- プロジェクト全体の指示: `CLAUDE.md`
- 既存メモリ: `~/.claude/projects/-Users-tchytky-Desktop-claude-lecture/memory/MEMORY.md`

## 検証

1. スライド変更後は `node scripts/screenshot-slides.js s6v1/index.html` で全ページ目視
2. 台本の `^---$` 直前に空行があるか `grep -n "^---" s6v1/script.md` で確認
3. 台本を声に出して読んで、5分以内に収まるか・自然な日本語かをチェック
4. 完了後 `git push origin main` を忘れずに

## 着手前に確認すること

- ユーザーに **S6V1がすでに収録済みかどうか** を聞く。収録済みなら、再収録の手間とSensitive説明追加の価値を天秤にかけて、やるかどうか相談する
- 既収録なら、別案として「**S5V2 (Vercel入門)** に環境変数の概念だけ短く触れて、S6V1は最小修正」という選択肢も提案する
