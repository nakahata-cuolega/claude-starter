---
name: gen-image
description: 画像を生成する。Codex CLI経由でgpt-image-2を呼び、ChatGPTサブスク枠内で生成する(APIキー不要)。「画像を作って」「〜のイラストを生成して」「アイコン/ロゴ/挿絵が欲しい」と言われたら使う。
---

# gen-image

Codex CLI(ChatGPTサブスク認証)の組み込み画像生成ツール(gpt-image-2)で画像を生成する。API課金は発生せず、ユーザーのChatGPTサブスク利用枠を消費する。

## 手順

1. **要件の確認**: 内容(被写体・スタイル・色・雰囲気)、用途、サイズ、保存先。指定がなければ:
   - サイズ: 1024x1024、品質: low(試作) / 用途が本番素材なら medium 以上を提案
   - 保存先: プロジェクト内の作業なら適切なアセットフォルダ、それ以外は `~/workspace/experiments/images/`
2. **プロンプトを組み立てる**: ユーザーの要望を、被写体・スタイル・構図・色・背景を明示した具体的な指示文にする。
3. **生成を実行**(保存先ディレクトリで):
   ```bash
   cd <保存先ディレクトリ>
   codex exec --skip-git-repo-check --ignore-user-config -s workspace-write --ephemeral \
     "あなたの画像生成ツール(gpt-image-2)を使って、「<プロンプト>」の画像を1枚生成してください。品質は <low|medium|high>、サイズは <WxH> で。カレントディレクトリに <ファイル名>.png という名前で保存し、保存した絶対パスを報告してください。"
   ```
   - 数分かかることがある(timeoutは7分程度に設定)
   - 参考画像を渡す場合は `-i <画像パス>`(最大16枚)を付け、プロンプトで「添付画像を参考に」と指示する
4. **結果確認**: 生成されたPNGをReadで開いて内容を目視確認し、ユーザーに見せる。要望とずれていたら修正プロンプトで再生成を提案する。
5. **報告**: 保存パスと、必要なら次のバリエーション案。

## トラブルシューティング

- `Your access token could not be refreshed` → 認証切れ。`codex login` をバックグラウンド起動し、ユーザーにブラウザでの承認を依頼する。
- `codex: command not found` → `/Applications/Codex.app/Contents/Resources/codex` へのシンボリックリンクを `/opt/homebrew/bin/codex` に張る(Codexデスクトップアプリ同梱のCLIを使う)。アプリ自体がない場合は `npm install -g @openai/codex`。

## 注意

- 画像生成ターンは通常のCodex利用より3〜5倍速くサブスク枠を消費する。大量生成の前にはユーザーに一言確認する。
- 目安: low/1024x1024 で約1.8万トークン。
