# 工程5：メタ生成

**前工程からの引継**：`04-body.md` の本文内容に対応するSEOメタ情報を生成する。

---

## タイトルタグ（title）

```
【2026年版】屋上防水工事の費用相場｜工法別の単価と業者選びの完全ガイド
```
- 全角33文字（Google推奨28〜32字に近い許容範囲）
- 主要KW「屋上防水工事 費用相場」を先頭に配置
- 「2026年版」で鮮度、「完全ガイド」で網羅性を示唆

### 代替案（短め）
```
屋上防水工事の費用相場｜工法別の単価と業者選び【2026年版】
```
- 全角29文字

---

## メタディスクリプション（meta description）

```
屋上防水工事の費用相場を工法別（ウレタン・シート・FRP・アスファルト）に2026年4月時点の全国平均で比較。費用内訳の分解、建物種別×工法マトリクス、20年スパンのライフサイクルコスト、業者選定7つのチェックポイント、見積交渉の6観点まで1本で網羅。マンション管理組合・ビルオーナー・リフォーム会社の発注担当者向け。
```
- 全角148文字（Google推奨120〜156字）
- 4工法名を列挙してロングテールKWをカバー
- 独自性（費用分解／マトリクス／長期コスト／見積交渉）を前半に配置
- 読者像を最後に明示

---

## OGP設定（Open Graph Protocol）

```html
<meta property="og:type" content="article">
<meta property="og:title" content="【2026年版】屋上防水工事の費用相場｜工法別の単価と業者選びの完全ガイド">
<meta property="og:description" content="屋上防水工事の費用相場を工法別（ウレタン・シート・FRP・アスファルト）に2026年4月時点で比較。費用内訳・建物×工法マトリクス・20年長期コスト・業者選定・見積交渉の観点まで網羅。">
<meta property="og:image" content="https://example.com/ogp/okujo-bousui-2026.jpg">
<meta property="og:url" content="https://example.com/articles/okujo-bousui-kakaku-souba-2026">
<meta property="og:site_name" content="○△建設オウンドメディア">
<meta property="og:locale" content="ja_JP">
```

### OGP画像の推奨構成
- 横1200×縦630px
- タイトル文字：「屋上防水工事の費用相場【2026年版】」
- サブ：「工法別単価 × 建物種別 × 20年コスト」
- ブランドロゴ（右下）

---

## Twitter Card設定

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="【2026年版】屋上防水工事の費用相場｜工法別の単価と業者選びの完全ガイド">
<meta name="twitter:description" content="屋上防水工事の費用相場を工法別に2026年4月時点で比較。費用内訳・建物×工法マトリクス・20年長期コスト・業者選定・見積交渉まで網羅。">
<meta name="twitter:image" content="https://example.com/ogp/okujo-bousui-2026.jpg">
```

---

## 構造化データ（JSON-LD）

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "【2026年版】屋上防水工事の費用相場｜工法別の単価と業者選びの完全ガイド",
  "description": "屋上防水工事の費用相場を工法別に2026年4月時点で比較。費用内訳・建物×工法マトリクス・20年長期コスト・業者選定・見積交渉まで網羅。",
  "image": "https://example.com/ogp/okujo-bousui-2026.jpg",
  "author": {
    "@type": "Organization",
    "name": "○△建設（架空）"
  },
  "publisher": {
    "@type": "Organization",
    "name": "○△建設オウンドメディア",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-04-17",
  "dateModified": "2026-04-17"
}
```

---

## 内部リンク候補

本記事から以下の関連記事へ内部リンクを張る：
- `/articles/urethane-bousui-detail`（ウレタン防水の詳細解説）
- `/articles/sheet-bousui-detail`（シート防水の詳細解説）
- `/articles/mansion-shuzen-flow`（マンション大規模修繕の進め方）
- `/articles/bousui-hojokin-2026`（2026年版 防水補助金まとめ）

---

## まとめ｜5工程パイプラインの総括

| 工程 | 成果物 | PoCでの所要 |
|------|-------|------------|
| 1. 競合分析 | 01-competitor-analysis.md | WebSearch×2 + 整理5分 |
| 2. ユーザーニーズ | 02-user-needs.md | 読解と再構成10分 |
| 3. 構成案 | 03-outline.md | H2/H3設計10分 |
| 4. 本文 | 04-body.md | 導入+冒頭H2を完成稿、残りは骨子 |
| 5. メタ | 05-meta.md | 各メタ生成5分 |

**学習価値**：この5工程はMarkdownファイルで疎結合のため、別キーワードに差し替えたら同じパイプラインが動く。次回はこの5工程を一つのSkill（`/seo [キーワード]`）に凝縮すれば、Skills Creator接続として完成する。

---

## 次工程への受け渡し（動画台本側）

このPoCの学びを台本に反映する際のポイント：
- **工程1の所要時間**（WebSearch×2回で8〜10分の素材取得）
- **工程間の受け渡し**がMarkdownで完結することの手触り
- **80%再現の実感**：各工程を独立実行でき、再現性が高い
- **20%の人間監修**：地域差・一次情報・現場写真の追加はAIでなく人間の役割
