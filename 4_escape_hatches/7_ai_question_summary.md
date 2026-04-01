# useEffect 発展編まとめ

## 1. useEffectEvent による非リアクティブな値の分離

### 2つのアプローチの比較

#### アプローチ①：依存配列に `canMove` を含める

```jsx
useEffect(() => {
  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }
  window.addEventListener('pointermove', handleMove);
  return () => window.removeEventListener('pointermove', handleMove);
}, [canMove]);
```

- `canMove` が変わるたびにリスナーの **登録/解除が繰り返される**

#### アプローチ②：useEffectEvent を使う

```jsx
const onMove = useEffectEvent(e => {
  if (canMove) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
});

useEffect(() => {
  window.addEventListener('pointermove', onMove);
  return () => window.removeEventListener('pointermove', onMove);
}, []);
```

- リスナーの登録/解除は **マウント/アンマウント時の1回だけ**
- `canMove` の変更に反応する必要がないため、依存配列は `[]`

### useEffectEvent の利点

- **リアクティブな値（Effect が反応すべきもの）** と **非リアクティブな値（Effect 内でただ読みたいだけの値）** がコード上で明確に分離される
- Effect: 「`pointermove` を監視する」という同期ロジック
- Effect Event: 「`canMove` を見て座標を更新する」というイベントへの応答

### useEffectEvent の内部の仕組み（簡易実装）

```js
function useEffectEvent(handler) {
  const ref = useRef(null);
  ref.current = handler;  // 毎レンダーで最新の handler に上書き
  return (...args) => ref.current(...args);  // 呼ばれた時点で最新を参照
}
```

- **毎レンダー**で最新の `handler`（最新の state/props を含むクロージャ）が `ref.current` に上書きされる
- **返される関数自体は同じ参照**なので、Effect の依存配列に入れなくてよい
- 関数が**呼ばれた時点**で `ref.current` を見に行くので、常に最新の値が読める
- `useRef` が「レンダーをまたぐ安定した箱」として機能し、中身だけ毎回入れ替える

### 注意

`useEffectEvent` は **experimental API** であり、2026年4月現在も安定版には入っていない。実務では依存配列に値を含めるパターンが現実的な選択肢となる。ただし、「Effect が何に反応すべきか」と「Effect の中で何を読みたいだけか」を区別する設計思想は重要。

---

## 2. useEffect 内の ignore パターンとレースコンディション

### 基本形

```jsx
useEffect(() => {
  let ignore = false;
  fetchData('/planets/' + planetId).then(result => {
    if (!ignore) {
      setPlanetDetail(result);
    }
  });
  return () => {
    ignore = true;
  };
}, [planetId]);
```

### ignore の目的

- **fetch のリクエスト自体を止めるものではない**（リクエストは毎回飛ぶ）
- **古くなった Effect のレスポンスで state を上書きしないこと**が目的

### レースコンディションとは

`planetId` が「1 → 2 → 3」と素早く変わり、3つの fetch が飛んだとき、レスポンスがリクエスト順に返ってくる保証はない。

もし「2 → 3 → 1」の順で返ってきた場合、`ignore` がなければ最終的に `planetId: 1` のデータで state が上書きされてしまう。ユーザーは `planetId: 3` を見たいのに、古いデータが表示される。

### なぜ機能するのか：Effect 実行ごとの独立したクロージャ

**`ignore` は毎回 `false` で始まる。これは正しい。** ポイントは、毎回の Effect 実行がそれぞれ**別の `ignore` 変数**を持つこと。

```
Effect実行①（planetId=1）: ignore_A = false → fetch開始
  ↓ planetId が 2 に変わる
  クリーンアップ①実行: ignore_A = true  ← 前の Effect のクリーンアップが先
Effect実行②（planetId=2）: ignore_B = false → fetch開始
  ↓ planetId が 3 に変わる
  クリーンアップ②実行: ignore_B = true
Effect実行③（planetId=3）: ignore_C = false → fetch開始
```

- fetch①のレスポンスが返った時 → `ignore_A` は `true` → `setState` されない
- fetch②のレスポンスが返った時 → `ignore_B` は `true` → `setState` されない
- fetch③のレスポンスが返った時 → `ignore_C` は `false` → `setState` される ✅

### クリーンアップの実行順序

依存配列の値が変わったとき：

1. **前の Effect のクリーンアップが実行される**（`ignore = true`）
2. **新しい Effect が実行される**（新しい `ignore = false`）

この「クリーンアップが先、新しい Effect が後」という順序が保証されているため、**常に最新の Effect の `ignore` だけが `false` のまま残る**。

### Strict Mode との関係

依存配列が `[]` の場合でも、開発環境の Strict Mode ではマウント→アンマウント→再マウントが起きるため、同様のレースコンディションが発生し得る。本番では問題にならなくても、**正しい習慣として常に `ignore` パターンを書く**ことが推奨される。
