## state はスナップショットである

https://ja.react.dev/learn/state-as-a-snapshot

### このページで学ぶこと

- state のセットが再レンダーをどのようにトリガするのか
- state がいつどのように更新されるか
- state がセットされた直後に更新されない理由
- イベントハンドラが state の「スナップショット」にどのようにアクセスするのか

### state のセットでレンダーがトリガされる

これはさっきの章でもやったね。  

> ユーザインターフェースとはクリックなどのユーザイベントに直接反応して更新されるものだ、と考えているかもしれません。React の動作は、このような考え方とは少し異なります。

> 前のページで、state をセットすることで再レンダーを React に要求しているのだ、ということを見てきました。これは、インターフェースがイベントに応答するためには、state を更新する必要があることを意味します。

ほうほう。だよね。  

> この例では、“Send” を押すと、setIsSent(true) が React に UI の再レンダーを指示します。

`form#onSubmit`のイベントハンドラ内の`setIsSent(true)`がキモ  
ここで`isSent`のstateが変わるので、次のレンダー時に`isSent`がtrueとして条件分岐する。  


> ボタンをクリックすると次のような処理が行われます

> 1. onSubmit イベントハンドラが実行されます。
> 2. setIsSent(true) が isSent を true にセットし、新しいレンダーを予約します。
> 3. React が新しい isSent の値を使ってコンポーネントを再レンダーします。

まさにこれだね。  

### レンダーは時間を切り取ってスナップショットを取る

> React がコンポーネントを再レンダーする際には

> 1. React が再度あなたの関数を呼び出します。
> 2. 関数は新しい JSX のスナップショットを返します。
> 3. React はあなたの関数が返したスナップショットに合わせて画面を更新します。

はい。そうだよね。これも前の章で習った話ですね。  

> あなたのコンポーネントは、props やイベントハンドラの新たな一式を揃えた JSX という形で UI のスナップショットを返し、それらはすべてその特定のレンダー時の state の値を使って計算されます！

うんうん。  

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

この例はやったね。  
`number` の更新は次のレンダーまでされないから…っていうやつね。  

> setNumber(number + 1) を 3 回呼び出しましたが、今回のレンダーのイベントハンドラでは number は常に 0 なので、state を 3 回連続して 1 にセットしていることになります。これが、イベントハンドラが終了した後、React が number を 3 ではなく 1 とした上でコンポーネントを再レンダーする理由です。

### 時間経過と state

> なかなか面白い話でした。それでは、このボタンをクリックするとアラートに何が表示されるか予想してみてください。


```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

これは、`number`の値は次のレンダーまで更新されないので、0が表示されますね！  

> でも、アラートにタイマーを設定して、コンポーネントが再レンダーされた後に発火するようにしたらどうなるでしょうか？ “0” と表示されるのか、“5” と表示されるのか推測してみてください。


```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

これはあれですね。  
`number` → 0になるので、押した3秒後には0ですね。  
再レンダー後の発火は、5になるはず。

> アラートが実行される時点では React に格納されている state は既に更新されているかもしれませんが、アラートはユーザがボタンを操作した時点での state のスナップショットを使ってスケジューリングされました！

その通りだよね。  

> ここで、このお陰でタイミングにまつわる問題が起きづらくなっている、という例をお示しします。以下のフォームは、5 秒の遅延後にメッセージを送信します。

ほうほう。  

> 1. “Send” ボタンを押して、“Hello” というメッセージをアリスに送る。
> 2. 5 秒の遅延が終わる前に、“To” フィールドの値を “Bob” に変更する。

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

1. の時点で、その５秒後に`You said Hello to Alice`が表示されますね。
2. 5秒の遅延が終わる前に、`To` フィールドの値をBobに変更する。
→ 2の5秒後に`You said Hello to Bob`が表示されますと。

なので、順番としては`Alice`→`Bob`になるはず。  

> React は、レンダー内の state の値を「固定」し、イベントハンドラ内で保持します。コードが実行されている途中で state が変更されたかどうか心配する必要はありません。

実行した順に期待した結果になるからいいね。  


> しかし、再レンダー前に最新の state を読み取りたい場合はどうでしょうか？ state 更新用関数を使うことができます。これについては次のページで説明します！

なるほど！


### まとめ

- state のセットは新しいレンダーをリクエストする。
- React は state をコンポーネントの外側で、まるで棚に保管しておくかのようにして保持する。
- useState を呼び出すと、React はそのレンダーのための state のスナップショットを返す。
- 変数やイベントハンドラは複数レンダーをまたいで「生き残る」ことはない。すべてのレンダーは固有のイベントハンドラを持つ。
- 各レンダー（およびその中の関数）からは、常に、React が そのレンダーに渡した state のスナップショットが「見える」。
- レンダーされた JSX を考える時と同様にして、イベントハンドラ内の state を頭の中で実際の値に置換してみることができる。
- 過去に作成されたイベントハンドラは、それが作成されたレンダーにおける state の値を持っている。

### チャレンジ問題にトライ

#### チャレンジ 1/1: 信号機を実装

> 以下は、ボタンが押されると切り替わる歩行者用信号機のコンポーネントです。
> クリックハンドラに alert を追加してください。信号が緑で “Walk” と表示されている場合、ボタンをクリックすると “Stop is next” と表示され、信号が赤で “Stop” と表示されている場合、ボタンをクリックすると “Walk is next” と表示されるようにしてください。
> alert を setWalk の前に置いた場合と後に置いた場合で、違いはありますか？

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    if (walk) {
      alert('Stop is next')
    } else {
      alert('Walk is next')
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

こんな感じでよいでしょう。  

> alert を setWalk の前に置いた場合と後に置いた場合で、違いはありますか？

違いはありません。  
`walk`変数の値はこのレンダーでは一意になるので順番は関係ないです。  

> alert を setWalk の前に置いた場合と後に置いた場合で、違いはありません。このレンダー中、walk の値は固定です。setWalk を呼び出しても、次のレンダーまで実際の変更は起きず、現在レンダーのイベントハンドラには影響しません。

はい。そうですよね。  







