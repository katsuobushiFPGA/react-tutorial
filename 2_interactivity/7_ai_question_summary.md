# React State管理まとめ

## 1. APIデータのState管理

APIから取得するデータは非同期で変わるので、`useState`でstate管理するのが基本。

```javascript
const [data, setData] = useState(null);
```

---

## 2. APIコール前の存在しないプロパティへのアクセス対策

### ① ローディングフラグで表示を制御する（推奨）

```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

if (loading) return <p>Loading...</p>;
return <p>{data.user.name}</p>; // ここに来る時はdataが確実にある
```

### ② オプショナルチェイニング（`?.`）で安全にアクセス

```javascript
<p>{data?.user?.name}</p>
```

### ③ 実践的な組み合わせ

①＋②の組み合わせが一般的。ローディング中は別のUIを出しつつ、念のため`?.`でも守る。

---

## 3. オプショナルチェイニングを省略するには

### ローディング制御で丸ごと省略

```javascript
if (loading) return <p>Loading...</p>;
if (!data) return null;

// ここから下はdataが確実に存在するので?.不要
return <p>{data.user.name}</p>;
```

### カスタムフックにまとめる

```javascript
function useUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  return { data, loading };
}

// コンポーネント側はスッキリ
const { data, loading } = useUser();
if (loading) return <p>Loading...</p>;
return <p>{data.user.name}</p>;
```

### TanStack Query（React Query）を使う

規模が大きい場合はライブラリに任せるのが楽。

```javascript
const { data, isLoading } = useQuery({ queryKey: ['user'], queryFn: fetchUser });

if (isLoading) return <p>Loading...</p>;
return <p>{data.user.name}</p>;
```

---

## 4. useEffectとAPIコール

### useEffectが必要なケース

コンポーネントのマウント時（画面表示時）に自動でAPIコールしたいとき。

```javascript
useEffect(() => {
  fetch('/api/user')
    .then(r => r.json())
    .then(d => setData(d));
}, []); // []で「マウント時に1回だけ実行」
```

### useEffectが不要なケース

ボタンなどのイベントで取得する場合はイベントハンドラに直書きでOK。

```javascript
const handleClick = async () => {
  const res = await fetch('/api/user');
  const data = await res.json();
  setData(data);
};
```

### 検索条件の変更検知

依存配列に検索条件のstateを入れると、変更を検知して自動でAPIコールできる。

```javascript
const [query, setQuery] = useState('');

useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(d => setData(d));
}, [query]); // queryが変わるたびに実行される
```

複数条件も並べるだけ。

```javascript
}, [query, category, page]);
```

---

## 5. useEffectが複雑になりがちなポイント

### ① クリーンアップ問題

アンマウント後にAPIレスポンスが返ってきてstateを更新しようとしてエラーになる。

```javascript
useEffect(() => {
  let cancelled = false;

  fetch('/api/data')
    .then(r => r.json())
    .then(d => {
      if (!cancelled) setData(d);
    });

  return () => { cancelled = true; }; // クリーンアップ関数
}, []);
```

### ② 依存配列の管理

オブジェクトや関数を依存配列に入れると無限ループになることがある。

```javascript
// ❌ オブジェクトは参照比較なので毎回別物扱い → 無限ループ
}, [{ id: 1 }]);
```

### ③ 複数の副作用が絡まる

条件が増えると「どのタイミングで何が実行されるか」が追いづらくなる。

→ 複雑になってきたら **TanStack Query** への移行を検討する。

---

## 6. Stateのミューテートをしてはいけない理由

Reactは**参照が変わったかどうか**で再レンダリングの必要性を判断する。
直接ミューテートすると参照が変わらないため、再レンダリングされないことがある。

```javascript
// ❌ ミューテート（直接書き換え）
items.push(4);
setItems(items); // 同じ参照なのでReactが「変わってない」と判断する可能性がある

// ✅ 新しい参照を渡す
setItems([...items, 4]);
setUser({ ...user, name: '新しい名前' });
```

### ミューテートによる「やり過ごせる」ケースの例

以下のコードは`handleLastNameChange`に`...player`がないバグがある。

```javascript
function handleLastNameChange(e) {
  setPlayer({
    lastName: e.target.value  // firstNameとscoreが消える！
  });
}
```

`lastName`を更新すると`player.firstName`は`undefined`になるが、
inputの`value`に`undefined`が渡るとReactはDOMの値をそのまま残すため、
**画面上はfirstNameが消えていないように見えてしまう**。

これがミューテートや不正なstate更新の怖いところで、一見正常動作に見えてしまう。

### 正しい書き方

```javascript
function handleLastNameChange(e) {
  setPlayer({
    ...player,
    lastName: e.target.value,
  });
}
```

