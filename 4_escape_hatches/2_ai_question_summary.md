# React `useRef` 学習まとめ

## 1. refとstateの違い

refもstateも「レンダーをまたいで値を保持する」仕組みという点は同じ。ただし：

| | state | ref |
|---|---|---|
| 値を変えると | 再レンダーが起きる | 再レンダーが起きない |
| 値の保持 | Reactが管理 | Reactが管理 |
| アクセス | 変数そのまま | `.current`経由 |

Reactはコンポーネントごとに内部的な「棚」を持っており、stateもrefもその棚に格納されている。

- **stateの棚** → 値が変わったら「再レンダーしてください」とReactに通知が飛ぶ
- **refの棚** → `ref.current`というオブジェクトを置いているだけで、値を書き換えても通知なし

---

## 2. なぜ`.current`というオブジェクト経由なのか

JavaScriptのプリミティブ値とオブジェクトの参照渡しの違いが理由。

```js
// プリミティブなら「値のコピー」が渡る → 再レンダーのたびに別の値になってしまう
let ref = 0;

// オブジェクトなら「参照」が渡る → どこからref.currentを書き換えても同じオブジェクトを見ている
let ref = { current: 0 };
```

Reactはコンポーネントが再レンダーされるたびに関数を再実行するが、**同じ`{ current: ... }`オブジェクトへの参照を渡し続ける**ことで、どのレンダーからアクセスしても同じ値を見られる。

`useRef`の"ref"は**reference（参照）**そのもの。

---

## 3. setStateのインターセプト

`setState`を経由することでReactのインターセプト処理が動く。

```js
// これはReactが検知できる
setState(newValue);

// これはReactが検知できない（直接書き換えはNG）
state = newValue;
```

stateにオブジェクトを入れているときに新しいオブジェクトを返さないといけない理由も同じ。ReactはオブジェクトのIDを比較して変化を検知するため。

```js
// ❌ 同じ参照を返す → 変化を検知できない
setState(obj => {
  obj.count = obj.count + 1;
  return obj;
});

// ✅ 新しいオブジェクトを返す → 変化を検知できる
setState(obj => {
  return { ...obj, count: obj.count + 1 };
});
```

---

## 4. refが消えるタイミング

- **再レンダー** → refは**消えない**（参照渡しのため）
- **アンマウント→マウント** → refは**消える**

```jsx
// showがfalse→trueになると、Counterは再マウント＝refがリセット
{show && <Counter />}
```

refはコンポーネントの**インスタンス**に紐付いているイメージ。クラスのインスタンス変数に近い。

---

## 5. コンポーネント外での定義

| | モジュール変数 | ref |
|---|---|---|
| 値の保持 | ✅ | ✅ |
| インスタンスごとに独立 | ❌（全インスタンスで共有） | ✅ |
| 再レンダーで消えない | ✅ | ✅ |

コンポーネントの外ではHooksは呼び出せないため（Rules of Hooks）、外で定義するならただの変数になる。

---

## 6. HooksがコンポーネントのトップレベルでしかNGな理由

Reactは「今どのコンポーネントが実行中か」というコンテキストを内部で持っており、Hook呼び出しのたびに「このコンポーネントの棚のN番目のスロット」に値を入れている。

```js
function Counter() {
  const [a, setA] = useState(0);  // 棚の1番目
  const [b, setB] = useState(0);  // 棚の2番目
  const ref = useRef(0);           // 棚の3番目
}
```

- **コンポーネント外** → どのコンポーネントの棚かわからない → エラー
- **条件分岐やループ内** → 順番がズレる可能性がある → エラー

これは`useState`、`useRef`、`useEffect`など**全てのHooks**に適用される（Rules of Hooks）。

---

## 7. stateとrefとローカル変数の使い分け

| | 再レンダーのトリガー | レンダーをまたいで保持 | 用途 |
|---|---|---|---|
| state | ✅ | ✅ | 表示に使う値 |
| ref | ❌ | ✅ | 表示不要だが保持したい値 |
| ローカル変数 | ❌ | ❌ | 再レンダーで毎回計算できる値 |

また、**stateから計算できる値はstateにしない**。

```js
// ❌ 冗長
const [secondsPassed, setSecondsPassed] = useState(0);

// ✅ nowが更新されて再レンダーされれば自動的に最新値になる
let secondsPassed = (now - startTime) / 1000;
```

---

## 8. DOMを直接触るのは最終手段

Reactの思想として**DOMを直接触るのは最終手段**。基本はstateやrefで値を管理する（宣言的UI）。

`ref={inputRef}`でDOM参照する使い方は、フォーカス操作・スクロール位置の制御・サードパーティライブラリとの連携など、**Reactでは制御できないDOM操作が必要なときだけ**。

DOMを直接触ると：
- Reactの仮想DOMと実際のDOMが乖離するリスク
- テストがしにくくなる
- コードが追いにくくなる

---

## 9. refのユースケース：最新のstateを非同期処理で読む

stateはスナップショットなので、非同期処理内では**クリック時点の値**しか読めない。最新の値を読みたい場合はrefを併用する。

```js
const [text, setText] = useState('');
const textRef = useRef(text);

function handleChange(e) {
  setText(e.target.value);           // 表示用（再レンダーのため）
  textRef.current = e.target.value;  // 最新値の保持用
}

function handleSend() {
  setTimeout(() => {
    alert('Sending: ' + textRef.current); // 常に最新値を参照
  }, 3000);
}
```

- `text`（state）→ 入力欄の表示に使う
- `textRef`（ref）→ 常に最新値を保持、非同期処理から参照する

