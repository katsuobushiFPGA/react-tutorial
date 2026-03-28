# React 学習まとめ

## useReducer

### reducerとステートマシンの違い
- ステートマシンは「取りうる状態が有限で定義済み」というのが本質（FSM）
- reducerはそこまで厳密に状態を列挙しなくてもOK
- **reducerは「ステートマシンの考え方を緩く実装したもの」**というイメージが近い

### reducerの本質
「action（何が起きたか）を受け取って、stateをどう変えるかを決める関数」

```js
// useStateだと更新ロジックがイベントハンドラに散らばる
const handleAdd = () => setItems([...items, newItem]);
const handleDelete = (id) => setItems(items.filter(i => i.id !== id));

// useReducerだと「何が起きたか」だけ投げれば済む
dispatch({ type: 'added', item: newItem });
dispatch({ type: 'deleted', id });
// → どう変わるかはreducerの中だけで完結
```

---

## reducerとContextの組み合わせ

### dispatchを子に渡すメリット
- 子コンポーネントは「何が起きたか」をdispatchするだけでよい
- 「どう変わるか」は知らなくていい → **責務の分離**

```js
// 子コンポーネントはロジックを知らなくていい
function DeleteButton({ id }) {
  const dispatch = useContext(AppDispatchContext);
  return (
    <button onClick={() => dispatch({ type: 'deleted', id })}>
      削除
    </button>
  );
}
```

### actionの形（インターフェース）は知る必要がある
- 「どう変わるか（ロジック）」は知らなくていい
- 「何を渡すか（インターフェース）」は知る必要がある
- APIのエンドポイントとパラメータを知るのと同じ感覚

```ts
// TypeScriptだとactionの型を定義してミスを防げる
type Action =
  | { type: 'deleted'; id: number }
  | { type: 'added'; item: Item }
  | { type: 'edited'; id: number; text: string }
```

### Providerでまとめるメリット（カプセル化）
```js
// TasksProviderがない場合
function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <MyApp />
      </TasksDispatchContext>
    </TasksContext>
  );
}

// TasksProviderがある場合
function App() {
  return (
    <TasksProvider>
      <MyApp />
    </TasksProvider>
  );
}
```
使う側は初期値・reducer・contextの構造を知らなくていい。

### 設計思想のまとめ
すべて「**関心の分離・カプセル化**」という一つの思想の表れ：
- reducerに更新ロジックを集める
- dispatchだけ渡して子は「何が起きたか」だけ知る
- Providerでまとめて使う側はセットアップを知らなくていい

---

## カスタムフック

- `use`で始まる関数 = フックのルールが適用される特別な関数
- 内部で`useState`や`useContext`などのフックを呼べる
- `use`をつけない普通の関数の中でフックを呼ぶとエラー

```js
// ❌ useをつけない普通の関数の中でフックは呼べない
function getTasks() {
  return useContext(TasksContext); // エラー！
}

// ✅ useをつけたカスタムフックならOK
function useTasks() {
  return useContext(TasksContext);
}
```

`eslint-plugin-react-hooks`がカスタムフックを自動検出してルール違反を警告してくれる。

---

## useRef vs useState

| | useState | useRef |
|---|---|---|
| 値の変更で再レンダー | される | されない |
| 値の保持 | される | される |

### 使い分け
- **画面に表示したい値** → `useState`
- **画面に表示しないけど保持したい値**（タイマーIDなど） → `useRef`

`useRef`は「Reactの管理外でこっそり値を持っておく箱」

### stateのスナップショットとの関係
```js
function handleClick() {
  setState(c => c + 1);  // キューに積まれる
  alert('You clicked ' + state + ' times!'); // この時点のstateはまだ古い値！
}
// → 現在値が2の状態でクリックすると alertは「2」、画面は「3」になる
```

alertに最新値を渡したい場合：
```js
setState(c => {
  const next = c + 1;
  alert('You clicked ' + next + ' times!');
  return next;
});
// ただしsetStateの中にアラートを入れるのは本来の使い方ではない
```

### refを使ったDOM操作
```js
function Form() {
  const inputRef = useRef(null);
  function handleClick() {
    inputRef.current.focus(); // DOMを直接操作
  }
  return <input ref={inputRef} />;
}
```

`<input ref={inputRef} />` はReactに「このDOMノードをinputRef.currentに入れておいて」という指示。

---

## useEffect

### 本質
**「Reactの外側の世界と外部システムを同期する」**手段

```js
useEffect(() => {
  if (isPlaying) {
    ref.current.play();
  } else {
    ref.current.pause();
  }
}, [isPlaying]); // isPlayingが変わるたびに同期
```

### Reactのデータフロー
```
外の世界
  ↓ イベントハンドラ（クリック、入力）← 外→内
Reactの世界（state/props）
  ↓ useEffect ← 内→外
外の世界（DOM操作、API、タイマー...）
```

- **イベントハンドラ** → 外→内（ユーザーの操作をReactの世界に取り込む）
- **useEffect** → 内→外（Reactの状態変化を外の世界に反映する）

### 依存配列のパターン
```js
// マウント時に1回だけ実行、アンマウント時にクリーンアップ
useEffect(() => {
  const connection = createConnection();
  connection.connect();
  return () => connection.disconnect(); // クリーンアップ（onUnmountedに相当）
}, []);

// 値が変わるたびに実行
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data));
}, [userId]); // userIdが変わるたびにAPIが呼ばれる
```

### Reactのライフサイクル
| フェーズ | 説明 | useEffectとの対応 |
|---|---|---|
| マウント | コンポーネントが初回生成 | `useEffect(fn, [])` |
| 更新（再レンダー） | state/propsが変化 | `useEffect(fn, [x])` |
| アンマウント | コンポーネントが削除 | `return () => {}` |

Vueとの対比：
- `created/mounted` → マウント
- `watch` → `useEffect([x])`
- `onUnmounted` → `return () => {}`

### マウント時に1回の処理（useEffect以外）
```js
// コンポーネントの外に書く → モジュール読み込み時に1回だけ実行
const connection = createConnection();
connection.connect();

export default function ChatRoom() { ... }
```
ただし「マウント時」ではなく「モジュール読み込み時」なので、再マウントでも実行されない。

### useEffectを使いすぎない
```js
// ❌ 派生stateをuseEffectで計算する（冗長）
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// ✅ レンダー時に計算するだけでよい
const fullName = firstName + ' ' + lastName;
```

既存のstateやpropsから計算できる値はレンダー中に計算する（**派生stateはstateにしない**）。

---

## useEffectEvent

### 問題
「依存配列に入れたくないけど最新の値を使いたい」というジレンマ

```js
// themeを依存配列に入れると、テーマ変更のたびに再接続されてしまう
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.on('connected', () => {
    showNotification('Connected!', theme); // themeを使いたい
  });
  connection.connect();
  return () => connection.disconnect();
}, [roomId, theme]); // ← themeを入れたくない！
```

### 解決策
```js
const onConnected = useEffectEvent(() => {
  showNotification('Connected!', theme); // 常に最新のthemeを使える
});

useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.on('connected', () => {
    onConnected();
  });
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // themeは依存配列不要！
```

**「Effectの中で使うけど、Effectのトリガーにはしたくない値」を切り出す箱**

- 2023年頃から実験的機能として提供（当初は`useEvent`という名前）
- React 19.2で安定版として正式リリース

---

## 依存配列に入れていい値・ダメな値

```js
// ✅ 文字列、数値、真偽値（値で比較）
}, [roomId, isPlaying]);

// ✅ コンポーネント外のモジュールレベルの定数（変わらない）
const serverUrl = 'https://localhost:1234'; // 依存配列不要

// ❌ オブジェクト（参照比較なので毎レンダーで別物）
const options = { serverUrl, roomId };
}, [options]); // 毎回再実行されてしまう

// ❌ 配列（同上）
// ❌ 関数（同上）
```

### 解決策
```js
// オブジェクトはuseEffectの中で定義する
useEffect(() => {
  const options = { serverUrl, roomId }; // 中に入れる
  const connection = createConnection(options);
  ...
}, [roomId]); // roomIdだけでOK
```

値・配列・オブジェクトの参照を安定させるには`useMemo`、関数は`useCallback`を使う。

---

## Context

### 本質
「スコープありの、変化を購読できるKVS」

- **props** → 親コンポーネントから直接渡される（手渡し）
- **useContext** → Providerから離れた場所でも直接受け取れる（**テレポート**）

`useContext`で購読した値が変わると、propsと同様に自動で再レンダーされる。

