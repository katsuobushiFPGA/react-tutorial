# Todo アプリ 実装メモ・レビューまとめ

## データの持ち方・状態管理

### フィルター状態の実装

フィルターを実装する際、元データ（`todos`）をフィルタリングして書き換えてはいけない。
元データはソースオブトゥルースとして保持し、表示用リストはレンダリング時に派生計算する。

```ts
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<FilterStatus>("All");

// useState ではなくただの変数 — state から計算するだけ
const filteredTodos = todos.filter((t) => {
  if (filter === "Active") return !t.done;
  if (filter === "Completed") return t.done;
  return true;
});
```

`filteredTodos` を `useState` にしない点がポイント。`todos` か `filter` が変わるたびに自動的に再計算される。

---

### 全選択ボタン（toggle-all）の状態管理

`checkAllFlg` を `Header` の内部 state として持つのは NG。

**問題シナリオ：**
1. todo を3件追加
2. チェックボックスを個別に3件全部チェック（全選択ボタンは使わない）
3. この時点で `checkAllFlg = false`（Header は個別操作を知らない）
4. 全選択ボタンをクリック → `!false = true` → 全件チェック済みなので何も変わらない
5. もう一度クリックして初めて全解除される（2クリック必要）

**正しい設計：** `allChecked` は `todos` から派生させ、親から prop として渡す。

```ts
// Todo.tsx
const allChecked = todos.length > 0 && todos.every((t) => t.done);

// Header.tsx（内部 state 不要）
<button onClick={() => onCheck(!allChecked)} />
```

---

### setTodos の呼び出し方

`setTodos` は常に `prev =>` を使う関数型更新で統一する。直接 state を参照すると stale closure のリスクがある。

```ts
// NG: 古い todos を直接参照（stale closure のリスク）
setTodos([...todos, { id: genId(), text, done: false }]);

// OK: prev を使って安全に更新
setTodos((prev) => [...prev, { id: genId(), text, done: false }]);
```

---

### 子コンポーネントへの責務の渡し方

`List` に `activeFilterStatus` を渡してメッセージを分岐させるのではなく、親がメッセージを決定して渡す。`List` はフィルターの概念を知らなくて済む。

```tsx
// Todo.tsx
const emptyMessage =
  todos.length === 0 ? "タスクを追加してください" : "該当するタスクはありません";

<List data={filteredTodos} emptyMessage={emptyMessage} ... />
```

---

### editingId の配置

編集中の todo ID（`editingId`）は `List` ではなく `Todo.tsx` に持たせる。

- 削除やフィルター切り替え時に `editingId` をリセットしやすい
- 編集確定（テキスト更新）も親の `todos` state を更新する必要があるため、親で管理した方がライフサイクルを統一できる

---

## 制御 input と非制御 input

### 使い分けの基準

「React から値を書き換えたいかどうか」が基準。

| ケース | 方式 |
|---|---|
| 初期値をセットするだけ、確定時に値を読み取る | 非制御（`defaultValue`） |
| 送信後クリア、外部からリセットなど React から値を変更したい | 制御（`value`） |

### 編集 input に defaultValue を使う理由

編集 input は「入力中の値をリアルタイムで使う必要がない（確定時だけ値が必要）」ため非制御で十分。`editText` state が不要になる。

```tsx
<input
  className="todo-edit-input"
  type="text"
  defaultValue={d.text}
  onKeyDown={(e) => {
    if (e.key === "Enter") onEditText(d.id, e.currentTarget.value);
    if (e.key === "Escape") onEditText(d.id, d.text);
  }}
  onBlur={(e) => onEditText(d.id, e.currentTarget.value)}
/>
```

### Header の input が制御 input である理由

送信後に `setText("")` で値をリセットしている。非制御 input の値は React から変更できないため、制御 input が必要。

---

## バグ・落とし穴

### 条件分岐で controlled → uncontrolled 警告が出る

React はフラグメント（`<>`）の中身を親要素の直接の子としてインデックスで管理する。

```
通常時の li の子: [input(checkbox), label, button]
編集時の li の子: [input(text)]
```

インデックス 0 の `input` が同じ要素として再利用されるため、`checked` で制御していた checkbox が `defaultValue` の非制御 input に変わったと判断されて警告が出る。

**修正：** `key` を付けて別要素だと React に教える。

```tsx
{d.id !== editingId ? (
  <React.Fragment key="view">
    <input className="todo-check" ... />
    <label ... />
    <button ... />
  </React.Fragment>
) : (
  <input key="edit" className="todo-edit-input" ... />
)}
```

---

### 演算子の優先順位（文字列結合 + 三項演算子）

```ts
// NG: + が === より優先されるため "filter-btn All" === "All" が常に false になる
"filter-btn " + activeFilterStatus === "All" ? "active" : ""

// OK: テンプレートリテラルを使う
`filter-btn ${activeFilterStatus === "All" ? "active" : ""}`
```

---

### e.target と e.currentTarget の違い

`e.target` の型は `EventTarget` で `.value` などのプロパティが存在しない。イベントハンドラ内では `e.currentTarget` を使うと React が `HTMLInputElement` として型付けしてくれるため cast 不要。

```ts
// NG: TypeScript エラー
e.target.value

// OK
e.currentTarget.value
```

---

### キー名の注意

```ts
// NG
e.key === "Esc"

// OK
e.key === "Escape"
```

---

### onKeyDown vs onKeyUp

`onKeyUp` はキーを離したタイミング。`onKeyDown` の方がレスポンスが早く感じられるため、テキスト入力の確定処理には `onKeyDown` を使う。

---

### ダブルクリック後の focus

`onDoubleClick` のタイミングでは編集 input がまだ DOM に存在しないため、`ref.focus()` を呼んでも `null` のまま。

- シンプルな解決策: `autoFocus` を付ける
- カーソルを末尾に移動したい場合: callback ref を使う

```tsx
// autoFocus
<input autoFocus ... />

// callback ref（カーソル末尾移動）
ref={(el) => {
  if (el) {
    el.focus();
    el.selectionStart = el.value.length;
  }
}}
```

---

## コンポーネント設計

### 現状の構成

```
App.tsx
└── Todo.tsx（状態コンテナ）
    ├── TodoApp.tsx（div ラッパー）
    │   ├── Header.tsx（入力 + toggle-all）
    │   ├── List.tsx（リスト表示 + 編集 UI）
    │   └── Footer.tsx（フィルター + カウント + Clear completed）
    └── Hint.tsx
```

### 気になる点

- `TodoApp.tsx` は `<div className="todo-app">{children}</div>` を返すだけで存在意義が薄い
- `App.tsx` も `<Todo />` を返すだけで `Todo.tsx` との役割が重複している
- `types/todo.ts` に定義された `TodoProps` が `TodoApp.tsx` で使われていない

### スケール感

現状（`todos`・`filter`・`editingId` 程度の state）なら `Todo.tsx` に全部まとめる設計で十分。state が増えてきたら `useReducer` や Context への移行を検討する。

---

## 英語表記

- `0 items left` / `1 item left` / `2 items left`（`activeCount !== 1` で `s` を付ける）
