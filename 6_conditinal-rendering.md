## 条件付きレンダー

https://ja.react.dev/learn/conditional-rendering

ついに、`if`とか`&&`, `? :`の演算子を使って、条件に応じてレンダリングするかどうかを決めるって内容の章がきたぞ。  

> このページで学ぶこと
> - 条件に応じて異なる JSX を返す方法
> - JSX の一部を条件によって表示したり除外したりする方法
> - React コードベースでよく使われる条件式のショートカット記法

いいね！学んでいこう。  

### 条件を満たす場合に JSX を返す

まずは、リスト要素全体を表示するコンポーネント`PackingList`とリスト要素の中身を表示するコンポーネント`Item`を作る。  

で、以下の要件が出てくる。  

> 例えば、複数の Item をレンダーする PackingList コンポーネントがあり、各 Item に梱包が終わっているかどうかを表示させたいとしましょう。
> 複数の Item コンポーネントのうち一部のみで、props である isPacked が false ではなく true になっていることに注意してください。目的は、isPacked={true} の場合にのみチェックマーク (✅) を表示させることです。

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

こういう書き方ができるので書いてみる。

お！チェックマークが表示されるようになったね。  

### null を使って何も返さないようにする

> 場合によっては、何もレンダーしたくないことがあります。例えば、梱包済みの荷物は一切表示したくない、という場合です。

なるほど、というわけで書いてみる。  


```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

おぉ！nullを返したらその項目そのものが返らなくなると。  
```html
<ul>
  <li></li>
  ...
  <li></li>
</ul>
```

って感じの構造で<li>が1個しかなくなったということね。  

> 実際には、レンダーしようとしている開発者を混乱させる可能性があるため、コンポーネントから null を返すことは一般的ではありません。

そうなのかよ！  
`null`は基本は使わないのね。  

### 条件付きで JSX を含める

```js
<li className="item">{name} ✅</li>
と
<li className="item">{name}</li>
```
は構造的にほぼ同じですよねってこと。  
チェックマークの有無だけですからね。 

> この重複に実害はありませんが、コードの保守性は悪化してしまいます。たとえば className を変更したくなったら？ コード内の 2 か所で変更が必要になってしまいますよね。このような状況では、条件付きで小さな JSX を含めることで、コードをより DRY に保つことができます。

その通りですよね。  

### 条件 (三項) 演算子 (? :)

三項演算子を使ってコンパクトするという話らしい。  

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

こういう書き方ができると。  

で追加、今度は`<del>`で囲みたい場合はどうするか。  


```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}
```
上記のように、`<del>` で要素を囲めばいいらしい。  
`()`は複数行にまたがっているから書いているだけということに注意。  
例えば1行であれば以下でもOK  

```js
{isPacked ? <del>{name + ' ✅'}</del> : name}
```

> これはシンプルな条件分岐の場合にはうまく動きますが、使いすぎないようにしましょう。条件のためのマークアップが増えすぎてコンポーネントが見づらくなった場合は、見やすくするために子コンポーネントを抽出することを検討してください。

まあそうだよね。  
これ条件分岐多すぎると複雑になりすぎる気がするよ…。  

### 論理 AND 演算子 (&&)

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

> これは「isPacked なら (&&)、チェックマークをレンダーし、それ以外の場合には何もレンダーしない」のように読んでください。

へぇーなるほど。  
構文だけ見ると、表示するって感じじゃないけど。  

> JavaScript の && 式 は、左側（条件）が true である場合、右側（今回の場合はチェックマーク）の値を返します。

あーそういう…。  

### 落とし穴

`&&` の左辺に数値を置かない

> JavaScript は条件をテストする際、左の辺を自動的に真偽値に変換します。しかし、左の辺が 0 の場合は、式全体がその 0 という値に評価されてしまうため、React は何もレンダーしないのではなく 0 を表示します。

でたな。  

```js
messageCount && <p>New messages</p>

は messageCountが0の場合に0が表示される。  

これを回避するためには、

messageCount > 0 && <p>New messages</p>
として、左の値は真偽値とする必要がある。(`boolean`)  
なるほどなーー
```

### 条件付きで JSX を変数に割り当てる

変数にJSXを割り当てるという話  


```js
// 変数として最初に表示したいデフォルトの値を指定する
let itemContent = name;

// 条件分岐で再代入
if (isPacked) {
  itemContent = name + " ✅";
}

// 返す
<li className="item">
  {itemContent}
</li>

```

```js
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
```

`JSX`を代入することもできることは覚えておこう…！  


### まとめ

- React では、JavaScript を使用して分岐ロジックを制御する。
- if 文を使用して、条件に応じて JSX 式を返すことができる。
- JSX 内で中身を条件付きで変数に保存し、波括弧を使用して他の JSX 内に含めることができる。
- JSX 内の {cond ? <A /> : <B />} は、「cond であれば <A /> をレンダーし、そうでなければ <B /> をレンダーする」という意味である。
- JSX 内の {cond && <A />} は、「cond であれば <A /> をレンダーし、そうでなければ何もレンダーしない」という意味である。
- これらのショートカットは一般的だが、プレーンな if が好きなら必ずしも使わなくて良い。

`if-else`などの条件演算子は他のプログラミング言語でも同じだし、`Smarty`などのビュー用のフレームワークでも似たようなことをしていたりするので特に違和感はなくできた。  
ただ、{cond && <A/>}みたいなのはしっかり覚えておこう。  
で、これは何を使っていくのが良さそうかというとまだわからない…。  
個人的には、条件演算子をJSX内にガツガツ書きたくない気がするので、変数に代入してって感じになりそうだけどな。  

### 演習問題

今回は答えも書いておく。

#### 1. ? : を使って未梱包アイコンを表示

```js
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
```

の部分を


```js
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
```

とした。

#### 2 && 演算子を使ったアイテムの重要度の表示


```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}
```

↓


```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}
```

↓


```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name} {importance != 0 && '(Importance:' + importance + ')'}
    </li>
  );
}
```

こんな感じかな。  

あーちょっと違かった。  

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}
```

#### 3: 連続する ? : を if と変数にリファクタ


```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}
```

↓


```js
function Drink({ name }) {
  let plant = 'leaf';
  let content = '15–70 mg/cup';
  let age = '4,000+ years'
  if (name !== 'tea') {
    plant = 'bean';
    content = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{plant}</dd>
        <dt>Caffeine content</dt>
        <dd>{content}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}
```

こんな感じに直してみた。  

おぉー。多分業務だったらこの直し方にするね。↓のやつ
こんな感じkey-valueのオブジェクト配列って形にすると思う。  


```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}
```







