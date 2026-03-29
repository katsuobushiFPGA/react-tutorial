# React `ref` まとめ

## 1. ref の基本動作

`<input ref={inputRef} />` とした場合：

- **マウント時** → `inputRef.current` に DOM ノードが入る
- **アンマウント時** → `inputRef.current` が `null` に戻る

### 「削除」の種類に注意

| 操作 | `ref` が `null` になるか |
|---|---|
| 条件分岐でコンポーネントを消す | ✅ なる |
| 親コンポーネントがアンマウントされる | ✅ なる |
| `display: none` で非表示にする | ❌ ならない（DOM は残っている） |

---

## 2. `ref` は React の予約済み props

JSX の `ref={}` は HTML の属性として DOM に渡されるわけではなく、React が内部で横取りして処理する**特殊な予約語**。`key` と同じ扱い。

### React 18 以前 と React 19 以降の違い

| | React 18 以前 | React 19 以降 |
|---|---|---|
| `ref` を子コンポーネントで受け取る | `forwardRef` が必要 | 通常の props として受け取れる |

```jsx
// React 18 以前
const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} />;
});

// React 19 以降
function MyInput({ ref }) {
  return <input ref={ref} />;
}
```

---

## 3. ref コールバック

`ref` に関数を渡すパターン。**複数の DOM 要素を Map で管理**したいときに使う。

```jsx
<li
  ref={(node) => {
    const map = getMap();
    map.set(cat, node);       // マウント時に登録
    return () => {
      map.delete(cat);        // アンマウント時にクリーンアップ
    };
  }}
>
```

### `useEffect` との対比

```jsx
useEffect(() => {
  // セットアップ
  return () => {
    // クリーンアップ ← ref コールバックの return と同じ役割
  };
}, []);
```

### 旧来の書き方（React 18 以前）

```jsx
ref={(node) => {
  if (node) {
    map.set(cat, node);   // マウント時（node に DOM ノードが渡される）
  } else {
    map.delete(cat);      // アンマウント時（node が null になる）
  }
}}
```

クリーンアップ関数の `return` は React 19 から正式サポート。

---

## 4. `useImperativeHandle`

子コンポーネントが外部に公開する操作を**制限**するための Hook。カプセル化の考え方。

```jsx
function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() {
      realInputRef.current.focus();
    },
    // focus 以外は外から触れない
  }));
  return <input ref={realInputRef} />;
}
```

| | 通常の ref | useImperativeHandle |
|---|---|---|
| 外から見えるもの | DOM ノード全体 | 公開したメソッドのみ |
| 例 | `.value` も `.remove()` も触れる | `.focus()` だけ触れる |

### クラスで例えると

- `realInputRef` → プライベートフィールド
- `useImperativeHandle` で返すオブジェクト → パブリックインターフェース

### カスタムフックへの切り出し

ロジックはカスタムフックに切り出せるが、各コンポーネントで呼ぶ必要はある。

```jsx
function useExposedInput(ref) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() { realInputRef.current.focus(); },
  }));
  return realInputRef;
}
```

> **NOTE**: `useImperativeHandle` は多用するものではない。「本当に ref で制御が必要か？」を先に考える。

---

## 5. `flushSync`

state 更新を**即座に DOM へ反映**させるための最終手段。

```jsx
flushSync(() => {
  setTodos([...todos, newTodo]);
});
// ここで DOM が更新済みになっている
listRef.current.lastChild.scrollIntoView();
```

### なぜ必要になるか

React は通常 state の更新をバッチ処理するため、`setState` 直後はまだ DOM が更新されていない。`flushSync` でその最適化をわざと潰して同期的に反映させる。

### 使うべき場面

- 「state 更新 → 即座に DOM を参照しないといけない」順序依存がある場合
  - 追加した要素に即スクロール
  - state 更新後の DOM サイズを即座に計測

### 多用すべきでない理由

- React のバッチ処理によるパフォーマンス最適化を潰す
- 同期処理なのでブロッキングが起きる
- 「state 更新直後に DOM を触る」設計自体が React の流儀から外れている

### 使用の判断階層

```
まず state と props で解決できないか考える
  ↓ 無理なら
ref を使う
  ↓ 順序の問題が出たら
flushSync を使う（最終手段）
```

---

## 6. 設計の考え方

### ref の管理は親に置く

```jsx
// ✅ 良い設計：ref の管理は Page（親）が持つ
export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <SearchButton onClick={() => { inputRef.current.focus(); }} />
      <SearchInput ref={inputRef} />
    </>
  );
}

// ❌ 微妙な設計：SearchButton が ref の存在を知っている
export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <SearchButton ref={inputRef} />  {/* Button が ref を持つ必要はない */}
      <SearchInput ref={inputRef} />
    </>
  );
}
```

### コンポーネントの責務を明確に

- `SearchButton` の責務は「**クリックされたことを親に伝える**」だけ
- 「クリックされたら input にフォーカスする」という**判断は親がすべき**
- これが**単一責務の原則**

### 「選択中の要素だけに ref をアタッチ」パターン

全要素を Map で管理する代わりに、現在選択中の要素だけに ref をアタッチするシンプルな方法。

```jsx
<li
  ref={index === i ? selectedRef : null}  // 選択中だけ ref をアタッチ
>
```

`null` を渡すと ref がアタッチされないので、常に `selectedRef.current` には選択中の要素だけが入る。

