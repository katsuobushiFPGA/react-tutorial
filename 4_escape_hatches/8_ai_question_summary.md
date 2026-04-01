# useEffect 依存配列の理解を深める

## 1. 依存配列の基本：なぜ依存値を入れるのか

### チャットルームの例

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ← roomIdが入っていない
}
```

- 依存配列が `[]` のままだと、マウント時に一度だけEffectが実行される
- `roomId` が `"general"` → `"travel"` に変わっても再接続されず、ずっと最初のルームに繋がったまま
- `roomId` はEffectの中で使われているリアクティブな値なので、依存配列に `[roomId]` と含める必要がある
- `serverUrl` はコンポーネント外の定数なので、リアクティブな値ではなく依存配列に入れなくてよい

---

## 2. 依存配列の本質：「同期先の宣言」

### 「いつ実行するか」ではなく「何と同期しているか」

- 依存配列は実行タイミングを制御するためのものではない
- **「このEffectはこの値に依存しています」という事実の宣言**
- `roomId` が `"general"` のときは「generalルームと同期している状態」、`"travel"` に変わったら「travelルームと同期している状態」にする必要がある
- 依存配列の値が変わる ＝ **同期先が変わった** → 古い同期を解除（クリーンアップ）して新しい値で再同期する

### lintを抑制して依存配列を偽るのはNG

- 「マウント時に1回だけ接続したい」という要件なら、依存配列を空にするのではなく**コンポーネント設計を見直す**べき
- 例：固定値を定数として定義する、ユーザー設定から一度だけ読み込むなど
- **lintを抑制したくなったら「設計を見直すサイン」**

---

## 3. 依存配列は「パフォーマンス最適化」ではなく「正しさの保証」

- 同期先が変わっていないのにEffectが再実行されると、`disconnect` → `connect` が走る
- これは「無駄な処理」ではなく**正しくない動作**になりうる（一瞬接続が切れてメッセージを取りこぼすなど）
- `useMemo` や `useCallback` はパフォーマンスのための仕組みだが、`useEffect` の依存配列はそれとは性質が異なる

---

## 4. リアクティブな値とは

### 定義

- **リアクティブな値** ＝ 再レンダーのたびに値が変わる可能性があるもの
  - `props` の値
  - `state` の値
  - コンポーネント本体の中でそれらから計算される値
- **リアクティブでない値** ＝ 再レンダーで変わらないもの
  - コンポーネント外で宣言されている定数や関数
  - `useRef` の `ref.current`（Reactが変化を追跡しない）

### 依存配列に入れるべきかの判断

- リアクティブかどうかと、依存配列に入れるべきかどうかは直結しない
- 間にもう一段、**「実際にEffectの中で読んでいるか」**という判断がある
- 読まないで済む方法（更新関数など）があるなら、そもそも依存に入れる必要がない

---

## 5. 更新関数 vs useEffectEvent：優先順位

### タイマーの例

```jsx
// 模範解答：更新関数を使い、countを読まない
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // countを読んでいない
  }, 1000);
  return () => clearInterval(id);
}, []);
```

```jsx
// useEffectEventを使うアプローチ：動くが道具が一つ増える
const onTick = useEffectEvent(() => {
  setCount(count + 1); // countを読んでいる → useEffectEventで分離
});
useEffect(() => {
  const id = setInterval(() => onTick(), 1000);
  return () => clearInterval(id);
}, []);
```

### 判断の優先順位

1. **そもそもリアクティブな値を読まなくて済まないか？**（更新関数で解決）
2. **依存配列に入れて再同期で問題ないか？**
3. **再同期させたくないが最新値は読みたい** → `useEffectEvent`

シンプルな手段で解決できるなら、わざわざ道具を増やさない。

---

## 6. useEffectEventの正しい使いどころ

### チャットルームの通知テーマの例

```jsx
// App.js：通知ロジックをコールバックとして渡す
<ChatRoom
  roomId={roomId}
  isEncrypted={isEncrypted}
  onMessage={msg => {
    showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
  }}
/>
```

```jsx
// ChatRoom.js：onMessageをuseEffectEventでラップ
const onReceiveMessage = useEffectEvent(onMessage);
useEffect(() => {
  const connection = createConnection(options);
  connection.on('message', (msg) => onReceiveMessage(msg));
  connection.connect();
  return () => connection.disconnect();
}, [roomId, isEncrypted]);
```

- `onMessage` は `isDark` をクロージャで読んでいるため、レンダーのたびに新しい関数になる（リアクティブ）
- 依存配列に入れると、テーマ変更のたびにチャットが再接続されてしまう
- 更新関数で解決できるケースではない（state更新ではなくコールバック呼び出し）
- → `useEffectEvent` の出番

### 責務の分離

- `ChatRoom` はチャットへの接続とメッセージの受信が仕事
- 通知の見た目（テーマなど）を知る必要はない
- 親から `onMessage` コールバックを渡す設計にすることで、`ChatRoom` を変更せずに通知ロジックを変更できる

---

## 7. 複数のuseEffectの実行順序

- 同じコンポーネントに複数の `useEffect` がある場合、**コードの上から順に実行**される
- Reactはフック呼び出しの順序に依存して各Hookを識別しているため（`useState` と同じ理由）

---

## 8. React Compilerについて

- 依存配列を手動で書く面倒さは開発者共通の不満
- **React Compiler**（旧称 React Forget）が、`useMemo` や `useCallback` の自動メモ化を目指している
- `useEffect` の依存配列そのものを自動推論するわけではないが、「手動宣言の負担を減らす」という思想は共通
- 現状は、JavaScriptの言語的制約からランタイムでの変数参照追跡が困難で、lintによる静的解析で補っている

---

## まとめ

| 概念 | ポイント |
|------|---------|
| 依存配列の本質 | 「いつ実行するか」ではなく「何と同期しているか」の宣言 |
| リアクティブな値 | 再レンダーで変わりうる値（props, state, それらからの計算値） |
| 依存に入れるか | リアクティブ × Effectの中で実際に読んでいる → 入れる |
| 再同期の意味 | パフォーマンス最適化ではなく正しさの保証 |
| lintの抑制 | 設計を見直すサイン |
| 更新関数 vs useEffectEvent | シンプルな手段（更新関数）を先に検討し、それで解決できない場合にuseEffectEvent |

