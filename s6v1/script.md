# S6V1 台本 — 名刺管理アプリにデータベースを接続して永続化しよう

- **想定尺**: 約11分（うち実演 約7分）
- **実演**: あり（Supabaseテーブル作成 → Vite導入＋Supabase接続 → Vercel環境変数登録 → 動作確認）

---

## [P1] カバー — 名刺管理アプリにデータベースを接続して永続化しよう

この動画では、前回までに作った名刺管理アプリにデータベースを接続して、「ブラウザを閉じてもデータが消えない」ように永続化を実装します。

---

## [P2] TODAY'S GOAL — アプリを「永続化」する

流れは2ステップです。まずテーブル設計、データを保存する箱を作ります。次にSupabase接続、localStorageの処理をSupabaseに置き換えます。

---

## [P3] WHY — データをブラウザの外へ、それが「永続化」の本当の意味

前回までのアプリは、データがブラウザの中、localStorageに保存されていましたので、自分のPCからしか見られませんでした。

今回からは、データをSupabaseというクラウドのデータベースに保存します。どの端末から開いても、同じデータにアクセスできます。これが本物の「永続化」です。

---

## [P4] HOW — バックエンド3点セット

バックエンド接続は3つの部品で成り立ちます。

1つ目は**Supabase**。クラウドのデータベースで、SQLというデータベース言語で扱えます。

2つ目は**Vite + .env**。Viteは現代の標準的なビルドツールで、`.env`ファイルに鍵を書いておくと、ブラウザから安全に使えるようにしてくれます。この鍵のことを**環境変数**と呼びます。

3つ目は**Vercel環境変数**。ローカルの`.env`に入れた鍵は本番環境のVercelには届かないので、Vercel側にも別途登録します。

---

## 【実演パート】テーブル作成 → Supabase接続 → Vercel環境変数登録

（Claude Codeに画面切り替え、前回までの名刺アプリのリポジトリを開く）

まずClaude Codeに、テーブル定義のSQLを生成させて、Supabaseにテーブルを作ります。テーブルがあれば、アプリのデータをそこに保存できます。プロンプトは概要欄に貼っておきます。

> 名刺管理アプリ用のSupabaseテーブル定義を書いてください。
> 列：id（uuid主キー、自動採番）、name（必須）、company（必須）、title／email／phone／memo（任意）、created_at（自動付与）。
> RLS（Row Level Security）を有効化し、Publishable keyから全操作を許可するポリシー4つ（select/insert/update/delete）も含めてください。
> 初期データ3件のINSERTも含めてください。

（Claude CodeがSQLを生成）

（Supabaseに画面切り替え）

生成されたSQLをコピーして、SupabaseのSQL Editorに貼り付け、Runをクリックします。

（SQLを貼り付けて Run）

テーブルが作成され、初期データの3件も投入されました。

Settings → API に移動して、Project URL と Publishable key をコピーします。この2つが、アプリからSupabaseに接続するための鍵です。

（Claude Codeに画面切り替え）

Claude Codeに`.env`ファイルの作成を頼みます。先ほどコピーした鍵もチャットに貼って渡します。

> 以下の鍵で`.env`ファイルを作成してください。
> VITE_SUPABASE_URL=（コピーしたURL）
> VITE_SUPABASE_PUBLISHABLE_KEY=（コピーしたキー）

（Claude Codeが`.env`を作成）

続いてClaude Codeで、アプリデータの保存場所を、localStorageからSupabaseに変えます。プロンプトは長いので概要欄に貼っておきます。

> これから名刺管理アプリにデータベース連携を追加します。
> 今はlocalStorageで動いていますが、Supabaseに接続して「ブラウザを閉じても消えない」永続化に置き換えます。
> Viteを導入し、`.env`で鍵を管理し、`app.js`のlocalStorage処理をSupabase呼び出しに書き換えてください。
> 完了後、`npm install`と`npm run dev`で動作確認できる状態にしてください。

（Claude Codeにプロンプトを投入、コードの書き換えが完了する）

次にVercel側へ鍵を登録します。`.env`ファイルは`.gitignore`でGitHubに送っていないので、本番のVercel側にも同じ鍵を別途登録する必要があります。

Vercelダッシュボード → 該当プロジェクト → Settings → Environment Variables。ここで、`VITE_SUPABASE_URL`と`VITE_SUPABASE_PUBLISHABLE_KEY`の2つを登録します。

（Vercelへ画面切り替えて、環境変数を登録する）

（Claude Codeに画面切り替え）

登録ができたらClaude Codeに「GitHubにプッシュして」と頼みます。

（Claude Codeにプロンプト投入、`git push`が走る）

（Vercelに画面切り替え）

Vercelが自動でビルドを開始し、デプロイが成功します。発行されたURLを開きます。

（本番URLに画面切り替え、名刺アプリが表示される）

新規登録、編集、削除を一通り試します。

（新規登録 → 編集 → 削除を実演）

本番でもSupabaseに接続できており、CRUDがすべて機能しています。

---

## [P5] TEMPLATE — Supabase の CRUD コード

最後にSupabaseのCRUDコードの型をまとめます。

`createClient`で鍵を渡して接続を作り、`select`で読み取り、`insert`で作成、`update`で更新、`delete`で削除します。

ご自身のアプリで同じことをしたいときは、Claude Codeに自然言語で頼むだけです。アプリ名やテーブル名を自分のものに置き換えればOKです。今回のように「Vite導入・Supabase接続・テーブル定義のSQL生成」といった技術的な実装も、まとめて引き受けてくれます。プロンプトは概要欄に貼っておきます。

> このアプリにSupabaseのデータベース連携を追加してください。
> Viteを導入し、`.env`で鍵を管理し、`app.js`のlocalStorage処理をSupabase呼び出しに置き換えてください。
> テーブル定義のSQLも一緒に生成してください。
> 完了後、`npm run dev`で動作確認できる状態にしてください。

---

## [P6] SECURITY — 本番ではRLSが必須

最後にセキュリティについて、重要な話をします。

SQLには**RLS（Row Level Security）の有効化**と、操作の許可ルールである**ポリシー**も含めました。Publishable keyだけで誰でもデータベースにアクセスできてしまうので、本番運用ではRLSが必須です。本番環境ではSupabase公式ドキュメントを参考に厳密に設定してください。

これで、アプリのデータを永続化することができました。名刺管理アプリは、どこからでも同じデータにアクセスできる状態になりました。

この動画は以上です。
