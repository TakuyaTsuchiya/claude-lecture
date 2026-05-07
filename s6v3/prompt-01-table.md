顧客管理アプリ用のSupabaseテーブル定義を書いてください。
2テーブル構成：customers（顧客：id・company・name・title・email・phone・memo・created_at）と、deals（商談：id・customer_id外部キー・title・amount・status・memo・created_at・updated_at）。
dealsのcustomer_idは customers(id) を REFERENCES してください。顧客が削除されたら紐付く商談も自動で消えるよう、ON DELETE CASCADE も付けてください。
両テーブルでRLSを有効化し、Publishable keyから全操作を許可するポリシー（各テーブル4つずつ、合計8つ）も含めてください。
顧客3件・商談5件の初期データINSERTも含めてください。商談のcustomer_idは顧客のIDと正しく紐付けてください。
すべて1つのSQLスクリプトにまとめ、SQL Editorで一発実行で完結する形にしてください。後から追加実行が必要なSQLが残らないようにしてください。
スクリプト冒頭のクリーンアップ（DROP）は初回実行でも安全に通るようにしてください。`DROP TRIGGER ... ON テーブル名` は対象テーブルがないとエラーになるので使わず、`DROP TABLE IF EXISTS ... CASCADE` でトリガごと削除する形にしてください。
