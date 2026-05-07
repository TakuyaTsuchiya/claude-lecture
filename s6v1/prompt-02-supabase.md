これから名刺管理アプリにデータベース連携を追加します。
今はlocalStorageで動いていますが、Supabaseに接続して「ブラウザを閉じても消えない」永続化に置き換えます。
Viteを導入し、`.env`で鍵を管理し、`app.js`のlocalStorage処理をSupabase呼び出しに書き換えてください。
完了後、`npm install`と`npm run dev`で動作確認できる状態にしてください。
