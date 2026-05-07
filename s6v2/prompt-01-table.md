経費管理アプリ用のSupabaseテーブル定義を書いてください。
列：id（uuid主キー、自動採番）、date（経費日）、category（カテゴリ）、amount（金額、整数）、memo、status（pending または settled）、created_at（自動付与）。
RLS（Row Level Security）を有効化し、Publishable keyから全操作を許可するポリシー4つ（select/insert/update/delete）も含めてください。
さらに、集計用のRPC関数2つ（get_category_totals: カテゴリ別合計、get_status_counts: ステータス別件数）と、anonロールへのEXECUTE権限付与も含めてください。
初期データ5件のINSERTも含めてください。
