# Reactのイベントハンドラまとめ

## 1. 親 → 子に関数を渡すパターン（基本）

親でハンドル関数を定義し、propsで子に渡すのがReactの基本パターン。

```jsx
// 親コンポーネント
function Parent() {
  function handleClick() {
    console.log('クリックされた！');
  }
  return <Child onClick={handleClick} />;
}

// 子コンポーネント
function Child({ onClick }) {
  return <button onClick={onClick}>クリック</button>;
}
```

**役割分担**
- 親 → 状態の管理・関数の定義
- 子 → UIの表示・イベントのトリガー

---

## 2. 子の関数を親から呼ぶパターン（例外的）

`useRef` + `useImperativeHandle` を使う。**使いすぎ注意**。

```jsx
import { useRef, useImperativeHandle, forwardRef } from "react";

const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    sayHello() {
      console.log('子の関数が呼ばれた！');
    }
  }));
  return <div>子コンポーネント</div>;
});

function Parent() {
  const childRef = useRef(null);
  return (
    <div>
      <Child ref={childRef} />
      <button onClick={() => childRef.current.sayHello()}>
        子の関数を呼ぶ
      </button>
    </div>
  );
}
```

| | 親→子に関数を渡す | 子の関数を親から呼ぶ |
|---|---|---|
| **データの流れ** | 自然（単方向） | 逆方向で不自然 |
| **推奨度** | ✅ 基本パターン | ⚠️ 限定的に使う |
| **主な用途** | イベント処理全般 | フォームリセット、アニメーション開始など |

---

## 3. 命名慣習

| 場所 | 慣習 | 例 |
|---|---|---|
| **親で関数を定義するとき** | `handle〇〇` | `handleClick`, `handleSubmit` |
| **propsとして渡すとき** | `on〇〇` | `onClick`, `onChange` |

```jsx
function App() {
  function handlePlay() {  // 定義 → handle〇〇
    alert('Playing!');
  }
  return <Button onClick={handlePlay}>Play</Button>;
  //              ↑ props名 → on〇〇
}
```

---

## 4. イベントハンドラは適切なHTMLタグに設定する

クリックを処理するには `<div>` ではなく `<button>` を使う。

```jsx
// ❌ 避ける
<div onClick={handleClick}>クリック</div>

// ✅ 推奨
<button onClick={handleClick}>クリック</button>
```

`<button>` を使うことで**キーボードナビゲーションやスクリーンリーダーなどのブラウザ組み込みの振る舞い**が有効になる。見た目を変えたい場合はCSSで対応する。

---

## 5. 伝播の代わりにハンドラを渡すパターン

子をクリックしたとき、子の処理も親の処理も両方やりたい場合の実装方法。

### ① イベント伝播に任せる（自動）

```jsx
<div onClick={() => console.log('親')}>
  <button onClick={() => console.log('子')}>クリック</button>
</div>
// → 「子」→「親」と自動で両方実行される
```

### ② 明示的に親の関数を呼ぶ（推奨）

```jsx
function Button({ onClick, children }) {
  function handleClick(e) {
    e.stopPropagation(); // 伝播を止める
    onClick();           // 親の関数を明示的に呼ぶ
  }
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}
```

| | イベント伝播 | 明示的に呼ぶ |
|---|---|---|
| **実行の流れ** | 自動・暗黙的 | 明示的 |
| **追跡のしやすさ** | 難しい | コードを見ればわかる |
| **途中に処理を挟む** | やりにくい | やりやすい |

> ラムダをそのまま書くより `handle〇〇` で定義して渡す方が読みやすく、命名慣習にも沿った形になる。

