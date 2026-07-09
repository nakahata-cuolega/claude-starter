---
name: gen-ogp
description: サイトのOGP画像(SNSシェア画像)をHTML+Playwright撮影方式で生成する。「OGP作って」「OGP画像を更新して」「シェア画像を作って」と言われたら使う。サイトの実際の配色・フォントを忠実に再現でき、日本語テキストも崩れない(AI画像生成の /gen-image はOGPには使わない)。
---

# gen-ogp

OGP画像(標準 1200×630)を、対象サイトのデザイントークンを使ったHTMLとして組み、Playwrightで撮影して生成する。

AI画像生成(/gen-image)ではなくこの方式を使う理由: OGPにはサイト名やキャッチコピーなどの日本語テキストが必須で、AI生成は文字が崩れる。HTML方式なら実サイトと同じフォント・配色を正確に再現できる。

## 手順

1. **対象サイトのデザイントークンを収集する**:
   - `globals.css` / Tailwind の `@theme` から色(背景・アクセント・文字色)
   - `layout.tsx` からフォント(Google Fontsなら css2 の `<link>` で同じものを読み込める)
   - トップページのヒーローの構図(OGPはヒーローの縮図にするとサイトと世界観が揃う)
2. **HTMLを書く**(スクラッチパッド等の一時ディレクトリに):
   - `body { width: 1200px; height: 630px; overflow: hidden; }` 固定
   - Webフォントは `<link href="https://fonts.googleapis.com/css2?family=...">` で読み込む(撮影スクリプトが `document.fonts.ready` を待つ)
   - 構成の基本: 左にサイト名+キャッチコピー(見出しフォント)、右にサイトを象徴するビジュアル要素、背景はサイトのトーン
   - 文字サイズは大きめに(SNSのタイムラインでは縮小表示される。キャッチコピー 48px 以上目安)
3. **ツールの準備**(初回のみ):
   ```bash
   cd ~/.claude/skills/gen-ogp/scripts
   [ -d node_modules ] || (npm install && npx playwright install chromium)
   ```
4. **撮影**:
   ```bash
   node ~/.claude/skills/gen-ogp/scripts/render-ogp.mjs <html-path> <output.jpg>
   ```
   サイズ変更は `--width` / `--height`、画質は `--quality`(既定90)。出力先を `.png` にすればPNG。
5. **目視確認**: 生成画像をReadで開き、特に以下をチェックする:
   - 日本語見出しの不自然な折り返し(1〜2文字だけ次行に落ちる等)→ フォントサイズ調整 or `white-space: nowrap`
   - 端の見切れ・余白バランス
   問題があればHTMLを直して再撮影(2〜3回の反復は普通)。
6. **配置**: プロジェクトの `public/ogp.jpg` 等に配置し、`layout.tsx` の `metadata.openGraph.images` のパス・サイズ指定と一致しているか確認する。
7. **後始末**: 使ったHTMLは `<project>/ogp/ogp.html` として**プロジェクト側に保存しておく**(次回の更新が差分編集で済む)。コミットに含める。

## 補足

- X(Twitter)等は旧画像をキャッシュする。デプロイ後すぐ反映されなくても異常ではない。
- ダークテーマ版OGPは通常不要(OGPは1枚固定)。サイトのライトトーンで作る。
