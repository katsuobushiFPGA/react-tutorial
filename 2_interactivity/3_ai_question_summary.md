# React state：コンポーネントのメモリ 学習まとめ

## 1. ローカル変数ではstateが保持されない

```jsx
export default function Gallery() {
  let index = 0;
  function handleClick() {
    index = index + 1;
  }
  // ...
}
```

### 問題点
- **問題①：値が保持されない**
  `Gallery` はただの関数なので、レンダーのたびに `let index = 0` が実行され、値がリセットされる。
- **問題②：再レンダーが起きない**
  `index = index + 1` はただの変数の書き換えなので、Reactは画面を更新する必要があると気づかない。

---

## 2. useStateで解決する

```jsx
import { useState } from 'react';

const [index, setIndex] = useState(0);

function handleClick() {
  setIndex(index + 1);
}
```

- `useState` が返す値はReactが管理しているため、レンダーをまたいでも値が保持される。
- `setIndex` を呼ぶと再レンダーがトリガーされる。

---

## 3. セッター関数を呼んだときの流れ

1. Reactが新しい値をメモリ（リスト）に保存する
2. 再レンダーをスケジュール（キュー）する
3. 同じイベント内の複数のセッターはまとめて1回の再レンダーにまとめられる（バッチ処理）
4. コンポーネントが再実行され、画面が更新される

---

## 4. フックのルール（落とし穴）

`use` で始まるフックは**コンポーネントのトップレベル**でのみ呼び出せる。

```jsx
// ❌ 条件分岐の中
if (someCondition) {
  const [index, setIndex] = useState(0);
}

// ❌ ループの中
for (let i = 0; i < 3; i++) {
  const [value, setValue] = useState(0);
}

// ❌ ネストされた関数の中
function handleClick() {
  const [index, setIndex] = useState(0);
}

// ✅ トップレベルならOK
export default function Gallery() {
  const [index, setIndex] = useState(0);
}
```

### なぜこのルールがあるのか
Reactは複数の `useState` を**呼ばれた順番**で管理している。条件分岐などで呼ばれたり呼ばれなかったりすると順番がズレ、Reactがどの値がどのstateか判別できなくなる。

---

## 5. useStateの順番管理の仕組み

Reactは内部にリストを持ち、`useState` が呼ばれた順番で値を管理している。

```
1番目 → 0        （index）
2番目 → false    （show）
3番目 → 'Alice'  （name）
```

- 変数名（`index` や `show`）ではなく、**何番目に呼ばれたか**だけで管理している。
- `useState` が呼ばれると、Reactのカウンターが進み、対応するリストの値が返される。

### 順番がズレるとどうなるか

```
// if文でindexのuseStateがスキップされた次のレンダー

useState(false) → 1番目 → 0（本来はindexの値）← showが0を受け取る！
useState('Alice') → 2番目 → false（本来はshowの値）← nameがfalseを受け取る！
```

---

## 6. コンポーネントのインスタンスごとに独立したリストを持つ

```jsx
<Gallery />  // ← これ専用のリスト [0, false, 'Alice']
<Gallery />  // ← これ専用のリスト [0, false, 'Alice']
```

同じコンポーネントを複数使っても、それぞれが独立したリストを持つため、片方の操作がもう片方に影響しない。

---

## 7. セッターはどのメモリを更新するか

`useState` を呼んだ時点で、**その値に対応するセッターが1対1でペアとして作られて返ってくる**。

```
useState(0) が呼ばれる
  → リストの1番目に 0 を格納
  → 「1番目を更新するセッター」を作って返す = setIndex

useState(false) が呼ばれる
  → リストの2番目に false を格納
  → 「2番目を更新するセッター」を作って返す = setShow
```

セッターは作られた時点でどのメモリを更新するか決まっているため、呼び出し時に判定する必要がない。

---

## 8. 2回目以降のレンダーで初期値が無視される理由

```
1回目のレンダー
  → リストの1番目がまだない
  → 初期値 0 をリストに格納する

2回目以降のレンダー
  → リストの1番目にすでに値がある（例: 1）
  → useState(0) の 0 は無視して、リストの値 1 をそのまま返す
```

---

## 9. useStateの簡易内部実装（Reactドキュメントより）

```js
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // 2回目以降のレンダー：リストに値があればそのまま返す
    currentHookIndex++;
    return pair;
  }
  // 初回レンダー：初期値でペアを作ってリストに保存
  pair = [initialState, setState];
  function setState(nextState) {
    pair[0] = nextState; // リストの値を更新
    updateDOM();         // 再レンダーをトリガー
  }
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}
```

- `componentHooks` = リスト
- `currentHookIndex` = カウンター
- セッター（`setState`）は `pair` を直接参照しているので、作られた時点で更新先が決まっている

---

## 10. stateを使うべきかの判断

- 画面の更新が必要な値 → `useState` で管理する
- 画面に表示しない・再レンダーが不要な値 → ローカル変数で十分

```jsx
// ❌ stateは不要
export default function FeedbackForm() {
  const [name, setName] = useState('');
  function handleClick() {
    setName(prompt('What is your name?'));
    alert(`Hello, ${name}!`); // nameはまだ古い値！
  }
}

// ✅ ローカル変数で十分
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('What is your name?'); // 即座に反映される
    alert(`Hello, ${name}!`);
  }
}
```

---

## 11. オブジェクトをstateで管理する

複数の値をまとめてstateで管理する場合はオブジェクトを使う。

```jsx
const [form, setForm] = useState({
  name: '',
  address: '',
  birth: '',
});

// 更新はスプレッド構文で
setForm({ ...form, name: 'Bob' });
// → { name: 'Bob', address: '', birth: '' }
```

`...form` を忘れると他のフィールドが消えてしまうので注意。

---

## 12. useReducer（useStateの発展版）

stateが増えてきたり更新ロジックが複雑になってきたときに使う。

```jsx
const [state, dispatch] = useReducer(reducer, { index: 0, show: false });

function reducer(state, action) {
  switch (action.type) {
    case 'next':   return { ...state, index: state.index + 1 };
    case 'toggle': return { ...state, show: !state.show };
  }
}

function handleNext()   { dispatch({ type: 'next' }); }
function handleToggle() { dispatch({ type: 'toggle' }); }
```

- `useState` との違い：セッターの代わりに「何をしたいか」を `dispatch` で投げるだけで、更新ロジックは `reducer` に集約される
- stateが少ないうちは `useState` で十分、複雑になってきたら `useReducer` に切り替えるイメージ

