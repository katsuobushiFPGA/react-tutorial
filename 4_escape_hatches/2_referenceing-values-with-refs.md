## refで値を参照する

### チャレンジ 1/4: 壊れたチャット入力欄を修正


```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutID.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}

```

### チャレンジ 2/4: 再レンダーに失敗するコンポーネントを修正

refだと再レンダーのトリガーが発動しないので…。  
`state`にする。  


```js
import { useState } from 'react';

export default function Toggle() {
  const [isOnState, setIsOnState] = useState(false);

  return (
    <button onClick={() => {
      setIsOnState(!isOnState);
    }}>
      {isOnState ? 'On' : 'Off'}
    </button>
  );
}

```

### チャレンジ 3/4: デバウンスの修正


```js
import { useRef } from 'react'


function DebouncedButton({ onClick, children }) {
  let timeoutRef = useRef(null);

  return (
    <button onClick={() => {
      clearTimeout(timeoutRef);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}

```

### チャレンジ 4/4: 最新の state を読む


```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + inputRef.current.value);
    }, 3000);
  }

  return (
    <>
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}

```


DOMを直接触ってやってみたけど、これはお作法的に良くないようなので以下のようにしてあげるのが良いようだ。  

```js
  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }
```
