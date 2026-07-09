---
name: screenshot-check
description: サイトをPC幅・スマホ幅・ダークモードでスクリーンショット撮影し、表示崩れがないか目視確認して報告する。「表示確認して」「スクショ撮って」「スマホで崩れてないか見て」と言われたら使う。UI変更後の /ship でも使う。
---

# screenshot-check

このスキルに同梱の `scripts/shoot.mjs`(Playwright)でサイトの各ページを撮影し、画像を読み込んで表示崩れを確認する。

## 手順

1. **対象URLの決定**:
   - ユーザーがURLを指定していればそれを使う
   - 指定がなければプロジェクトの `CLAUDE.md` / `AGENTS.md` の `Live URL:` を使う
   - ローカルの変更を確認したい場合は開発サーバー(`npm run dev` 等)を起動してそのURLを使う
2. **確認するパスの決定**: 主要ページ全部(トップ+ナビにあるページ)。変更確認なら変更したページだけでよい。
3. **ツールの準備**(初回のみ):
   ```bash
   cd ~/.claude/skills/screenshot-check/scripts
   [ -d node_modules ] || (npm install && npx playwright install chromium)
   ```
4. **撮影**(出力先はスクラッチパッド等の一時ディレクトリ):
   ```bash
   node ~/.claude/skills/screenshot-check/scripts/shoot.mjs <baseURL> <path1> <path2> ... --out <一時ディレクトリ>/shots
   ```
   PC幅(1280px)・スマホ幅(390px)・ダークモード(1280px)の3種 × 各パスが撮影される。
5. **目視確認**: 各PNGをReadで開き、次の観点でチェックする:
   - テキストの不自然な折り返し・縦書き化・見切れ
   - 要素のはみ出し(横スクロール発生)・重なり
   - ダークモードでのコントラスト不足(読めない文字)
   - 画像・アイコンの欠落
   - スマホ幅でのタップ領域の窮屈さ
6. **報告**: 問題なければ「全て正常」、問題があれば該当スクリーンショットと箇所・原因・修正案を提示する。修正の実施はユーザーの指示を待つ(/shipの一部として実行中なら修正まで行う)。

## 補足

- クリック後の状態(ウィザードの選択後など)を撮りたい場合は、`scripts/shoot.mjs` を参考にその場で専用スクリプトを書く。**専用スクリプトはこのスキルの `scripts/` ディレクトリ内に置いて実行すること**(playwright はスクリプトファイルの場所から解決されるため、他の場所に置くと `ERR_MODULE_NOT_FOUND` になる)。実行後は削除してよい。
- Chromiumのダウンロード(初回約100MB)が走ることがある。
- `scripts/` はPlaywright系スキルの共用置き場でもある: `render-ogp.mjs` は /gen-ogp が使う(このスキルからは使わないが削除しないこと)。
