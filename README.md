# React.dev 学習リポジトリ

[React.dev](https://ja.react.dev/) の公式チュートリアルを手を動かしながら学ぶためのリポジトリです。
各章の学習内容をマークダウンにまとめつつ、実際のコードをアプリで試しています。

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

### 1. UI の記述 (`1_ui/`)

| # | ファイル | 内容 |
|---|---------|------|
| 0 | [0_history.md](./1_ui/0_history.md) | プロジェクト開始・学習方針・React.dev ガイド概要 |
| 1 | [1_ui_component.md](./1_ui/1_ui_component.md) | UI コンポーネントの基礎・export/import・コンポーネントのネスト |
| 2 | [2_component_import_export.md](./1_ui/2_component_import_export.md) | デフォルトエクスポート vs 名前付きエクスポート |
| 3 | [3_jsx_markup.md](./1_ui/3_jsx_markup.md) | JSX のマークアップルール・HTML → JSX 変換 |
| 4 | [4_jsx_braces.md](./1_ui/4_jsx_braces.md) | JSX での `{}` を使った JavaScript の埋め込み・インライン CSS |
| 5 | [5_props.md](./1_ui/5_props.md) | Props の基本・分割代入・スプレッド構文・`children` props |
| 6 | [6_conditinal-rendering.md](./1_ui/6_conditinal-rendering.md) | `if/else`・三項演算子・`&&` による条件付きレンダリング |
| 7 | [7_rendering-lists.md](./1_ui/7_rendering-lists.md) | `map()`・`filter()`・`key` の重要性 |
| 8 | [8_keeping_components-pure.md](./1_ui/8_keeping_components-pure.md) | 純関数・副作用・StrictMode |
| 9 | [9_understanding-you-ui-as-a-tree.md](./1_ui/9_understanding-you-ui-as-a-tree.md) | UI をツリーとして理解する |

### 2. インタラクティビティ (`2_interactivity/`)

| # | ファイル | 内容 |
|---|---------|------|
| 1 | [1_adding-interactivity.md](./2_interactivity/1_adding-interactivity.md) | インタラクティビティの追加 |
| - | [1_ai_question_summary.md](./2_interactivity/1_ai_question_summary.md) | AI への質問まとめ |
| - | [2_ai_question_summary.md](./2_interactivity/2_ai_question_summary.md) | AI への質問まとめ |
| 2 | [2_responding-to-events.md](./2_interactivity/2_responding-to-events.md) | イベントへの応答 |
| 3 | [3_state-a-components-memory.md](./2_interactivity/3_state-a-components-memory.md) | state: コンポーネントのメモリ |
| - | [3_ai_question_summary.md](./2_interactivity/3_ai_question_summary.md) | AI への質問まとめ |

## プロジェクト構成

```
react-dev/
├── 1_ui/                # セクション1: UI の記述（学習ノート）
├── 2_interactivity/     # セクション2: インタラクティビティ（学習ノート）
├── my-app/              # セクション1 用 Vite + React + TS アプリ
│   └── src/
│       ├── App.tsx              # すべてのコンポーネントを集約
│       ├── Profile.tsx          # 最初のコンポーネント例
│       ├── Avatar.tsx           # Props デモ
│       ├── Braces.tsx           # JSX 波括弧デモ
│       ├── Card.tsx             # children props デモ
│       ├── Props.tsx            # 複数 props デモ
│       ├── Spread.tsx           # スプレッド構文デモ
│       ├── PackingList.tsx      # 条件付きレンダリング
│       ├── List.tsx             # リストレンダリング
│       ├── HtmlToJsx.tsx        # HTML → JSX 変換実践
│       ├── TextBox.tsx          # テキストボックス
│       ├── data.tsx             # サンプルデータ（科学者一覧）
│       └── Utils.tsx            # 共通ユーティリティ
└── interactivity/       # セクション2 用 Vite + React + TS アプリ
    └── src/
        ├── App.tsx              # インタラクティビティデモ集約
        ├── Counter.tsx          # カウンター（state）
        ├── Gallery.tsx          # ギャラリー
        ├── Form.tsx             # フォーム
        ├── Form2.tsx            # フォーム（別パターン）
        ├── Toolbar.tsx          # ツールバー（イベント）
        ├── Signup.tsx           # サインアップフォーム
        ├── BucketList.tsx       # バケットリスト
        └── data.tsx             # サンプルデータ
```

## 開発サーバーの起動

```bash
# セクション1: UI の記述
cd my-app
npm install
npm run dev

# セクション2: インタラクティビティ
cd interactivity
npm install
npm run dev
```
