# React 状態管理まとめ

## 1. シャローコピーと参照の問題

`useState` で同じ配列を初期値に使うと、オブジェクトの参照が共有される。

```js
const [myList, setMyList] = useState(initialList);
const [yourList, setYourList] = useState(initialList); // 同じ参照！
```

スプレッド構文でコピーしてもシャローコピーなので、中のオブジェクトは同じ参照のまま。

```js
// ❌ 問題あり：元のオブジェクトをミューテートしてしまう
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // initialList 内のオブジェクトも書き換わる

// ✅ 正解：map でオブジェクトを新しく生成する
setMyList(myList.map(artwork =>
  artwork.id === artworkId
    ? { ...artwork, seen: nextSeen }
    : artwork
));
```

---

## 2. アロー関数の波括弧と return

波括弧 `{}` を使う場合は明示的な `return` が必要。

```js
// ❌ 間違い：return がないので undefined を返す → 全要素が除外される
todos.filter(todo => {
  todo.id !== todoId
})

// ✅ 正解①：波括弧なし（暗黙の return）
todos.filter(todo => todo.id !== todoId)

// ✅ 正解②：波括弧あり + 明示的な return
todos.filter(todo => {
  return todo.id !== todoId
})
```

---

## 3. map で要素を除外したい場合

| 方法 | 結果 | 用途 |
|---|---|---|
| `map` + `null` | null が残る | React の表示上消したいだけ |
| `filter` + `map` | 要素ごと除外 | データから取り除きたい ✅ |
| `flatMap` | 除外と変換を同時 | 一度に両方やりたい ✅ |

```js
// filter + map
artworks
  .filter(artwork => !artwork.seen)
  .map(artwork => <li key={artwork.id}>{artwork.title}</li>)

// flatMap（変換と除外を同時に）
artworks.flatMap(artwork =>
  artwork.seen
    ? []
    : [{ ...artwork, done: true }]
)
```

---

## 4. Immer の仕組み

Immer の `draft` は **Proxy オブジェクト**。`draft` 内の要素への参照を通じた変更も Immer が検知して新しい state を生成する。

### find（参照を返す）

```js
updateTodos(draft => {
  const todo = draft.find(t => t.id === nextTodo.id); // draft内オブジェクトへの参照
  todo.title = nextTodo.title; // Proxy が変更を検知
  todo.done = nextTodo.done;
});
```

`find` は新しい配列ではなく**元の要素への参照**を返すため、`todo` を書き換えると `draft` への変更として記録される。

### findIndex + splice（インデックスを返す）

```js
updateTodos(draft => {
  const index = draft.findIndex(t => t.id === todoId); // 数値を返すだけ
  draft.splice(index, 1); // draft を直接操作
});
```

`findIndex` はただの数値を返すので、Proxy や参照とは無関係にシンプルに `draft` を操作する。

### 各メソッドが返すもの

| メソッド | 返すもの |
|---|---|
| `find` | 元の要素への**参照** |
| `findIndex` | **数値**（インデックス） |
| `filter` | **新しい配列** |
| `map` | **新しい配列** |

