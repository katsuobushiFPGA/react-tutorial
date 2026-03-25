さっきまとめたものと同じ内容になりますが、会話ベースで拾い直してみます！（追加になった部分は足してます）

---

# Reactレンダーの仕組み まとめ

## レンダーの伝播
- コンポーネントから別のコンポーネントを呼び出すと、**親→子のトップダウンで連鎖的に**レンダーが発生する
- 「再帰的」ではなく一方向の伝播が正確
- 子→親への伝播は**起きない**

## 循環参照
- AがBを呼びBがAを呼ぶような循環参照をReactは静的に検出できない
- 終了条件がないと実行時に無限ループ→スタックオーバーフローでクラッシュ
- 終了条件があれば動作し、ツリー表示やネストしたコメント欄などで活用される

```jsx
function A({ depth }) {
  if (depth >= 3) return <div>終わり</div>;
  return <B depth={depth + 1} />;
}
```

## stateはスナップショット
- stateはコンポーネント先頭でReactのメモリから取り出され、そのレンダー中は**固定・確定**している
- `setXXX` を呼んでも現在のレンダーの値は変わらない
- `setXXX` は「次のレンダーではこの値にして」とReactに予約してキューに積むイメージ
- `const` で宣言されているのもそれを表している

```jsx
// レンダー1回目
function Counter() {
  const number = 0; // 先頭で確定、このレンダー中はずっと0
}

// setNumber(1) が呼ばれる

// レンダー2回目
function Counter() {
  const number = 1; // 先頭で確定、このレンダー中はずっと1
}
```

## setXXXのタイミング
```
setXXX() が呼ばれる
      ↓
Reactが「次のレンダーではこの値にする」と予約
      ↓
レンダーのタスクがキューイングされる
      ↓
レンダーが実行されて初めてstateメモリが更新される
      ↓
コンポーネント先頭で新しい値として確定
```

## 複数回setしたい場合
```jsx
// ❌ 全部同じ値を参照するので+1にしかならない
setNumber(number + 1);
setNumber(number + 1);
setNumber(number + 1);

// ✅ 関数形式なら+3になる
setNumber(prev => prev + 1);
setNumber(prev => prev + 1);
setNumber(prev => prev + 1);
```

## useRef
- `ref.current` で常に最新値を参照できる
- ただし変更しても**再レンダーが起きない**のでUIへの反映には使えない
- 「常にメモリから最新値を取得する」発想に近いが、レンダーの一貫性が失われるためstateの代替にはならない

```jsx
const numberRef = useRef(0);
numberRef.current; // 常に最新値を参照できる
```

## propsも同じスナップショット
- propsもそのレンダー時点の値のコピーが渡される
- 親の `state` が変わる → 親が再レンダー → 新しい値が子にpropsとして渡る → 子も再レンダー
- 子が単独で先に更新されることはない

## stateの場所とレンダー範囲
- stateは**定義されているコンポーネントに紐づく**
- 子でsetを呼んだ場合、stateを持つ子から下だけ再レンダー
- 親も更新したい場合は**State lifting（stateの引き上げ）**が必要

```jsx
function Parent() {
  const [number, setNumber] = useState(0); // 親がstateを持つ
  return <Child number={number} setNumber={setNumber} />;
}

function Child({ number, setNumber }) {
  return <button onClick={() => setNumber(number + 1)}>+1</button>;
}
```

## レンダーのトリガー
1. 初回レンダー
2. stateの更新
3. 親の再レンダーによる連鎖
4. Contextの更新

## TypeScriptの `!`（Non-null assertion operator）
- `getElementById` の戻り値は `HTMLElement | null` なのでTypeScriptが警告する
- `!` をつけることで「nullじゃないと保証する」とTypeScriptに伝える
- 乱用すると型安全の恩恵が失われるので使い所は限定する

```ts
createRoot(document.getElementById('root')!).render(...);

// 丁寧にやるならこう
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('root要素が見つかりません');
createRoot(rootElement).render(...);
```

## 仮想DOM（Virtual DOM）と差分更新
- レンダーのたびにJSXからツリー全体を生成
- 前回のツリー全体と比較（Diffing）
- 差分があった部分だけ実際のDOMを更新
- 「変数に関連する部分」ではなく**ツリー全体の比較結果**として差分が決まる

## 条件分岐とアンマウント
| ケース | 挙動 |
|--------|------|
| 同じ場所に同じコンポーネント | 差分更新、stateも保持 |
| 同じ場所でも別のコンポーネント | アンマウント→マウント |
| keyが変わった | アンマウント→マウント |

```jsx
// keyを変えることで強制的にアンマウント→マウントさせられる
{isLoggedIn ? <Form key="user" /> : <Form key="guest" />}
```
