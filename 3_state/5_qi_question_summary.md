# React state の保持とリセット まとめ

## 1. stateの基本：コンポーネントが消えるとstateも消える

```jsx
{showB && <Counter />}  // falseになるとツリーから削除 → stateも消える
```

- `&&` で非表示にするとDOMから**完全に削除**されるのでstateも消える
- stateを保持しつつ非表示にしたい場合は `display: none` を使う（ただしDOMには残る）

---

## 2. stateが保持される条件

Reactは以下の**3つが同じ**場合に「同じコンポーネント」と判断し、stateを保持する。

1. **同じスロット（位置）**
2. **同じコンポーネントの種類**
3. **同じkey**

```jsx
// 保持される：同じ位置・同じ種類・propsだけ変わる
{isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}

// リセットされる：同じ位置だが種類が違う
{isPaused ? <p>See you later!</p> : <Counter />}
```

---

## 3. スロット（位置）は式の数で決まる

```jsx
// 三項演算子：スロットが1つ → 同じ位置
{isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />}

// &&演算子：スロットが2つ → 別々の位置
{isPlayerA && <Counter person="Taylor" />}   // スロット1
{!isPlayerA && <Counter person="Sarah" />}   // スロット2
```

- `&&` が `false` の時は `null` を返すが、**スロットとしては存在し続ける**
- **式の数 ＝ スロットの数**

---

## 4. keyによるstateの制御

### keyが変わる → 別物として作り直す → stateリセット

```jsx
// 連絡先を切り替えるたびにフォームをリセット
<EditContact key={selectedId} initialData={selectedContact} />
```

### keyが同じ → 同じものとして追跡 → state保持

```jsx
// 並び替えてもidが同じなら保持される
{items.map(item => <Counter key={item.id} />)}
```

### keyの衝突はNG

```jsx
// 同じ親・同じ階層に同じkeyが存在すると警告が出て挙動が予測不能になる
<Counter key="a" />
<Counter key="a" />  // ← Warning!
```

---

## 5. keyはHTMLタグにも使える

```jsx
// imgタグにkeyを付けることで画像切り替え時に前の画像をクリア
<img key={image.src} src={image.src} />
```

- keyはコンポーネントに限らず、ネイティブのHTMLタグにも使える
- keyは**「何を識別したいか」**に合わせて選ぶ（インデックスより意味のある値を使う）

---

## 6. keyとリフトアップの使い分け

| アプローチ | 概念 | 向いているケース |
|--|--|--|
| keyで作り直す | コンポーネントを使い捨て | 一時的なstateをリセットしたい |
| リフトアップ | コンポーネントを再利用 | 保存済みデータを親で管理したい |

```jsx
// keyアプローチ（1行追加するだけ）
<EditContact key={selectedId} initialData={selectedContact} />

// リフトアップ（useEffectも必要になり複雑）
const [editName, setEditName] = useState(selectedContact.name);
useEffect(() => {
  setEditName(selectedContact.name);
}, [selectedId]);
```

---

## 7. リストの並び替えとkey

```jsx
// インデックスをkeyにするとバグの原因になる
{displayedContacts.map((contact, i) => <li key={i}>)}  // NG

// idをkeyにすると並び替えても正しく追跡される
{displayedContacts.map((contact) => <li key={contact.id}>)}  // OK
```

- インデックスをkeyにすると並び替え時にstateがズレる
- **データベースのIDのような不変の値**をkeyに使うのがベストプラクティス

---

## 8. 配列を使ったシンプルな並び替え

```jsx
const fields = [
  <Field key="firstName" label="First name" value={firstName} onChange={...} />,
  <Field key="lastName" label="Last name" value={lastName} onChange={...} />
];

return (
  <>
    {reverse ? [...fields].reverse() : fields}  // [...fields]で元の配列を破壊しない
  </>
);
```

---

## 9. データとUIの状態は分離する

```jsx
// NG：データにUIの状態を混入させる
const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com', hide: false }
];

// OK：UIの状態は別のstateで管理する
const [expandedIds, setExpandedIds] = useState(new Set());
```

---

## まとめ：判断フロー

- **stateをリセットしたい** → `key` を変える
- **stateを保持・共有したい** → リフトアップ
- **非表示だがstateを保持したい** → `display: none` or リフトアップ or 外部store（Zustand等）

