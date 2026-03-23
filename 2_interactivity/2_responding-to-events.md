## イベントへの応答

https://ja.react.dev/learn/responding-to-events

### このページで学ぶこと
- イベントハンドラを記述するさまざまな方法
- 親コンポーネントからイベント処理ロジックを渡す方法
- イベントの伝播のしかたとそれを停止する方法

なるほど。  
でも基本的にはJSの記述方法がベースだから詰まることはない気はする。  

### イベントハンドラの追加

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```
ということで、こういうボタンコンポーネントを用意する。  

`Button`をクリックした際のアクションを用意するには以下とするようだ。  

1. Button コンポーネントの内部で handleClick という関数を宣言します。
2. その関数内にロジックを実装します（ここでは alert を使ってメッセージを表示）。
3. `<button>` の JSX に onClick={handleClick} を追加します。

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

ここまではクイックスタートでやったな。  

で、イベントハンドラ関数は以下の慣習があると  

- 通常、コンポーネントの内部で定義されます。
- イベント名の先頭に handle が付いた名前にします。

> 慣習的に、イベントハンドラは handle の後ろにイベントの名称をつなげた名前にすることが一般的です。onClick={handleClick}、onMouseEnter={handleMouseEnter} などがよく見られます。

なるほど。  

こういう書き方もできる。  
もちろんアロー関数を使って記述もできる。  

```js
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>

<button onClick={() => {
  alert('You clicked me!');
}}>
```

### 落とし穴


これはやったね。  

`()` で呼び出しちゃうので、 関数を渡す形にするってことと。  
引数がある場合は無名関数(ラムダ)で包んで渡すってところ。  

### イベントハンドラでの props の読み取り

今度は、propsにある`message`を押したときの`alert`の内容として表示する例。  
これもまあできると。  

### イベントハンドラを props として渡す

> Button というコンポーネントには、使用する場所によって、動画を再生する、画像をアップロードするなど、異なる関数を実行させたいことでしょう。

それはその通り。  

> これを行うには、以下のようにして、コンポーネントが親から受け取った props の一部をイベントハンドラとして渡します：

というわけで例を見る。  


### イベントハンドラの props の命名


> <button> や <div> のような組み込みコンポーネントは、onClick のようなブラウザのイベント名のみをサポートしています。ただし、独自のコンポーネントを作成する場合、イベントハンドラとなる props を、好きなように命名できます。

ふむ  


> 慣習として、イベントハンドラのプロップは on で始まり、次に大文字の文字が続くようにします。
> たとえば、Button コンポーネントの props である onClick は onSmash と命名することも可能です：

確かに良くあるのは `onXXXX` が多い気がする。  

- 親で定義するとき → handle〇〇
- propsとして渡すとき → on〇〇

ってことね。  


> この例の <button onClick={onSmash}> を見ると分かるように、ブラウザの <button>（小文字）は常に props として onClick が必要ですが、カスタム Button コンポーネントが受け取る props の名前はあなた次第です！

まあ定義している部分はブラウザサポートされている属性のみってのはわかる。  
で、独自で定義したコンポーネントは何でもよいってのはそうだともわかる。  

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

```

まあ、この場合だと
`Button`が一番子コンポーネントで、`<button onClick=~~~>` を定義していると。  
で、それを呼んでいるのが `Toolbar`コンポーネントですと。  
`Toolbar`では、propsで受け取っている関数のハンドラを2つ呼び出し側で渡している。  
これはそのまま親から子にそのまま流している感じですね。  

> Toolbar が onPlayMovie や onUploadImage をどう扱うのかを、App コンポーネントが知る必要がないことに注意してください。

ふむふむ。  

> それは Toolbar の実装の詳細です。ここでは、Toolbar はそれらを Button の onClick ハンドラとして渡していますが、後でキーボードショートカットでもそれらをトリガするようにすることができます。

ほう。    

> onPlayMovie のようなアプリ固有のインタラクションに基づいて props を名付けることで、後でどのように使用されるかを変更できるという柔軟性が得られます。  

これは命名をしっかりすることで可読性という部分でいいよねってはなし。  


### 補足

> イベントハンドラは適切な HTML タグに設定するようにしてください。例えば、クリックを処理するためには、<div onClick={handleClick}> ではなく <button onClick={handleClick}> を使用します。

これはそうだよね。  
`div`タグに`onClick`ってあるというよりほとんどすべてのタグにonClickはあるらしい。  
ただ、適切なものを用意するべきってことなのかな。  
見た目はCSSで整えればよいということね。  

### イベント伝播

これはJSでも悩まされるよね。  
`jQuery`書いてた時に何だよこれって思ってたな。  

> イベントハンドラは、コンポーネントが持っている可能性のあるどの子が由来であってもイベントをキャッチします。このことをイベントがツリーを “バブリング (bubble)” または “伝播 (propagate)” する、と表現します。イベントは発生した場所から始まり、ツリーを上に向かって進んでいきます。

まあつまり、子ども要素からイベントが始まって親要素まで走るってことだよね。  

```html
<div>
 <button>
 <button>
</div>
<div>
 <button>
 <button>
</div>
```
みたいな構造になっているけど、この場合は`button`を押すと`div`の要素のイベントも走るって感じだ。  
伝搬は子→親になるので兄弟要素は関係ない。  
`button`を押しても兄弟要素の`button`は関係ないし、その上の`div`の兄弟要素の`div`のイベントも発火しない。  

> どちらのボタンをクリックしても、最初にそれ自体の onClick が実行され、その後で親である <div> の onClick が実行されます。つまりメッセージが 2 つ表示されます。ツールバー自体をクリックすると、親の <div> の onClick のみが実行されます。

まあまあそういうことよね。  

### 落とし穴  

> React では onScroll 以外のすべてのイベントが伝播します。onScroll は、それをアタッチした JSX タグでのみ機能します。

そうなんだ・・・！  

### 伝播の停止

これは`e.stopPropagation`を使う例。  

> イベントハンドラは、イベントオブジェクトを唯一の引数として受け取ります。慣習的に、それは “event” を意味する e と呼ばれています。このオブジェクトを使用して、イベントに関する情報を読み取ることができます。

だよね。  
これはいつものですね。  


> このイベントオブジェクトを使い、伝播を止めることもできます。イベントが親コンポーネントに伝わらないようにしたい場合、以下の Button コンポーネントのようにして e.stopPropagation() を呼び出す必要があります：

そうですね。  


```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

これで`Button`をクリックしても親要素のイベントは走らないことになる。  
伝搬を停止しているのでここでイベントが止まるって感じ。  


> ボタンをクリックすると以下のことが起こります。

> 1. React が <button> に渡された onClick ハンドラを呼び出す。
> 2. そのハンドラは Button で定義されており、次のことを行う。
>    - e.stopPropagation() を呼び出し、イベントがさらにバブリングされるのを防ぐ。
>    - Toolbar コンポーネントから渡された props である onClick 関数を呼び出す。
> 3. その関数は Toolbar コンポーネントで定義されており、そのボタン固有のアラートを表示する。
> 4. 伝播が停止されたため、親の <div> の onClick ハンドラは実行されない。

うんうん。そうだよね。  


> e.stopPropagation() の結果、ボタンをクリックすると、アラートが 2 つ（<button> と親のツールバーの <div> から）ではなく、1 つだけ（<button> のみから）表示されるようになります。

それは確かに。  

> ボタンをクリックすることと、周囲のツールバーの余白をクリックすることは別物なので、この UI では伝播を止めることが理にかなっています。

なるほどなー。  


### キャプチャフェーズのイベント

> まれに、伝播が停止されても子要素のすべてのイベントをキャッチしたいという場合があります。たとえば、伝播のロジックに関係なく、すべてのクリックを分析のため記録したい場合などです。これを行うには、イベント名の末尾に Capture を追加します。

ほほーそんなことができるんだ。  

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
``` 

として、`onClickCapture`として、`Capture`を末尾に追加すればいいらしい。  

> すべてのイベントは 3 つのフェーズで伝播します。

> 1. 下方向に移動し、すべての onClickCapture ハンドラを呼び出す。
> 2. クリックされた要素自体の onClick ハンドラを実行する。
> 3. 上方向に移動し、すべての onClick ハンドラを呼び出す。  

ってことは、仮に`stopPropagation`しないと `onClickCapture`→`onClick`→`onClickCapture`って感じになるんだな。  

### 伝播の代わりにハンドラを渡す

> このクリックハンドラは、親から渡された onClick を呼び出す前に、1 行コードを実行していることに注目してください。

ほうほう。  


```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

> 親の onClick イベントハンドラを呼び出す前に、このハンドラにさらにコードを追加することもできるでしょう。

onClickの前にコードを追加できるってことだよね。  

> このパターンは、伝播の代替手段になります。子コンポーネントにイベントを処理させつつ、親コンポーネントが追加の動作を指定できるようになるのです。

あーなるほど。  


> 伝播とは異なり、これは自動的に起こることではありません。しかし、このパターンの利点は、あるイベントが発生した結果として実行されるコードのすべての繋がりをはっきりと追跡できることです。

ふむ。  

いまいちつかめないな。  

### デフォルト動作を防ぐ

> ブラウザのイベントには、デフォルトの動作が関連付けられているものがあります。例えば、<form> の submit イベントは、その中のボタンがクリックされると、デフォルトではページ全体がリロードされます。

はい。  
これはそうだよね。  
画面全体に更新が走るよね。  

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

`e.preventDefault()`を使って更新しないようにすると。  

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

これも`jQuery`の時によく見たね。  

- e.stopPropagation() は、ツリーの上側にあるタグにアタッチされたイベントハンドラが発火しないようにします。
- e.preventDefault() は、数は少ないですがイベントがブラウザデフォルトの動作を持っていた場合に、それを抑制します。


### イベントハンドラは副作用を持っていても構わない？

> もちろんです！ イベントハンドラは副作用のための最適な場所です。

なるほど！  

> レンダー関数とは異なり、イベントハンドラは純関数 (pure function) である必要はないので、何かを変更するのに最適な場所です。

レンダーに関しては入力に対して出力が一意でないとだめだったはず。  
`純関数`ね。  

> たとえば、入力値をタイプに応じて変更する、ボタンの押下に応じてリストを変更する、などです。ただし、情報を変更するためには、まずそれを格納する方法が必要です。
> React では、これは state、コンポーネントのメモリを使用して行います。次のページでそのすべてを学びます。

よし次から`state`か。  

### まとめ  

- イベントは、<button> などの要素に関数を props として渡すことで処理できます。
- イベントハンドラは渡す必要があります。呼び出してはいけません！ onClick={handleClick} とするのであって、onClick={handleClick()} としてはいけません。
- イベントハンドラ関数は別途定義することも、インラインで定義することもできます。
- イベントハンドラはコンポーネント内に定義されているため、props にアクセスできます。
- 親でイベントハンドラを宣言し、子に props として渡すことができます。
- イベントハンドラ props を定義する際にアプリケーション固有の名前をつけることができます。
- イベントは上方向に伝播します。これを防ぐには、最初の引数を使って e.stopPropagation() を呼び出します。
- イベントは、望ましくないデフォルトのブラウザ動作を持つことがあります。これを防ぐには、e.preventDefault() を呼ぶ必要があります。
- 子コンポーネントでイベントハンドラを定義して props から受け取ったハンドラを明示的に呼び出すことは、伝播の代替手段として良い方法です。

### チャレンジ問題にトライ

#### チャレンジ 1/2: イベントハンドラを修正

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

これは、 `onClick`に指定されている関数の渡し方が間違っているので修正をして完了  


```diff
- <button onClick={handleClick()}>
+ <button onClick={handleClick}>
```

### チャレンジ 2/2: イベントを接続


```js
export default function ColorSwitch({
  onChangeColor
}) {
  function handleChangeColor(e) {
    e.stopPropagation();
    onChangeColor();
  }
  
  return (
    <button onClick={handleChangeColor}>
      Change color
    </button>
  );
}
```

こんな感じかな。  

親にイベント伝搬しているからカウンタが増えているようなのでそれを防ぐ。  
インラインで書いてもよいけど、まあごちゃごちゃになりそうなので別で関数を定義した形にする。  






