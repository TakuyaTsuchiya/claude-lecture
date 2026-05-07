名刺管理アプリ用のSupabaseテーブル定義を書いてください。
列：id（uuid主キー、自動採番）、name（必須）、company（必須）、title／email／phone／memo（任意）、created_at（自動付与）。
RLS（Row Level Security）を有効化し、Publishable keyから全操作を許可するポリシー4つ（select/insert/update/delete）も含めてください。
初期データ3件のINSERTも含めてください。
