## ref で DOM を操作する

https://ja.react.dev/learn/manipulating-the-dom-with-refs

## チャレンジ問題にトライ

### チャレンジ 1/4: ビデオの再生と一時停止

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
    if (nextIsPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
   }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250" ref={videoRef}>
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}

```

`videoRef`を用意し、`play`, `pause`で再生/停止を切り替えるように修正する。  


### チャレンジ 2/4: 検索フィールドにフォーカス

```js
import { useRef } from 'react'

export default function Page() {
  const inputRef = useRef(null);
  
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();      
        }}>Search</button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

`ref`を定義して、`button#onClick`した際のイベントハンドラ内で`ref`で参照しているinput要素を`focus`する。  


### チャレンジ 3/4: 画像カルーセルをスクロールする


```js
import { useState, useRef } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  function scrollToCat(index) {
    ref.current.get(catList[index]).scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  function getMap() {
    if (!ref.current) {
      ref.current = new Map();
    }
    return ref.current;
  }
  
  return (
    <>
      <nav>
        <button onClick={() => {
          const nextIndex = index < catList.length - 1 ? index + 1 : 0;
          setIndex(nextIndex);
          scrollToCat(nextIndex);
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li 
              key={cat.id}
              ref={node => {
                const map = getMap();
                map.set(cat, node);
                return () => {
                  map.delete(cat);
                };
              }}
              >
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}
```

こんな感じで定義してみた。  

模範解答は全然違うｗ  
アクティブな画像のrefだけ持たせる感じらしい。  


```js
<li ref={index === i ? selectedRef : null}>
ここでrefを変化させているようだ。  

          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });

flushSync() をつかってsetIndex後にDOMを更新しているようだ。  
```
こっちの方がシンプルだね。  


### チャレンジ 4/4: 別々のコンポーネントで検索フィールドにフォーカス

```js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const ref = useRef(null);

  return (
    <>
      <nav>
        <SearchButton ref={ref} />
      </nav>
      <SearchInput ref={ref} />
    </>
  );
}
```

```js
export default function SearchButton({ ref }) {
  return (
    <button onClick={() => {
      ref.current.focus();      
    }}>
      Search
    </button>
  );
}
```

```js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```

`ref`を`props`として渡せばOK  

としたけど、模範解答は下記のようだ。
ハンドラはここで定義して、`SearchInput`だけref={inputRef}として渡している。  

```js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

設計の違いについて確認してみたけど、  
Claude君に聞いてみると  

- SearchButton の責務は「クリックされたことを親に伝える」だけ
- 「クリックされたら input にフォーカスする」という判断は親（Page）がすべき

だから模範解答では onClick のハンドラを親に置いているんですね。
SearchButton は「何をするか」を知らなくていい、「押されたよ」と伝えるだけ、という分離です。これが単一責務の原則に近い考え方です。
自分のコードは動きますが、SearchButton が ref の存在を知っている時点で、本来知らなくていい情報を持ってしまっています。

ということらしい。  
反省；；


