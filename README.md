# claude-starter

Claude Code をすぐに活用できるようにするスキル集です。
セットアップから使い方までは、ナビサイト(準備中)がステップバイステップで案内します。

## 収録スキル

| スキル | 説明 |
|--------|------|
| `/new-project` | 新しいプロジェクト(Webサイト / APIサービス / 実験)を標準構成で一発作成 |
| `/make-skill` | 繰り返し作業を自分専用のスキルとして自動化 |
| `/ship` | コミット→push→デプロイ反映の確認まで一気に実行 |
| `/screenshot-check` | サイトをPC幅・スマホ幅・ダークモードで撮影して表示崩れをチェック |
| `/gen-image` | Codex CLI経由でgpt-image-2を呼び、ChatGPTサブスク枠内で画像生成(APIキー不要) |
| `/gen-banner` | 広告バナーをコピー案付きでサイズ別・複数案生成 |
| `/analyze` | CSV等のデータを分析し、グラフ付きレポートを作成 |
| `/wrap-up` | 作業の締め: 未コミット回収→push→まとめ報告 |

## インストール

```bash
git clone https://github.com/nakahata-cuolega/claude-starter.git
mkdir -p ~/.claude/skills
cp -r claude-starter/skills/* ~/.claude/skills/
```

新しい Claude Code セッションを開くと `/new-project` などが使えるようになります。

## 必要なもの

- [Claude Code](https://claude.com/claude-code)(`npm install -g @anthropic-ai/claude-code`)
- Git

## ライセンス

MIT
