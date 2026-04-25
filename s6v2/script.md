# S6V2 台本 — 経費管理アプリにデータベースを接続して永続化しよう

- **想定尺**: 約9分（うち実演 約6分）
- **実演**: あり（テーブル作成 → Supabase接続 → SQL集計 → Vercelデプロイ）

---

## [P1] カバー — 経費管理アプリにデータベースを接続して永続化しよう

この動画では、経費管理アプリにデータベースを接続します。今回はSQLで集計するという新しい力を体験します。

---

## [P2] TODAY'S GOAL — SQLで集計する力を知る

流れは2ステップです。まずSupabase接続として、経費データをSupabaseに置き換えます。次にSQL集計として、カテゴリ別の合計金額を1行のSQLで出します。

---

## [P3] WHY — Excelのピボットテーブル、それがSQLでは1行で書ける

経費を集計したいとき、Excelであればピボットテーブルを使います。毎回項目をドラッグして組み立てる必要があり、ファイルを開いて操作しないと結果が見えません。

SQLでは同じことが1行で書けます。一度書いたクエリはコードとして残すので、何度でも再実行できます。経理が月末に同じ集計を手作業で組み直す、という手間がなくなります。

---

## [P4] HOW — GROUP BY のしくみ

データベースで集計するときの中心は`GROUP BY`です。

`expenses`テーブルには、交通費や会議費、接待費など、個別の経費が1行ずつ並んでいます。これを`GROUP BY category`と書くと、同じカテゴリのレコードを1つのグループにまとめます。そして`SUM(amount)`でそのグループの金額を足し合わせます。

スライドの右側のように、5行あった表が3行に集約され、カテゴリごとの合計が一発で出ます。Excelのピボットテーブルと同じ考え方です。

---

## 【実演パート】テーブル作成 → Supabase接続 → SQL Editor で集計

（Claude Codeに画面切り替え）

まずClaude Codeに、テーブル定義のSQLを生成させて、Supabaseにテーブルを作ります。プロンプトは概要欄に貼っておきます。

> 経費管理アプリ用のSupabaseテーブル定義を書いてください。
> 列：id（uuid主キー、自動採番）、date（経費日）、category（カテゴリ）、amount（金額、整数）、memo、status（pending または settled）、created_at（自動付与）。
> RLS（Row Level Security）を有効化し、Publishable keyから全操作を許可するポリシー4つ（select/insert/update/delete）も含めてください。
> 初期データ5件のINSERTも含めてください。

SQLが生成されました。

（Supabaseに画面切り替え）

この生成されたSQLをコピーして、SupabaseのSQL Editorに貼り付け、Runをクリックします。

成功しました。Supabaseにテーブルが作成され、初期データの5件も投入されました。

Project OverviewのCopyメニューから、Project URLとPublishable keyをひとつひとつコピーします。

（Claude Codeに画面切り替え、経費管理アプリのリポジトリを開く）

次にClaude Codeで、Vite導入と`.env`作成、Supabase接続への書き換えを一発で頼みます。プロンプトは長いので概要欄に貼っておきます。

> 経費管理アプリにデータベース連携を追加します。
> 今はlocalStorageで動いていますが、Supabaseに接続して永続化します。
> Viteを導入し、以下の鍵で`.env`ファイルを作成してください（`.gitignore`にも`.env`を追加）。
> VITE_SUPABASE_URL=（コピーしたURL）
> VITE_SUPABASE_PUBLISHABLE_KEY=（コピーしたキー）
> そして`app.js`のlocalStorage処理をSupabase呼び出しに書き換えてください。
> 完了後、`npm install`と`npm run dev`で動作確認できる状態にしてください。

Claude Codeによるコードの書き換えが行われています。

少し時間がかかりましたが、CLAUDE.mdが更新され、`.env`がVite経由で正しく注入されました。Supabaseと接続され、動作確認もされました。

ここからが今回の主役です。

（Supabaseに画面切り替え、SQL Editorを開く）

カテゴリ別の合計を出すSQLを書きます。

```sql
SELECT category, SUM(amount) AS total
FROM expenses
GROUP BY category
ORDER BY total DESC;
```

これを実行します。交通費、会議費、接待費といったカテゴリごとの合計金額が、一発で出ました。Excelのピボットテーブルなら何ステップもかかる作業が、3行のSQLで完了します。

ステータス別の件数も出してみます。

```sql
SELECT status, COUNT(*) AS count
FROM expenses
GROUP BY status;
```

申請中と精算済みの件数が出ました。経営者が「先月の交際費はいくらだった？」と聞いたときも、1行のSQLで答えが出ます。

（Vercelへ画面切り替えて、環境変数を登録する）

最後にVercel側に環境変数を登録します。Vercelダッシュボード → 該当プロジェクト → Settings → Environments → Production → Add Environment Variable。`VITE_SUPABASE_URL`と`VITE_SUPABASE_PUBLISHABLE_KEY`の2つを登録し、Sensitive はONのまま Save で保存し、Redeployします。

（Claude Codeに画面切り替え）

登録ができたらClaude Codeに「GitHubにプッシュして」と頼みます。

（Vercelに画面切り替え）

Vercelが自動でビルドを開始し、デプロイが成功します。発行されたURLを開きます。

（本番URLに画面切り替え、経費アプリが表示される）

新規登録、編集、削除を一通り試します。本番でもSupabaseに接続できており、CRUDがすべて機能しています。

---

## [P5] TEMPLATE — 集計の基本3パターン

集計の型は3つ覚えておけば、ほとんどの月次レポートに対応できます。

`SUM`は合計、`COUNT`は件数、`AVG`は平均です。どれも`GROUP BY`と組み合わせて、カテゴリ別・ステータス別・月別といった切り口で集計できます。

ご自身のアプリで集計したいときは、Claude CodeにSQL生成を頼むだけです。たとえば「先月のカテゴリ別合計を出すSQLを書いて」と頼めば、`SUM`や`GROUP BY`を組み合わせたSQLを生成してくれます。

データベース接続そのものも、Claude Codeに自然言語で頼むだけで一発で実装できます。

なお、今回のテーブル定義のSQLにも、**RLS（Row Level Security）の有効化**と、操作の許可ルールである**ポリシー**を設定しました。RLSがないと、Publishable keyだけで誰でもデータベースを操作できてしまうので、本番運用ではRLSが必須です。本番環境ではSupabase公式ドキュメントを参考に厳密に設定してください。

データベースに保存すると、あとから好きな角度で切り出せます。これがバックエンドを持つアプリの強みです。

この動画は以上です。
