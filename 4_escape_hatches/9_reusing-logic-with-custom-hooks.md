### チャレンジ問題にトライ

#### チャレンジ 1/5: useCounter フックを抽出

`App.js`
```js
import { useCounter } from './useCounter'

export default function Counter() {
  const count = useCounter();
  
  return <h1>Seconds passed: {count}</h1>;
}
```

`useCounter.js`

```js
import { useState, useEffect } from 'react';
export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);  
  return count;
}
```

#### チャレンジ 2/5: カウンタの遅延を設定可能に

`App.js`
```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

`useCounter(delay)`とした。  

`useCounter.js`
```js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

#### チャレンジ 3/5: useCounter から useInterval を抽出

`App.js`
```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

`useCounter.js`
```js
import { useState } from 'react';
import { useInterval } from './useInterval';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval.js`
```js
import { useEffect, useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  const onTickCount = useEffectEvent(onTick);
  useEffect(() => {
    const id = setInterval(onTickCount, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

#### チャレンジ 4/5: インターバルがリセットされる問題を修正

さっき既に直してたやつです。  
`useEffectEvent`で関数ラップしてました。  


```js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  const onTickEvent = useEffectEvent(onTick);
  useEffect(() => {
    const id = setInterval(onTickEvent, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]);
}

```

まあ問題のコードは、`onTick`が依存配列に入ってしまっていること。  
これがあると、`useCounter.js`のdelay:1000ms(1s)のタイミングで`setCount`として再レンダされてしまい、  
Counterコンポーネントが再実行されて、`onTick`も変わっているので`useInterval`のクリーンアップ関数が呼ばれて…。という感じになる。  
なので背景色を変更するタイマーの方は動作がしない…。  
逆に背景色を変更するタイマーのdelayがカウンタタイマーより短ければ動作はするのである。  
→ 背景色を変更するタイマーの方では再レンダをするようなsetState関数が呼ばれていないので実はどっちも動く。  

#### チャレンジ 5/5: タイムシフト効果の実装

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useState, useEffect } from 'react';

function useDelayedValue(value, delay) {
  const [point, setPoint] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPoint(value)
    }, delay)
  }, [value, delay]);
  return point;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}

```
