# Lessons

## 台本の動詞ルール（2026-04-21）

「食わせる」「投げる」は台本で使わない。

- `食わせる` → `与える`
- `投げる` → `渡す`

CLAUDE.mdの文体ルール（比喩禁止・言い切り）と同じ方向性。次回から初稿で使わない。

---

## サンプルCSVはUTF-8 BOM付きで作成する（2026-04-21）

日本語を含むCSVをUTF-8 BOMなしで作成すると、Excel / Numbersで文字化けする。

- 作成時から `printf '\xef\xbb\xbf'` を先頭に付けるか、エディタのBOM付きUTF-8で保存する
- 後から修正する場合: `printf '\xef\xbb\xbf' | cat - file.csv > tmp && mv tmp file.csv`
