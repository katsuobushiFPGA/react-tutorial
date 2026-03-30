# useEffect まとめ

## 1. レンダー中に副作用を書いてはいけない

```jsx
// NG: レンダー中に ref.current を操作している
if (isPlaying) {
  ref.current.play();
}
```

レンダー中はDOMがまだ確定していないため、`ref.current` が `null` になる。  
副作用は `useEffect` 内に書く。

---

## 2. useEffect の依存配列

| 依存配列 | 実行タイミング |
|---|---|
| なし | 毎レンダー後 |
| `[]` | マウント時の1回のみ |
| `[x]` | マウント時 + `x` が変わったとき |

---

## 3. onClick vs useEffect

```jsx
// NG: イベント（原因）に反応している
button.onClick = () => ref.current.play();

// OK: 状態（結果）に反応している
useEffect(() => {
  if (isPlaying) ref.current.play();
  else ref.current.pause();
}, [isPlaying]);
```

- `onClick` アプローチ → ボタン以外（PiP、ブラウザのメディアコントロールなど）から `isPlaying` が変わるケースに対応できない
- `useEffect` アプローチ → `isPlaying` の状態に同期するため、どこから変更されても対応できる

---

## 4. 依存配列には何を入れるべきか

依存配列は「エフェクト内で使っている値」だけでなく、「変化することでエフェクトの処理が正しく行われなくなる値」も入れる必要がある。

```jsx
// src が変わったとき isPlaying=true のままだと新しい動画が再生されない
useEffect(() => {
  if (isPlaying) ref.current.play();
  else ref.current.pause();
}, [isPlaying, src]);
```

---

## 5. 1つの useEffect には1つの関心事

責務が異なる処理は `useEffect` を分ける。

```jsx
// play/pause の同期
useEffect(() => {
  if (isPlaying) ref.current.play();
  else ref.current.pause();
}, [isPlaying]);

// src が変わったら isPlaying をリセット
useEffect(() => {
  setIsPlaying(false);
}, [src]);
```

---

## 6. ref を依存配列に入れるべきケース

`useRef` が返すオブジェクト自体は同一参照が保たれるため、通常は依存配列に入れる必要はない。  
ただし **propsで渡されるref** は条件分岐などで参照が切り替わる可能性があるため、依存配列に入れる。

```jsx
// 親側で ref が切り替わる例
<Child ref={isSpecial ? specialRef : normalRef} />
```

---

## 7. クリーンアップ関数

クリーンアップ関数が実行されるタイミングは2つ：

1. **アンマウント時**（コンポーネントがReactツリーから削除されるとき）
2. **依存配列の値が変わって再実行される前**

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => {
    connection.disconnect(); // クリーンアップ
  };
}, [roomId]);
```

クリーンアップ内で `ref.current` を使う場合は、Effect実行時点の値を変数にキャプチャしておく。

```jsx
useEffect(() => {
  const node = ref.current; // キャプチャ
  node.style.opacity = 1;
  return () => {
    node.style.opacity = 0; // アンマウント時には ref.current は null になっているため
  };
}, []);
```

---

## 8. アンマウント vs 非表示

| | DOMに存在 | Reactツリーに存在 | クリーンアップ |
|---|---|---|---|
| `display: none` | ○ | ○ | 走らない |
| アンマウント（`{show && <C />}`） | ✗ | ✗ | 走る |

---

## 9. StrictMode の挙動

開発環境では React が意図的に「マウント → アンマウント → 再マウント」を行う。  
これによりクリーンアップ漏れを早期発見できる。

StrictMode が検出できる主なもの：
- クリーンアップ漏れ（useEffect）
- レンダー中の副作用（レンダーを2回実行）
- 非推奨APIの使用

---

## 10. レースコンディション対策

### ignore フラグパターン

```jsx
useEffect(() => {
  let ignore = false;
  fetchBio(person).then(result => {
    if (!ignore) setBio(result);
  });
  return () => { ignore = true; };
}, [person]);
```

### AbortController パターン（より本質的）

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetchBio(person, { signal: controller.signal }).then(result => {
    setBio(result);
  });
  return () => { controller.abort(); };
}, [person]);
```

- `ignore` フラグ → レスポンスを**無視**する（通信は発生する）
- `AbortController` → リクエスト自体を**キャンセル**する（より効率的）

---

## 11. 実際の開発での useEffect とフェッチ

実際の開発では `useEffect` で直接フェッチを書くことはほとんどない。  
**TanStack Query** や **SWR** などのライブラリがレースコンディション対策・キャッシュ・ローディング状態などを自動で管理してくれる。  
Next.js ではサーバーコンポーネントで `fetch` を直接書くパターンも多い。

