# 会話まとめ

## 1. ReactのJSX構文

### 条件分岐の書き方

```jsx
// 三項演算子（falseの時に何も表示しない場合は&&が良い）
{status === STATUS_DISPLAY && <b>{lastName}</b>}
{status === STATUS_EDIT && (
  <input
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
  />
)}
```

- `? ''` より `&&` の方がシンプル
- 複数行のJSXは `()` で囲む
- `onChange` が1行なら波括弧と改行は不要

---

## 2. EditProfileのコードレビュー

### 主な改善点

- **`isEditing`（boolean）の方がシンプル** — 状態が2つしかない場合
- **空の関数は削除する**
- **フォームの送信処理は `form` の `onSubmit` に書く** — Enterキー対応にもなる
- **ボタンのラベルを状態に応じて切り替える**

```jsx
<button>{isEditing ? 'Save' : 'Edit'} Profile</button>
```

---

## 3. Promise・async/await

### Promiseとは
「将来値を受け取るかもしれないもの」。`.then()` で値が届いた時の動作を定義する。

```js
const promise = axios.get('/api/data');
promise.then(response => console.log(response));
```

### awaitとは
Promiseを `.then` を使わずに書ける構文（糖衣構文）。

```js
// thenで書く
axios.get('/api/data').then(response => console.log(response));

// awaitで書く（同じ意味）
const response = await axios.get('/api/data');
console.log(response);
```

### awaitの注意点
`await` はその関数の中だけで待つ。呼び出し元も待ちたい場合は `await` をつける。

```js
async function handleSubmit() {
  await sendMessage(text); // この関数の中だけ止まる
}

handleSubmit();            // ← ここは待たずに次へ進む
await handleSubmit();      // ← これなら待てる
```

### なぜPromiseが必要か
JavaScriptはシングルスレッドのため、ネットワーク通信などを同期処理にするとUIがフリーズする。
Promiseはその非同期処理をUIをフリーズさせずに扱うための仕組み。

### axiosとPromise
axiosは内部でPromiseを返しているが、`await` で受け取るため意識しにくい。

```js
// 実はaxiosもPromiseを返している
const response = await axios.get('/api/data'); // awaitで隠れている
```

### Promiseを直接書く場面
`setTimeout` など、もともとPromiseを返さない古いAPIをPromise化する時。

```js
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

---

## 4. JavaScriptとマルチスレッド

- JavaScriptはシングルスレッド
- `await` なしは「並行処理」ではなく「イベントループで順番待ち」
- CPU負荷が高い処理はGoやRustに任せ、TypeScriptはAPI層だけ担当する構成も多い

### Node.jsのパフォーマンス対策
- **Worker Threads** — マルチスレッドっぽく動かせる
- **Child Process** — 別プロセスに処理を投げる
- **クラスタリング** — CPUコア数分だけプロセスを起動

---

## 5. Reactのstate設計原則

### isSending・isSentのような派生値

```js
const isSending = status === 'sending'; // レンダリングのたびに再計算される
const isSent = status === 'sent';
```

- 可読性が上がる
- `status === 'sending'` の変更が1箇所で済む

### stateはIDだけ持つ

```js
// NG: オブジェクトごと持つ
const [selectedItem, setSelectedItem] = useState(items[0]);

// OK: IDだけ持つ
const [selectedId, setSelectedId] = useState(0);
const selectedItem = items.find(item => item.id === selectedId);
```

- オブジェクトを持つと「古い参照を見てしまう」バグが起きやすい
- IDで持てばstateが更新されるたびに自動的に最新の値が取れる

### Single Source of Truth
stateが唯一の真実。DOMの状態を見に行く必要はない。

```js
// NG: DOMの状態で判定（jQueryやVueの癖）
if (e.target.checked) { ... }

// OK: stateで判定
if (selectedIds.includes(toggledId)) { ... }
```

---

## 6. コンポーネントのkey

`key` を付与するとReactがそれぞれを別のコンポーネントとして認識する。
`key` が変わると古いコンポーネントを破棄して新しく作るため、stateがリセットされる。

```jsx
<ProfileForm key={selectedUserId} />
// selectedUserIdが変わるとフォームがリセットされる
```

---

## 7. 再帰コンポーネントとImmer

### フラットなデータ構造
ツリー構造をオブジェクトのフラットなマップで表現する。

```js
{
  0: { id: 0, title: 'Root', childIds: [1, 2] },
  1: { id: 1, title: 'Earth', childIds: [3] },
  3: { id: 3, title: 'Japan', childIds: [] },
}
```

### 再帰コンポーネント
自分自身を呼び出すコンポーネント。`childIds` が空になった時点で終了。

```jsx
function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  return (
    <li>
      {place.title}
      {place.childIds.map(childId => (
        <PlaceTree key={childId} id={childId} placesById={placesById} />
      ))}
    </li>
  );
}
```

### Immerで再帰削除

```js
updatePlan(draft => {
  // 親のchildIdsから切り離す
  draft[parentId].childIds = draft[parentId].childIds.filter(id => id !== childId);

  // 子孫を再帰的に全削除
  function deleteAllChildren(id) {
    const place = draft[id];
    place.childIds.forEach(deleteAllChildren); // 子を再帰削除してから
    delete draft[id];                          // 自分を削除
  }
  deleteAllChildren(childId);
});
```

- `forEach` に関数を直接渡すことで省略できる
- `childIds` が空なら `forEach` が何もしないので自然に終了条件になる

---

## 8. JavaScriptの配列メソッド

```js
// includes: 値が含まれるか
[1, 2, 3].includes(2); // true

// some: 条件に一致する要素があるか（オブジェクト検索に便利）
[{ id: 1 }, { id: 2 }].some(item => item.id === 2); // true

// filter: 条件に一致する要素だけ残す
[1, 2, 3].filter(id => id !== 2); // [1, 3]

// map: 各要素を変換する
items.map(item => item.id === id ? { ...item, title: '新しいタイトル' } : item);
```
