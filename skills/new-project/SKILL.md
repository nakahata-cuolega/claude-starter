---
name: new-project
description: 新しいプロジェクト(Webサイト / APIサービス / 実験スクリプト)を標準構成でスキャフォールドする。「新しいサイトを作りたい」「新規プロジェクト」「プロジェクトを始めたい」と言われたら使う。
---

# new-project

ユーザーの目的を確認し、以下の標準構成でプロジェクトを作成する。

## 手順

1. プロジェクト名と種類(サイト / APIサービス / 実験)を確認する。引数で渡されていればそれを使う。
2. 種類に応じて配置先を決める:
   - サイト → `~/workspace/sites/<name>`
   - APIサービス → `~/workspace/services/<name>`
   - 実験 → `~/workspace/experiments/<name>`
3. 種類ごとのセットアップ:

### サイト (Next.js)
```bash
cd ~/workspace/sites
npx create-next-app@latest <name> --typescript --tailwind --eslint --app --src-dir --use-npm --yes
```

### APIサービス (Python / FastAPI)
```bash
cd ~/workspace/services
uv init <name> && cd <name>
uv add fastapi "uvicorn[standard]" pydantic-settings httpx
```
`app/main.py` に最小のFastAPIアプリを作成し、`uv run uvicorn app.main:app --reload` で起動確認する。

### 実験 (Python スクリプト)
```bash
cd ~/workspace/experiments
uv init <name>
```

4. 共通の仕上げ(全種類):
   - `git init` して初回コミット
   - `.env.example` を作成(使う予定のAPIキーをプレースホルダで列挙)
   - `.gitignore` に `.env*` が含まれることを確認(`.env.example` は除外しない)
   - プロジェクト直下に `CLAUDE.md` を作成し、プロジェクトの目的・技術スタック・起動コマンドを記載
5. 起動コマンドを実行して動くことを確認してから完了報告する。
