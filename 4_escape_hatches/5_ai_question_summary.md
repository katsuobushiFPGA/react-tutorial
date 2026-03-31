# React学習メモ：クロージャ・コンポーネント設計・Next.js

## アロー関数の構文（ラムダの中身）

`return` が必要かどうかは「複数行かどうか」ではなく、**`{}` を使うかどうか**で決まる。

```js
// {} なし → return 不要（式をそのまま返す）
() => getVisibleTodos(todos, showActive)

// {} あり → return が必要
() => {
  return getVisibleTodos(todos, showActive);
}
```

オブジェクトリテラルを返すときは `()` で包む必要がある。

```js
() => ({ id: 1, name: "foo" })
```

---

## クロージャとラムダの違い

- **アロー関数（ラムダ）** → 関数の書き方・構文の話
- **クロージャ** → 外側のスコープの変数を「閉じ込めて」参照できる性質の話

`useMemo` の例は「アロー関数でもあり、クロージャでもある」。

---

## 言語によるクロージャのキャプチャの違い

| 言語 | キャプチャの方式 |
|------|----------------|
| JavaScript | 自動（スコープチェーン） |
| PHP | `use` で明示 |
| Python | 自動（再代入は `nonlocal` 必要） |
| Rust | `move` で明示（所有権があるので特殊） |
| C++ | `[=]`/`[&]`/`[x]` などで明示 |
| Go | 自動 |
| Swift | 自動（参照型は `[weak self]` 等を推奨） |

PHPが `use` を要求する理由は「どの変数をキャプチャしているか明示させる」設計思想。  
`useMemo` の依存配列 `[todos, showActive]` もある意味これに近い役割。

---

## useMemo の使いどころ

```js
const visibleTodos = useMemo(
  () => getVisibleTodos(todos, showActive),
  [todos, showActive]
);
```

- `getVisibleTodos` が軽い処理なら `useMemo` なしで直接呼ぶだけでも十分
- `useMemo` はパフォーマンス計測して「実際に遅い」と判明してから入れるのがReact公式の推奨スタンス
- 最初から入れると「本当に必要？」というレビューコメントが来ることもある

---

## コンポーネント設計の粒度

「最小設計」より**「適切な粒度」**が正確な表現。

**分割する判断基準**
- 同じUIが複数箇所で使われる（再利用）
- 状態管理の責務が明確に分離できる
- 1コンポーネントが大きくなりすぎた（100〜200行が目安）

**分割しない判断基準**
- そのコンポーネント以外で使われない
- 分けても props をバケツリレーするだけになる
- 一緒に変更されることが多いUI

**基本的な判断軸：「独立したUIかつ単独で何かしらの役割を持つ」場合にコンポーネント化する。**

---

## Reactの単方向データフロー

```
親コンポーネント
├── state: todos
├── handleChange = () => setTodos(...)  ← 変更の実体はここ
│
└── 子コンポーネントへ
    ├── todos        → 読むだけ（変更禁止）
    └── onChange     → 変更したいときはこれを呼ぶ
```

- 子は「データを受け取って表示する」「変更が必要なら親に委譲する」役割に徹する
- **データは上から下へ、イベントは下から上へ**
- propsのデータは直接変更してはいけない

---

## VueとReactの比較

### リアクティブシステムの違い

- **React** → コンポーネント関数を再実行してVirtual DOM全体を再計算してから差分適用
- **Vue** → `ref` や `reactive` で変数を監視し、変更があった箇所を直接追跡して更新

Vueの方が無駄な再計算が少ない。ReactがuseMemoやuseCallbackで最適化を必要とするケースが出てくるのはこの設計の違いから。

### v-model とReactの比較

```vue
<!-- Vue -->
<input v-model="text" />

<!-- ↓ 内部的にはこれと同じ -->
<input :value="text" @input="text = $event.target.value" />
```

```jsx
// React（糖衣構文を提供しない）
<input value={text} onChange={e => setText(e.target.value)} />
```

本質的には同じことをやっているが、Reactは裏側で何が起きているかが常に見える。

---

## Next.jsとは

**React ＝ 土地だけ（UIライブラリ）**  
**Next.js ＝ 自由度高めの建売フレームワーク**

Next.jsがReactに追加するもの：

- **ルーティング** → ファイルを置くだけでURLが生える
- **レンダリング戦略** → SSR / SSG / ISR / CSR を使い分けられる
- **API Routes** → バックエンドも書ける
- **画像最適化** → 組み込みで対応
- **Server Components** → サーバー側でHTMLを生成

VueにおけるNuxt.jsと同じポジション。

---

## keyを使ったstateリセット

`key` が変わるとReactは「別のコンポーネントだ」と判断して、古いものを破棄して新しく作り直す（stateも初期化される）。

### useEffect を使ったアプローチ（非推奨）

```js
useEffect(() => {
  setName(savedContact.name);
  setEmail(savedContact.email);
}, [savedContact]);
```

### key を使ったアプローチ（推奨）

親コンポーネントが編集できない場合は、**コンポーネントを分割して内側に `key` を渡す**。

```
EditContact（外側、エクスポート）
└── EditForm（内側、stateを持つ）
      key={savedContact.id}
```

```jsx
// EditContact の中で
<EditForm key={savedContact.id} savedContact={savedContact} onSave={onSave} />
```

`savedContact.id` が変わるたびに `EditForm` が別コンポーネントとして作り直され、stateが自動的にリセットされる。

`useEffect` でごまかすより `key` を使う方がReactの思想に沿っている。

