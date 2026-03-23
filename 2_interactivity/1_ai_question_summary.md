# React 学習メモ

## イベント周り

### 引数を渡したいときはラムダで包む

```jsx
// 引数なし → そのまま渡す
<Button onClick={onPlayMovie}>

// 引数あり → ラムダで包む
<Button onClick={() => onPlayMovie("aa")}>
```

`onClick={onPlayMovie("aa")}` はレンダリング時に即実行されてしまうので注意。

### ラムダ以外で引数を渡す方法（bind）

```jsx
<Button onClick={onPlayMovie.bind(null, "aa")}>
```

第一引数が `this` の束縛、第二引数以降が関数に渡す引数。Reactでは `this` を使わないので `null` を渡すことが多い。ただし可読性の面からラムダが主流。

### preventDefault と stopPropagation の違い

- `e.preventDefault()` → ブラウザのデフォルト動作を止める（aタグのページ遷移、formのリロードなど）
- `e.stopPropagation()` → イベントの伝搬（バブリング）を止める

```jsx
// フォームのリロードを止める典型例
<form onSubmit={(e) => {
  e.preventDefault()
  // 自分で処理を書く
}}>
```

```jsx
// モーダルの実装典型例
// 外側クリックで閉じる、内側クリックでは閉じない
<div onClick={closeModal}>
  <div onClick={(e) => e.stopPropagation()}>
    モーダルの中身
  </div>
</div>
```

---

## Reactの歴史

- クラスコンポーネントが主流だった時代は `this` の扱いが鬼門で、bindを使った `this` の固定が至る所に出てきた
- **React 16.8（2019年2月）** でHooksが登場し、関数コンポーネントだけで状態管理やライフサイクルが扱えるようになった
- 今や関数コンポーネントが完全に標準。公式ドキュメントも関数コンポーネントベース

---

## Hooksの仕組み

ReactはHooksの**呼び出し順をリストで管理**している。

```jsx
const [count, setCount] = useState(0)
// → 「この関数コンポーネントの1番目のHooksはcountだ」と記録
```

「Hooksを条件分岐やループの中で呼んではいけない」というルールは、順番が変わるとReactが混乱するため。

### VueとReactのリアクティブ変数の対応

| React | Vue2 | Vue3 |
|---|---|---|
| useState | data{} | ref / reactive |

---

## stateとレンダリング

### stateはスナップショット

`setState` を呼んでも今のレンダリングの中の値は変わらない。「次のレンダリングではこの値を使ってね」とReactにお願いする関数。

```jsx
console.log(count)  // 0
setCount(count + 1) // 「次は1にしてね」とReactにお願い
console.log(count)  // まだ0！
```

### バッチング

```jsx
// これを3回呼んでも1回分しか増えない（全部「次は1にして」という同じお願い）
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)

// 3回分増やしたいなら関数形式で書く
setCount(c => c + 1)
setCount(c => c + 1)
setCount(c => c + 1)
```

関数形式だとReactが内部でキューに積んで、前の結果を次の引数に渡してくれる。

---

## StrictMode

- 同じ状態から**2回実行**して結果を比較する冪等性チェック
- 「1の状態 → 2の状態」を2回実行して結果が同じかを検証する（2の状態からもう一回実行するわけではない）
- ルール通りに書いていれば2回実行されても結果は変わらない
- ルール違反（外部の値を直接変更するなど）のコードをあぶり出すための仕組み

```jsx
// NG: 外部配列を直接変更（StrictModeで問題が露呈する）
const items = [];
function addItem() {
  items.push('new item')
  setList(items)
}

// OK: 新しい配列を返す
setList(prev => [...prev, 'new item'])
```

---

## テキストボックスの変更検知

### Reactの書き方（冗長だが明示的）

```jsx
function handleChange(e) {
  updatePerson(draft => {
    draft[e.target.name] = e.target.value
  })
}

<input name="city" value={person.city} onChange={handleChange} />
<input name="title" value={person.title} onChange={handleChange} />
```

`name` 属性を使って1つの関数で複数のinputを処理するパターン。フォームが多い場合は **React Hook Form** を使うことも多い。

### VueのV-modelと比較

```html
<!-- Vueはこれだけで双方向バインディング -->
<input v-model="city">
```

ReactはあえてV-modelのような魔法的な仕組みを持たず「データの流れを明示的に」という哲学のため冗長になりがち。

### v-modelとネストしたオブジェクト

`v-model="person.artwork.city"` のようなネストしたプロパティへの直接バインディングは可能。ただしオブジェクトはJavaScriptで参照渡しになるため、ネストしたプロパティを直接変更してもVueが警告を出さず、意図しない変更が起きてデバッグが難しくなる点に注意。

---

## stateの正しい更新方法（オブジェクト・配列）

直接変更せず、新しいオブジェクトを返すのがReactのルール。

```jsx
// NG: 直接変更
artwork.seen = nextSeen

// OK: スプレッド構文で新しいオブジェクトを返す
return { ...artwork, seen: nextSeen }
```

### 配列のリスト更新例

```jsx
function handleToggle(artworkId, nextSeen) {
  setList(list.map(artwork => {
    if (artwork.id === artworkId) {
      return { ...artwork, seen: nextSeen }; // 対象だけ更新
    } else {
      return artwork; // それ以外はそのまま
    }
  }));
}
```

`map` で新しい配列を返すことで、直接変更せずにstateを更新できる。

