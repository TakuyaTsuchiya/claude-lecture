顧客管理アプリにデータベース連携を追加します。
今はlocalStorageで動いていますが、Supabaseに接続して永続化します。
Viteを導入し、以下の鍵で`.env`ファイルを作成してください（`.gitignore`にも`.env`を追加）。
VITE_SUPABASE_URL=（コピーしたURL）
VITE_SUPABASE_PUBLISHABLE_KEY=（コピーしたキー）
そして`app.js`のlocalStorage処理をSupabase呼び出しに書き換えてください。
商談一覧を取得するときは `select('*, customers(company)')` を使い、商談カードに会社名も表示してください。
完了後、`npm install`と`npm run dev`で動作確認できる状態にしてください。
