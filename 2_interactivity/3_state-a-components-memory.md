## state：コンポーネントのメモリ

https://ja.react.dev/learn/state-a-components-memory

> コンポーネントによっては、ユーザ操作の結果として画面上の表示内容を変更する必要があります。

- フォーム上でタイプすると入力欄が更新される
- 画像カルーセルで「次」をクリックすると表示される画像が変わる
- 「購入」をクリックすると買い物かごに商品が入る

> コンポーネントは、現在の入力値、現在の画像、ショッピングカートの状態といったものを「覚えておく」必要があります。  
> React では、このようなコンポーネント固有のメモリのことを state と呼びます。  

なるほどなー。  

### このページで学ぶこと
- useState を使って state 変数を追加する方法
- useState フックが返す 2 つの値
- 複数の state 変数を追加する方法
- state がローカルと呼ばれる理由

### 通常の変数ではうまくいかない例

> 以下は、彫刻の画像をレンダーするコンポーネントです。“Next” ボタンをクリックすると、index が 1、2 のように変わりながら次の彫刻が表示されて欲しいのですが、これは正しく動作しません（試してみてください）。

まあ確かにこれまで習った仕組みから考えると、`index`という変数はレンダーごとに初期化されるから保持されなさそうな気はする。  

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

というわけでAIに聞いてみた感じだとそれであってそうだった。  
次にいこう。  

> handleClick イベントハンドラは、ローカル変数 index を更新しています。しかし、以下の 2 つの理由により、目に見える変化が起きません。
> 1. ローカル変数はレンダー間で保持されません。React がこのコンポーネントを次にレンダーするときは、まっさらな状態からレンダーします。過去にローカル変数を変更したことは考慮されません。

ですよね。  

> 2. ローカル変数の変更は、レンダーをトリガしません。新しいデータでコンポーネントを再度レンダーする必要があることに React は気づきません。

あーなるほどね。  
そもそもこのローカル変数の置き換えだと再レンダリングされないということか。  

> コンポーネントを新しいデータで更新するためには、次の 2 つのことが必要です。
> 1. レンダー間でデータを保持する。
> 2. 新しいデータでコンポーネントをレンダー（つまり再レンダー）するよう React に伝える。

うんうんそうだよね。1,2を解決するには上記が必要ということだ。  

> useState フックは、これら 2 つの機能を提供します。
> 1. レンダー間でデータを保持する state 変数。
> 2. 変数を更新し、React がコンポーネントを再度レンダーするようにトリガする state セッタ関数。

で解決する手段はこれらを利用すればよいとのこと。  

useStateでstate変数を用意してそれを使っていけば、保持もできるし更新時に再レンダリングされるということか。  
恐らくsetterの方の関数で再レンダリングをトリガーしてくれているのかな。  
トリガーなのかフックなのかはわからないけど。  

### state 変数の追加

```js
// useStateのインポート
import { useState } from 'react';

// state変数とセッターの定義
const [index, setIndex] = useState(0);
```
をすれば準備完了と  
値の更新はセッター関数を使えばOK  

```js
function handleClick() {
  setIndex(index + 1);
}
```

### はじめてのフック

> React では、useState やその他の use で始まる関数はフック (Hook) と呼ばれます。

はい。

> フックは、React がレンダーされている間のみ利用可能な特別な関数です（この点については、次ページで詳しく説明します）。フックを使うことで、さまざまな React の機能に「接続 (hook into)」して使用することができます。

了解。  

### 落とし穴

> use で始まるフックは、コンポーネントのトップレベルまたはカスタムフック内でのみ呼び出すことができます。

ほう。  

> 条件分岐、ループ、ネストされた関数の中でフックを呼び出すことはできません。

へぇー。  

> フックは関数ですが、コンポーネントの要求に関する無条件の宣言を行うものだ、と捉えることが有用です。
> ファイルの先頭でモジュールを “import” するのと同様に、コンポーネントの先頭で React の機能を “use” するのです。

### useState の構造


> useState を呼び出すということは、このコンポーネントに何かを覚えさせるよう React に指示を出すということです：

コンポーネントがレンダーされるたびに、useState は以下の 2 つの値を含む配列を返します。

> 1. 保存した値を保持している state 変数 (index)。
> 2. state 変数を更新し、React にコンポーネントの再レンダーをトリガする state セッタ関数 (setIndex)。

まあそうだよね。  
変数とそれを更新するための関数が必要なので返すと。  

```js
const [index, setIndex] = useState(0);
```
というわけで、このコードの意味を見てみる。

> 1. コンポーネントが初めてレンダーされる。useState に index の初期値として 0 を渡したので、[0, setIndex] を返す。React は 0 が最新の state 値であることを覚える。

まあそうだ。  
初期値: index→0
セッター関数: setIndex
が返ってくると。  

> 2. state を更新する。ユーザがボタンをクリックすると、setIndex(index + 1) が呼び出される。現在 index は 0 なので、setIndex(1) になる。これにより、React は index が 1 になったことを覚え、再レンダーがトリガされる。

これは確かに、setIndex(index + 1)は、setIndex(0 + 1)となるので、setIndex(1)として更新されると。  


> 3. コンポーネントの 2 回目のレンダー。React は再び useState(0) というコードに出会うが、React は index を 1 にセットしたことを覚えているので、代わりに [1, setIndex] を返す。

あーこれは確かに、2回目は初期値が使われないんだね。  

### コンポーネントで複数の state 変数を使う

> 1 つのコンポーネントは、いくつでも好きな型の state 変数を持つことができます。このコンポーネントは、数値型の index と、“Show details” をクリックすると切り替わるブーリアン型の showMore という、2 つの state 変数を持っています。

まあ複数も使えますよねってはなし。  

> この例の index と showMore のように state が互いに関連していない場合、複数の state 変数を持つのが良いでしょう。ただし、2 つの state 変数を一緒に更新することが多い場合は、それらを 1 つにまとめる方が簡単かもしれません。

ほう。関連しているのであればまとめたほうが良いと。  

> たとえば、多くのフィールドがあるフォームの場合、フィールドごとに state 変数を持つよりも、オブジェクトを保持する 1 つの state 変数を持つ方が便利です。

これはまあ確かにその通りだ。

formというオブジェクトで name, address, birth とかがあったとしてそれを一つずつstate変数とするよりかは、オブジェクトとしてまとめたほうが良いのはその通りな気がする。  

まあオブジェクトの一部更新はスプレッド構文でsetすればよいのでいけるはず。  
っていうのは前の章とかでやったよね。  

```js
setForm({ ...form, name: 'Bob' });
```
こんな感じ。  

### React はどの state を返すかをどのようにして知るのか？

> useState の呼び出しには、どの state 変数を参照しているかに関する情報が含まれていないことに気付いたかもしれません。useState に「識別子」のようなものを渡さないのに、どの state 変数が返されるべきなのか、どのようにしてわかるのでしょうか。あなたの関数を解析するといった魔術的なものに頼っているのでしょうか？ 答えはノーです。

これは本当にそうだよね。さっきclaudeに聞いてましたわ。  

> そうではなく、簡潔な構文を実現するため、フックは同一コンポーネントの各レンダー間で同一の順番で呼び出されることに依存しています。

はい。  

> 上記のルール（「フックはトップレベルでのみ呼び出す」）に従っていれば、フックは常に同じ順序で呼び出されるので、これは実用上うまく機能します。また、リンタプラグインがほとんどの間違いをキャッチします。

だから、if, forなどの条件分岐でuseStateの呼び出しの順番が変わると困るっていうわけですよね。  

> 内部的には、React はすべてのコンポーネントに対して state のペアの配列を保持しています。また、現在のペアインデックスも管理しており、レンダー前に 0 に設定されます。useState が呼び出されるたびに、React は次の状態ペアを提供し、インデックスをインクリメントします。

ふむふむ。  

で、簡易実装があると。  

`useState`部分だけ見ておけばよいかな。 
`Gallery`はそのままで、`updateDOM`はDOMの更新をしているだけなので。  
この辺はAIに聞いて自分なりの理解したものと同じだったので、振り返りながらまとめたものを見ておけばよいでしょう。  

### state は独立しておりプライベート

> state は画面上の個々のコンポーネントインスタンスに対してローカルです。

インスタンス間で互いに干渉したりすることはないってことね。  

> 言い換えると、同じコンポーネントを 2 回レンダーした場合、それぞれのコピーは完全に独立した state を有することになります！

インスタンスごとに違うって話ね。  


```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}
```

これで、1つめのGalleryと2つめのGalleryの内部のstate変数は互いに独立しているよねってこと。 

> これが state 変数と、モジュールのトップレベルで宣言する通常の変数との違いです。state は特定の関数呼び出しやコードの場所に紐付いているのではなく、画面上の特定の場所に対して「ローカル」になります。あなたが 2 つの <Gallery /> コンポーネントをレンダーしたので、それらの state は別々に保持されているのです。

なるほどね。  

> また、Page コンポーネントは、Gallery の state の値も、そもそも state が存在するかどうかも「知らない」ということにも注目してください。

えーそうなんだ。  

> props と違い、state はそれを宣言したコンポーネントに完全にプライベートなものです。

へーそうなのか。

> 親コンポーネントがそれを変更することはできません。このおかげで、任意のコンポーネントに state を追加したり削除したりしても、他のコンポーネントに影響を与えることはありません。

あーそういう意味だと複雑にならないね。  

> 両方のギャラリで state を同期させたい場合はどうすればよいでしょうか？

これは気になるね。  

> React での正解は、子コンポーネントから state を削除して、それらに最も近い共有の親に追加することです。

これはそうか。共通の親要素に移動するって話がどこかにありましたね。  

### まとめ

- レンダー間で情報を「記憶」しておく必要があるコンポーネントには、state 変数を使う。
- state 変数は、useState フックを呼び出すことで宣言される。
- フックは use から始まる特殊な関数であり、state などの React 機能に「接続」できる。
- フックはインポートと似ており、無条件に呼び出す必要がある。useState などのフックの呼び出しは、コンポーネントのトップレベルか別のフックでのみ有効である。
- useState フックは、現在の state とそれを更新する関数の組み合わせを返す。
- 複数の state 変数を持つことができる。内部で React はそれらを呼び出し順を用いて対応付ける。
- state はコンポーネントにプライベートなものである。2 つの場所でレンダーすると、それぞれのコピーが独立した state を得る。

### チャレンジ問題にトライ

#### チャレンジ 1/4: ギャラリの完成


```js
  const isDisabled =  sculptureList.length - 1 == index;
  ...
      <button onClick={handleNextClick} disabled={isDisabled}>
        Next
      </button>

```
上記を追加した。

でPrevボタンとか追加して結果的にこんな感じに。  


```diff
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
+ const isPrevDisabled = index == 0;
+ const isNextDisabled = sculptureList.length - 1 == index;

+ function handlePrevClick() {
+   setIndex(index - 1);
+ }

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
+     <button onClick={handlePrevClick} disabled={isPrevDisabled}>
+       Prev
+     </button>
+     <button onClick={handleNextClick} disabled={isNextDisabled}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </>
  );
}

```

答えを見る。  

```js
  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;


   function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  ...

   <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Previous
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        Next
      </button>
```

こんな感じらしいね。
あー。handleの方直してなかったですね。  
;;

### チャレンジ 2/4: 動かないフォームの修正


```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```

こんな感じに直した。  
useState使いましょうって感じの問題。  

### チャレンジ 3/4: クラッシュの修正


```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}

```

これは、`else`句にあった`useState`の宣言箇所をなおしただけ。  

### チャレンジ 4/4: 不要な state を削除

```js
export default function FeedbackForm() {
  let name = '';

  function handleClick() {
    name = (prompt('What is your name?'));
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}

```
`useState`の不要個所を直した。  
`name`はstate変数である必要がないのでuseStateではなく初期値をそのまま入れた。  

不要であることの説明。  

`useState`で更新した際に、次のレンダーまで変数の値が更新されないため常にpromptで入力してsetNameされる値は空となるためである。  
なので、この場合だとnameが常に空となってしまうため。  
今回は、受け取った値をそのまま表示すればよいのでローカル変数が適している。  








