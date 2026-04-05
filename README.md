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
| 2 | [2_responding-to-events.md](./2_interactivity/2_responding-to-events.md) | イベントへの応答 |
| - | [2_ai_question_summary.md](./2_interactivity/2_ai_question_summary.md) | AI への質問まとめ |
| 3 | [3_state-a-components-memory.md](./2_interactivity/3_state-a-components-memory.md) | state: コンポーネントのメモリ |
| - | [3_ai_question_summary.md](./2_interactivity/3_ai_question_summary.md) | AI への質問まとめ |
| 4 | [4_render_and_commit.md](./2_interactivity/4_render_and_commit.md) | レンダーとコミット |
| - | [4_ai_question_summary.md](./2_interactivity/4_ai_question_summary.md) | AI への質問まとめ |
| 5 | [5_state-as-a-snapshot.md](./2_interactivity/5_state-as-a-snapshot.md) | state はスナップショットである |
| 6 | [6_queueing-a-series-of-state-updates.md](./2_interactivity/6_queueing-a-series-of-state-updates.md) | 一連の state の更新をキューに入れる |
| - | [6_ai_question_summary.md](./2_interactivity/6_ai_question_summary.md) | AI への質問まとめ |
| 7 | [7_updating-objects-in-state.md](./2_interactivity/7_updating-objects-in-state.md) | state 内のオブジェクトの更新 |
| - | [7_ai_question_summary.md](./2_interactivity/7_ai_question_summary.md) | AI への質問まとめ |
| 8 | [8_updating-arrays-in-state.md](./2_interactivity/8_updating-arrays-in-state.md) | state 内の配列の更新 |
| - | [8_ai_question_summary.md](./2_interactivity/8_ai_question_summary.md) | AI への質問まとめ |

### 3. state の管理 (`3_state/`)

| # | ファイル | 内容 |
|---|---------|------|
| 2 | [2_reacting-to-input-with-state.md](./3_state/2_reacting-to-input-with-state.md) | state を使って入力に反応する |
| 3 | [3_choosing-the-state-structure.md](./3_state/3_choosing-the-state-structure.md) | state 構造の選択 |
| - | [3_ai_question_summary.md](./3_state/3_ai_question_summary.md) | AI への質問まとめ |
| 4 | [4_sharing-state-between-components.md](./3_state/4_sharing-state-between-components.md) | コンポーネント間での state の共有 |
| 5 | [5_preserving-and-resetting-state.md](./3_state/5_preserving-and-resetting-state.md) | state の保持とリセット |
| - | [5_qi_question_summary.md](./3_state/5_qi_question_summary.md) | AI への質問まとめ |

### 4. 避難ハッチ (`4_escape_hatches/`)

| # | ファイル | 内容 |
|---|---------|------|
| - | [1_ai_question_summary.md](./4_escape_hatches/1_ai_question_summary.md) | AI への質問まとめ (useReducer) |
| 2 | [2_referenceing-values-with-refs.md](./4_escape_hatches/2_referenceing-values-with-refs.md) | ref で値を参照する |
| - | [2_ai_question_summary.md](./4_escape_hatches/2_ai_question_summary.md) | AI への質問まとめ (useRef) |
| 3 | [3_manipulating-the-dom-with-refs.md](./4_escape_hatches/3_manipulating-the-dom-with-refs.md) | ref で DOM を操作する |
| - | [3_ai_question_summary.md](./4_escape_hatches/3_ai_question_summary.md) | AI への質問まとめ (ref) |
| 4 | [4_synchronizing-with-effects.md](./4_escape_hatches/4_synchronizing-with-effects.md) | エフェクトを使った同期 |
| - | [4_ai_question_summary.md](./4_escape_hatches/4_ai_question_summary.md) | AI への質問まとめ (Effect) |
| 5 | [5_you-might-not-need-an-effect.md](./4_escape_hatches/5_you-might-not-need-an-effect.md) | エフェクトは必要ないかもしれない |
| - | [5_ai_question_summary.md](./4_escape_hatches/5_ai_question_summary.md) | AI への質問まとめ |
| 6 | [6_lifecycle-of-reactive-effects.md](./4_escape_hatches/6_lifecycle-of-reactive-effects.md) | リアクティブエフェクトのライフサイクル |
| 7 | [7_separating-events-from-effects.md](./4_escape_hatches/7_separating-events-from-effects.md) | イベントとエフェクトを切り離す |
| - | [7_ai_question_summary.md](./4_escape_hatches/7_ai_question_summary.md) | AI への質問まとめ |
| 8 | [8_removing-effect-dependencies.md](./4_escape_hatches/8_removing-effect-dependencies.md) | エフェクトの依存関係を取り除く |
| - | [8_ai_question_summary.md](./4_escape_hatches/8_ai_question_summary.md) | AI への質問まとめ |
| 9 | [9_reusing-logic-with-custom-hooks.md](./4_escape_hatches/9_reusing-logic-with-custom-hooks.md) | カスタムフックでロジックを再利用する |
| - | [9_ai_question_summary.md](./4_escape_hatches/9_ai_question_summary.md) | AI への質問まとめ |

### Todo アプリ チュートリアル (`6_todo-app/`)

| # | ファイル | 内容 |
|---|---------|------|
| - | [ai_question_summary.md](./6_todo-app/ai_question_summary.md) | AI への質問まとめ |

## プロジェクト構成

```
react-dev/
├── 1_ui/                # セクション1: UI の記述（学習ノート）
├── 2_interactivity/     # セクション2: インタラクティビティ（学習ノート）
├── 3_state/             # セクション3: state の管理（学習ノート）
├── 4_escape_hatches/    # セクション4: 避難ハッチ（学習ノート）
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
├── interactivity/       # セクション2 用 Vite + React + TS アプリ
│   └── src/
│       ├── App.tsx              # インタラクティビティデモ集約
│       ├── Counter.tsx          # カウンター（state）
│       ├── CounterList.tsx      # カウンターリスト
│       ├── Gallery.tsx          # ギャラリー
│       ├── Image.tsx            # 画像コンポーネント
│       ├── Form.tsx             # フォーム
│       ├── Form2.tsx            # フォーム（別パターン）
│       ├── Form3.tsx            # フォーム（state スナップショット）
│       ├── Form4.tsx            # フォーム（state 更新キュー）
│       ├── Form5.tsx            # フォーム（オブジェクト state）
│       ├── Form6.tsx            # フォーム（ネストオブジェクト state）
│       ├── Toolbar.tsx          # ツールバー（イベント）
│       ├── Signup.tsx           # サインアップフォーム
│       ├── BucketList.tsx       # バケットリスト
│       ├── List.tsx ~ List4.tsx # リスト（配列 state デモ）
│       ├── ShapeEditor.tsx      # 図形エディタ（配列 state デモ）
│       ├── MovingDot.tsx        # 移動するドット（オブジェクト state）
│       └── data.tsx             # サンプルデータ
├── state/               # セクション3 用 Vite + React + TS アプリ
├── escape-hatches/      # セクション4 用 Vite + React + TS アプリ
│   └── src/
│       ├── App.tsx              # Modal をラップするエントリポイント
│       └── Modal.tsx            # モーダル（useEffect + useRef デモ）
├── 6_todo-app/          # Todo アプリ チュートリアル（学習ノート）
│   └── ai_question_summary.md  # AI への質問まとめ
├── tic-tac-toe/         # チュートリアル: 三目並べゲーム
│   └── src/
│       ├── App.tsx              # エントリポイント
│       └── Game.tsx             # ゲームロジック（Square / Board / Game）
└── todo-app/            # チュートリアル: Todo アプリ
    └── src/
        ├── App.tsx              # エントリポイント
        ├── TodoApp.tsx          # Todo アプリメインコンポーネント
        ├── Todo.tsx             # 個別 Todo コンポーネント
        ├── List.tsx             # Todo リスト
        ├── Header.tsx           # ヘッダー（追加フォーム）
        ├── Footer.tsx           # フッター（フィルター）
        ├── Hint.tsx             # ヒント表示コンポーネント
        └── types/               # 型定義（index.ts, todo.ts）
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

# セクション3: state の管理
cd state
npm install
npm run dev

# セクション4: 避難ハッチ
cd escape-hatches
npm install
npm run dev

# チュートリアル: 三目並べ
cd tic-tac-toe
npm install
npm run dev

# チュートリアル: Todo アプリ
cd todo-app
npm install
npm run dev
```
