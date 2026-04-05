# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

[React.dev](https://ja.react.dev/) の公式チュートリアルを学ぶためのリポジトリ。
各セクションの学習ノート（Markdown）と、実際にコードを動かすための Vite + React + TypeScript アプリで構成される。

## 学習方針

- **コードは手書き**: AI にコードを書かせず、自分で手を動かして実装する
- **疑問点は AI に質問**: 理解できない概念は質問し、`*_ai_question_summary.md` にまとめる
- **学んだことはノートに記録**: 各トピックを Markdown ファイルに整理する

## ディレクトリ構成

| ディレクトリ | 役割 |
|---|---|
| `1_ui/` | セクション1 学習ノート（UI の記述） |
| `2_interactivity/` | セクション2 学習ノート（インタラクティビティ） |
| `3_state/` | セクション3 学習ノート（state の管理） |
| `4_escape_hatches/` | セクション4 学習ノート（避難ハッチ） |
| `6_todo-app/` | Todo アプリ チュートリアル 学習ノート |
| `my-app/` | セクション1 用アプリ |
| `interactivity/` | セクション2 用アプリ |
| `state/` | セクション3 用アプリ |
| `escape-hatches/` | セクション4 用アプリ |
| `tic-tac-toe/` | チュートリアル: 三目並べ |
| `todo-app/` | チュートリアル: Todo アプリ |

## 開発コマンド

各アプリは独立した Vite プロジェクト。対象ディレクトリに移動して起動する。

```bash
cd <app-dir>   # my-app / interactivity / state / escape-hatches / tic-tac-toe / todo-app
npm install    # 初回のみ
npm run dev
```

## AI への依頼ガイドライン

- コードの実装は行わない（学習者が自分で書く）
- 概念の説明・疑問への回答・ノートの整理は歓迎
- README.md や CLAUDE.md の更新など、ドキュメント整備は行ってよい
