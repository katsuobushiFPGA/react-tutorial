# React.dev 学習リポジトリ

[React.dev](https://ja.react.dev/) の公式チュートリアルを手を動かしながら学ぶためのリポジトリです。
各章の学習内容をマークダウンにまとめつつ、実際のコードを `my-app/` で試しています。

## 技術スタック

- **React** 19.x
- **TypeScript**
- **Vite**
- **ESLint**

## 学習の進め方

- React.dev のドキュメントを読み、コードは AI を使わず**手書き**で実装
- 学んだこと・疑問点・気づきをマークダウンに記録
- コンポーネントは学習トピックごとにファイル分割

## 学習記録

| # | ファイル | 内容 |
|---|---------|------|
| 0 | [0_history.md](./0_history.md) | プロジェクト開始・学習方針・React.dev ガイド概要 |
| 1 | [1_ui_component.md](./1_ui_component.md) | UI コンポーネントの基礎・export/import・コンポーネントのネスト |
| 2 | [2_component_import_export.md](./2_component_import_export.md) | デフォルトエクスポート vs 名前付きエクスポート |
| 3 | [3_jsx_markup.md](./3_jsx_markup.md) | JSX のマークアップルール・HTML → JSX 変換 |
| 4 | [4_jsx_braces.md](./4_jsx_braces.md) | JSX での `{}` を使った JavaScript の埋め込み・インライン CSS |
| 5 | [5_props.md](./5_props.md) | Props の基本・分割代入・スプレッド構文・`children` props |
| 6 | [6_conditinal-rendering.md](./6_conditinal-rendering.md) | `if/else`・三項演算子・`&&` による条件付きレンダリング |
| 7 | [7_rendering-lists.md](./7_rendering-lists.md) | `map()`・`filter()`・`key` の重要性 |
| 8 | [8_keeping_components-pure.md](./8_keeping_components-pure.md) | 純関数・副作用・StrictMode |

## プロジェクト構成

```
react-dev/
├── *.md             # 各章の学習記録
└── my-app/          # Vite + React + TypeScript アプリ
    └── src/
        ├── App.tsx              # すべてのコンポーネントを集約
        ├── Profile.tsx          # 最初のコンポーネント例
        ├── Avatar.tsx           # Props デモ
        ├── Braces.tsx           # JSX 波括弧デモ
        ├── Card.tsx             # children props デモ
        ├── Props.tsx            # 複数 props デモ
        ├── Spread.tsx           # スプレッド構文デモ
        ├── PackingList.tsx      # 条件付きレンダリング
        ├── List.tsx             # リストレンダリング
        ├── HtmlToJsx.tsx        # HTML → JSX 変換実践
        ├── data.tsx             # サンプルデータ（科学者一覧）
        └── Utils.tsx            # 共通ユーティリティ
```

## 開発サーバーの起動

```bash
cd my-app
npm install
npm run dev
```
