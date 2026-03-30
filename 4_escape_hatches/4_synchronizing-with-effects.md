### チャレンジ問題にトライ

#### チャレンジ 1/4: マウント時にフィールドにフォーカス


```js
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();    
  });

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

最初の1回ということなので…`useEffect`を使う。  

```js
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()
 
  return (

```

元々こういうコードだったけど、DOMツリーがこの時点ではできておらず、`ref`がnullなのでエラーになるため。  
このコードでは要件を満たせない。  


```js
  useEffect(() => {
    ref.current.focus();
  }, []);
```
こうでした…。  

依存配列に空を指定していなかったです…。  

この辺のライフサイクル的な部分はまとめて知りたいな。  

### チャレンジ 2/4: 条件付きでフィールドにフォーカス

```js
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

こんな感じ。  

### チャレンジ 3/4: 2 回実行されるインターバルを修正

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return <h1>{count}</h1>;
}

```

### チャレンジ 4/4: エフェクト内のフェッチを修正

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);

    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return (() => {
      ignore = true;
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```
これはまあわかった。  






