---
name: make-skill
description: 新しいClaude Codeスキルを作成・編集する。「スキルを作りたい」「この作業をスキル化して」「毎回やる手順を自動化したい」と言われたら使う。
---

# make-skill

ユーザーの繰り返し作業をスキルとして `~/claude-env/claude/skills/` に保存する。

## スキルの構造

```
~/claude-env/claude/skills/<skill-name>/
└── SKILL.md          # 必須。frontmatter + 手順
    references/       # 任意。長い参考資料はここに分割
    scripts/          # 任意。補助スクリプト
```

`SKILL.md` の frontmatter:
```yaml
---
name: <kebab-case-name>
description: <いつ使うかが分かる1〜2文。トリガーになるユーザーの言い回しを含める>
---
```

`public` は claude-starter(公開リポジトリ)に載せるかどうかのフラグ。**新規作成時は必ず `false`**(安全側デフォルト)。ユーザーが「公開して」と言ったときだけ `true` に変え、/publish-skill で同期する。

## 手順

1. ユーザーにやりたい作業の内容を確認する。既に会話の中で手順が確立している場合はそれをそのまま素材にする。
2. 既存スキル(`ls ~/claude-env/claude/skills/`)と重複しないか確認。近いものがあれば新規作成ではなく既存を拡張する。
3. スキル名は kebab-case、descriptionには「いつ発動すべきか」とユーザーが言いそうなフレーズを必ず含める(これがスキル選択の判断材料になる)。
4. 本文は「モデルへの指示書」として書く:
   - 手順は番号付きリストで具体的に
   - 実行すべきコマンドはコードブロックで
   - 判断が分かれる箇所は判断基準を明記
   - 300行を超えるなら `references/` に分割
5. 作成後、`~/claude-env` でコミットする(メッセージ例: `feat: add <skill-name> skill`)。
6. ユーザーに「新しいセッションから `/<skill-name>` で使えます」と伝える。
