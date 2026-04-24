# S6V3 台本 — 顧客管理アプリにDB接続して永続化しよう

- **想定尺**: 約11分（うち実演 約7分）
- **実演**: あり（2テーブル設計 → Supabase接続 → JOIN取得・CASCADE DELETE確認 → Vercelデプロイ）

---

## [P1] カバー — 顧客管理アプリにDB接続して永続化しよう

この動画では、顧客管理アプリにデータベースを接続します。今回はテーブルを2つに分けて、お互いを関連付ける**リレーション**という考え方を体験します。

---

## [P2] TODAY'S GOAL — テーブルを分けて関連付ける

流れは2ステップです。まず**Supabase接続**として、顧客アプリのlocalStorageをSupabaseに置き換えます。次に**リレーション設計**として、顧客と商談を2つのテーブルに分けて、`customer_id`で紐付けます。

顧客アプリでは、1社に対して複数の商談があります。見込み・提案・成約といった商談が、同じ会社の中に並びます。この「1つの顧客に対して多くの商談」という関係を、**1対多のリレーション**と呼びます。

---

## [P3] WHY — Excelのシート分け、それがSQLでは「リレーション」

Excelで顧客と商談を管理するなら、1枚のシートに全部書く方法と、顧客シートと商談シートの2枚に分ける方法があります。

1枚に全部書くと、会社名が何度も繰り返し登場します。会社名が変わったとき、その行全部を修正しないといけません。

2枚に分けると、会社情報は顧客シートに1行だけ。商談シートには会社のIDだけを書きます。会社名が変わっても、顧客シートの1箇所を直せば済みます。これがリレーショナルデータベースの基本的な考え方です。

---

## [P4] HOW — 1対多のリレーション

スライドの図のように、`customers`テーブルには顧客が、`deals`テーブルには商談が並びます。`deals`側には`customer_id`という列があり、ここに`customers`のIDが入ります。これが**外部キー**です。

さらに`ON DELETE CASCADE`という設定を付けます。これを付けておくと、顧客を削除したときに、その顧客に紐付く商談もデータベース側で自動的に消えてくれます。アプリ側で「商談も消す」というロジックを書かずに、データの整合性を保てます。

---

## 【実演パート】2テーブル設計 → Supabase接続 → JOIN取得・CASCADE確認

（画面をSupabaseダッシュボードに切り替え）

まずSQL Editorで2つのテーブルを作ります。Claude Codeに生成してもらったSQLを貼り付けます。

```sql
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  name text NOT NULL,
  ...
);

CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  ...
);
```

`deals`のcustomer_idに`REFERENCES customers(id) ON DELETE CASCADE`が付いています。これが2つのテーブルを繋ぐ骨組みです。

（Run → テーブル作成完了）

Settings → APIからProject URLとanon keyをコピーします。

（画面を顧客アプリのリポジトリに切り替え）

前回と同じプロンプトで一括移行を依頼します。プロンプトは長いので、概要欄に貼っておきます。

> 顧客管理アプリにデータベース連携を追加します。
> customersとdealsの2テーブルを使うため、商談一覧の取得では`select('*, customers(company)')`で会社名も一緒に取ってください。
> Viteを導入し、`.env`で鍵を管理し、`app.js`のlocalStorage処理をSupabase呼び出しに書き換えてください。

（Claude Codeに投入 → 処理完了）

`.env`に鍵を貼って`npm run dev`を実行します。

（ブラウザに顧客アプリが立ち上がる）

顧客一覧、商談の登録・編集が動作しています。注目は**商談カードに会社名が表示されている**ところです。`deals`テーブルにはcustomer_idしか入っていませんが、`select('*, customers(company)')`で顧客テーブルから会社名を引いてきています。これが**JOIN取得**です。

次に、`ON DELETE CASCADE`の動きを確認します。顧客を1件削除してみます。

（顧客を削除）

この顧客に紐付いていた商談も、自動的に消えました。アプリ側では顧客の`delete`を呼んだだけですが、データベース側で連鎖して商談も削除されています。

最後にGitHubにプッシュし、Vercelに環境変数を登録してデプロイします。

（push → Vercel → Deploy）

本番でもリレーション付きの顧客管理アプリが動作しています。

---

## [P5] TEMPLATE — 2テーブルの「型」

スライドに出している3つの型を覚えてください。

1つ目は**外部キー付きのテーブル定義**。`REFERENCES`と`ON DELETE CASCADE`で2つのテーブルを関連付けます。

2つ目は**JOIN取得**。`.select('*, customers(company)')`と書くだけで、関連テーブルのデータも一緒に取れます。

3つ目は**CASCADE削除**。親テーブルを削除するだけで、子テーブルも自動で消えます。

この3つが揃うと、Excelの「シート間参照」や「VLOOKUPの手作業」がデータベース側で完結します。

この動画は以上です。
