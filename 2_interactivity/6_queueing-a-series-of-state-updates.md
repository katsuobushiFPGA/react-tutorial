## 一連の state の更新をキューに入れる

https://ja.react.dev/learn/queueing-a-series-of-state-updates

### このページで学ぶこと

- 「バッチ処理」とは何か、React が複数の state 更新を処理する際にどのように使用されるのか
- 同じ state 変数に対し連続して複数の更新を適用する方法

### React は state 更新をまとめて処理する

> 以下で “+3” ボタンをクリックした場合、setNumber(number + 1) を 3 回呼び出しているので、カウンタが 3 回インクリメントされると思うかもしれません。

前の章からある例ですね。  

```js
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
```
のところ。  

> イベントハンドラ内のすべてのコードが実行されるまで、React は state の更新処理を待機します。
> このため、再レンダーはこれらの setNumber() 呼び出しがすべて終わった後で行われます。

これがバッチ処理か。


> レストランで注文を取るウェイターの話を思い出すかもしれません。ウェイターは最初の料理の注文を聞いた瞬間にキッチンにかけこむわけではありません！ 代わりに、客の注文を最後まで聞き、訂正がある場合はそれも聞き取り、さらにはテーブルの他の客からの注文もまとめて受け取るはずです。

ハンバーグ、いやポテト付きハンバーグ、いやディアボラ風ハンバーグステーキってことか。  

> このような動作はバッチ処理（バッチング）とも呼ばれ、これにより React アプリの動作が格段に素早くなります。

なるほどね。  

> React は、クリックのような意図的なイベントが複数回発生した場合、それらにまたがったバッチ処理までは行いません。各クリックは別々に処理されます。React は一般的に安全と判断される場合にのみバッチ処理を行いますので、安心してください。たとえば、最初のボタンクリックでフォームを無効にしたのであれば、2 度目のクリックでフォームが再び送信されてしまわないことが保証されます。

ここは確かに気になるところだけど、イベントはちゃんと処理されるって話ね。  

### 次のレンダー前に同じ state を複数回更新する

> 一般的なユースケースではありませんが、次のレンダー前に同じ state 変数を複数回更新する場合、setNumber(number + 1) のようにして次の state 値を渡すのではなく、代わりに setNumber(n => n + 1) のようなキュー内のひとつ前の state に基づいて次の state を計算する関数を渡すことができます。

関数形式だとできると。  

```js
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
```

ということね。  


1. React はこの関数をキューに入れて、イベントハンドラ内の他のコードがすべて実行された後に処理されるようにします。
2. 次のレンダー中に、React はキューを処理し、最後に更新された state を返します。

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

で、まあ1→2→3となり3で更新されるという話。  

### state を置き換えた後に更新するとどうなるか

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

これはどうなるかという話。  
確かに…考えてみよう。  

今までの感じだと、

キューに 
1: (0 + 5)
2: (5 => 5 + 1)
となって、6となりそうだ。  

実行してみるとあってますね。  

### 補足

> お気づきかもしれませんが、setState(5) とは、実際には n の使用されない setState(n => 5) と同じように動作します！

確かに！そうとも置き換えられるな。  

### state を更新した後に置き換えるとどうなるか

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

今度は、あれですね。最後のset関数で更新している42になりますね。  

### 命名規則

set[変数名] っていうのが一般的らしい。  


### まとめ
- state をセットしても既存のレンダーの変数は変更されず、代わりに新しいレンダーが要求される。
- React は、イベントハンドラが完了してから state の更新を処理する。これをバッチ処理と呼ぶ。
- 1 つのイベントで複数回 state を更新したい場合 setNumber(n => n + 1) という形の更新用関数を使用できる。

### チャレンジ問題にトライ

#### チャレンジ 1/2: リクエストカウンタの修正

以下のように更新関数を使えばOK  

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(v => v + 1);
    await delay(3000);
    setPending(v => v - 1);
    setCompleted(v => v + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

模範解答の修正は以下の部分。  
まあ、ラムダでとる変数名が違うくらい。  

```js
  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }
```

### チャレンジ 2/2: state キューの独自実装

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;
  for (let i = 0; i < queue.length; i++) {
    finalState = pop(finalState, queue[i])
  }
  return finalState;
}

function pop(val, v) {
  if (typeof v === 'function') {
    return v(val)
  } else {
    return v
  }
}
```

こんな感じで作ってみた。  

`queue`を前から走査して、pop関数で関数かそれ以外下での条件分岐をし、関数であれば引数の値に適用して返す。値であればそのまま返す。  


```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}

```

おー。かなりスマートだ…。  

for~of を使っていますね。  
とはいえ、あとはやっていることは同じかな。  
自分は`pop`関数として逃がしたけど。 
`pop`って今考えると適切な名前じゃないな。  
`pop`して値を適用しているんだから、`popApply`とか`apply`とかなのかもしれない。  
`update`でもよいのかも。  





