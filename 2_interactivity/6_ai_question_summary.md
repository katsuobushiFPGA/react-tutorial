# Reactのstate更新まとめ

## 1. stateの更新はバッチ処理される
イベントハンドラ内のすべてのコードが実行されるまで、Reactはstateの更新を待機する。再レンダーはすべての `setState` 呼び出しが終わった後に行われる。

---

## 2. 値渡し vs 関数渡し

### 値渡し（最後の値が有効）
```javascript
setNumber(1);
setNumber(2);
setNumber(3); // → 結果は 3
```

### 関数渡し（順番に積み上がる）
```javascript
setNumber(n => n + 1); // 0 → 1
setNumber(n => n + 1); // 1 → 2
setNumber(n => n + 1); // 2 → 3 → 結果は 3
```

---

## 3. 内部的なキューのイメージ

**値渡し**
```
{ value: 1 } → { value: 2 } → { value: 3 } → 結果: 3
```

**関数渡し**
```
{ fn: n=>n+1 } → { fn: n=>n+1 } → { fn: n=>n+1 } → 0→1→2→3
```

> 「キューに積まれて実行はされるけど、値渡しは上書きされるだけ。関数渡しは実際に計算が走る」

---

## 4. 関数かどうかの判定

```javascript
typeof value === 'function' // → true / false
```

---

## 5. stateキューの独自実装

```javascript
export function getFinalState(baseState, queue) {
  let finalState = baseState;
  for (let i = 0; i < queue.length; i++) {
    finalState = applyUpdate(finalState, queue[i]);
  }
  return finalState;
}

function applyUpdate(val, update) {
  if (typeof update === 'function') {
    return update(val);
  } else {
    return update;
  }
}
```

### 関数名について
| 名前 | 評価 |
|------|------|
| `pop` | ❌ スタック操作を連想させて混乱を招く |
| `popApply` | ❌ `pop` が入るので同様に混乱を招く |
| `apply` | 🔺 悪くないが少し抽象的 |
| `update` | 🔺 自然だが少し曖昧 |
| `applyUpdate` | ✅ 意味が明確でおすすめ |
