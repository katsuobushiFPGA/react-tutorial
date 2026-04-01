### チャレンジ問題にトライ

#### チャレンジ 1/4: 更新されない変数を修正

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

> しかし、プラスボタンを何度クリックしても、カウンタは 1 秒ごとに 1 つずつ増えていきます。このコードの何が問題なのでしょうか？ なぜエフェクトのコード内部では increment が常に 1 になっているのでしょうか？ 間違いを見つけて修正しましょう。

依存配列が空だったので、マウント時に1回実行されたきりとなっている。  
そのため、`increment`を依存配列に入れて`increment`の変化から`useEffect`で同期の停止→開始(再同期)を行うようにすればよい。  
つまり以下の部分  

```diff
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
-  }, []);
+  }, [increment]);
```

### チャレンジ 2/4: カウンタのフリーズを修正


```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });
  
  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

こういうことだろうか。  
`increment`を依存配列にすると`interval`の登録/解除が走ることになりタイマーの開始/停止が行われる。  
なので、`setCount`部分を`useEffectEvent`に逃がす形とする。  

### チャレンジ 3/4: 遅延を調整できない問題を修正

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent((delay) => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount(delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}

```

こんな感じ。  
えー違いました。  

`onMount`で切り出した`useEffectEvent`を消している。  

```js
  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);
```

で、まあこんな感じになるのか。  

`delay`を依存配列に入れるのはまあそうなんだけども。  

> 一般的に、onMount のような、コードの目的ではなくタイミングに焦点を当てた名前の関数は疑ってかかるべきです。最初は「分かりやすい」と感じるかもしれませんが、実際にはあなたの意図を分かりづらくします。

なるほど…。そうなんだ。  

> 例えば、onMessage、onTick、onVisit、onConnected は、良いエフェクトイベント名です。
> これらのイベントの中のコードは、おそらくリアクティブである必要はないでしょう。一方、onMount、onUpdate、onUnmount、onAfterRender は名前は過度に汎用的なものであり、リアクティブにすべきコードを誤って入れてしまうことがあります。

あー目的にあった名前っていうのはこういうことね。  
まあ、前回の章でもあった目的が異なるコードが1つの`useEffect`, `useEffectEvent`にあるとデバッグが難しくなるっていう部分。  

> このため、エフェクトイベントの名前は、コードがいつ実行されるかではなく、ユーザの視点から何が起こったのかを基準にして付けるべきなのです。

はい…。  

もっとコードを綺麗にするという観点とか責任原則とかの部分を勉強したほうがいいな。  
基本の設計の部分が怪しいのかもしれない…；；  

### チャレンジ 4/4: 遅延表示型の通知を修正


> “general” から “travel”、そして “music” に素早く切り替えると、2 つの通知が表示され、1 つ目は “Welcome to travel”、2 つ目は “Welcome to music” となるように修正してください。

まず1個めの問題を解消する。  

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent( (roomId) => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

これは以下の部分を修正した。  
`onConnected`が引数なしで、常に`roomId`の最新を見るようになっていたため発火時に引数として`roomId`を渡すように修正した。  

```js
  const onConnected = useEffectEvent( (roomId) => {
    showNotification('Welcome to ' + roomId, theme);
  });

  ...

  connection.on('connected', () => {
    setTimeout(() => {
      onConnected(roomId);
    }, 2000);
  });
```

当然呼び出し時も修正。  

次の課題  

> （追加の課題として、ちゃんと 2 個の通知が正しい部屋を表示するようにした後で、後者の通知のみが表示されるようにコードを修正してみてください。）  

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent( (roomId) => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    let timeoutId = null;
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      timeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => { 
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

こういう感じ。  

