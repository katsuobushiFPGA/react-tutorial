### チャレンジ問題にトライ

#### チャレンジ 1/4: インターバルがリセットされる問題を修正

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent( () => {
    console.log('⏰ Interval tick');
    setCount(count + 1);    
  });
  
  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

こういうこと？  

ではなく、模範解答としては  

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}

```
として、更新用関数を使うとのこと。  
それはそうか…  
この辺はAIに聞いてみたが、更新用関数で済むならそれが良いし、そうでないなら本当にこの値はuseEffectで読む必要があるのかなどを考えろということらしい。  
頭が固いので悲しい…。  

#### チャレンジ 2/4: アニメーションの再トリガを修正


```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onSlider = useEffectEvent((animation) => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onSlider(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

`duration`を依存配列から削除して、`useEffectEvent`に切りだした。  

#### チャレンジ 3/4: チャットの再接続を修正

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { serverUrl, roomId } = options;
  useEffect(() => {
    const connection = createConnection({ serverUrl: serverUrl, roomId: roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

<原因>
`Toggle theme`をした際に、`App.js`で`setIsDark`が呼ばれる。  
親コンポーネントが再レンダされるので、当然子コンポーネントも再レンダされる。  
なので、`ChatRoom`子コンポーネントで渡されているオブジェクトは再生成されるため、`useEffect`に設定されている依存配列の「options」が同一ではなくなる。  
そのため、`Toggle theme`を押した際に`useEffect`が呼ばれてしまう。  

<解決＞  
`options`をコンポーネント側で分割代入し、それを`useEffect`内部の処理に渡すように修正した。  


模範解答では上記の方法と、もう一つ`props`の引数を変えるという方法もあった。  
まあそれは確かにその通りではある。  

#### チャレンジ 4/4: 別のチャット再接続問題を修正

`App.js`

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        isDark={isDark}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

`ChatRoom.js`
```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId, isEncrypted, isDark }) {

  const onMessage = useEffectEvent((msg)=> {
    showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
  });
  useEffect(() => {
    const options = {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
    const connection = 
      isEncrypted ? createEncryptedConnection(options) 
                  : createUnencryptedConnection(options);
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

はい。こんな感じでしょうか。  

えーまず、`ChatRoom.js`内にある`useEffect`ですよね。  
これを見ると、`createConnection`, `onMessage`が依存配列にあります。  
これらはどちらも関数なのでこのままではよくないです。  
なので親コンポーネントからの渡し方を変えました。  

まずは、`createConnection`から、`createConnection`→`ChatRoom.js`で作成するように移動  
手順としては、  

1. 親コンポーネントで渡されている部分について素直に移動。  

```js
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
```

2. この辺で使っている、`roomId`, `isEncrypted`はリアクティブな値である必要があるので、`props`に置く。  
3. なのでなんやかんや下記のような形になる。  


```js

import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {

  useEffect(() => {
    const options = {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
    const connection = 
      isEncrypted ? createEncryptedConnection(options) 
                  : createUnencryptedConnection(options);
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

という感じ。  
で呼び出し側では以下のようになる。  

```js
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        isEncrypted={isEncrypted}
      />
```
`isEncrypted`を渡す形に。  

この時点でチェックボックスをON/OFFするとちゃんと接続切り替えられているはず。  
セレクトボックス切り替えでも問題なし。  

残りは、`Use dark theme`の部分。  

4. 次に、`onMessage`の部分を直す。  
  `onMessage`は親コンポーネントで関数をつくっているのでここもどうにかする。  
  方針はさっきと同じでまずは、関数を渡すのをやめる。  

5. 親コンポーネントでの渡し方を以下とする。  


```js
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        isEncrypted={isEncrypted}
      />
```
↓

```js
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        isDark={isDark}
      />
```

6. 子コンポーネントでは`props`を以下のように修正。  


```js
export default function ChatRoom({ roomId, isEncrypted, isDark }) {
```

7. onMessageの部分について、`useEffect`内にそのまま素直に書くと以下のようになる。  


```js
  useEffect(() => {
    const options = {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
    const connection = 
      isEncrypted ? createEncryptedConnection(options) 
                  : createUnencryptedConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
    }));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted, isDark]);

```

ただこれだと、`isDark`の部分が変わったときに`useEffect`が呼ばれてしまうところが変わっていない。  
なので、`useEffectEvent`に分離する。  


8. `useEffectEvent`への分離  


```js
  const onMessage = useEffectEvent((msg)=> {
    showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
  });
  useEffect(() => {
    const options = {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
    const connection = 
      isEncrypted ? createEncryptedConnection(options) 
                  : createUnencryptedConnection(options);
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);
```

こんな感じにする。  
というわけでここまで行けば完了。  


模範解答を見てみると筋としては同じで書き方が少し違う感じだった。  
`onMessage`の実装を親にするか子にするかっていう部分が気になる。  
これ、子のほうがいいように見えるんだけどどうなんだろう。  


→AIにレビューしてもらったら責務の分離的には`ChatRoom.js`が知る必要ないから`isDark`を`props`として渡すのはどうなのって感じだった。  
まあその通りですね。  
とはいえ、親がこの通知の実装しているのもなんかなーって感じがするので通知用のコンポーネントが実装するのが正しそうな気がする。  
この辺は設計感覚を養っていきたいけどまだまだですね…。  


