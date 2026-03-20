## リストのレンダー

https://ja.react.dev/learn/rendering-lists

`map`, `filter`などの配列メソッドを使って配列を操作するという話。  

**学ぶこと**

- JavaScript の map() を使用して、配列からコンポーネントをレンダーする方法
- JavaScript の filter() を使用して、特定のコンポーネントのみをレンダーする方法
- React での key の使用方法と、その必要性

### 配列からデータをレンダー


チュートリアルに従って`List`要素を配列に移して、`JSX`として返すようにコンポーネントを作成した。  


```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export function List() {
  const listItems = people.map(person => (
    <li>{person}</li>
  ));
  return (
    <ul>{listItems}</ul>
  );
}
```


で、これだと、コンソール上で以下のエラーが出る。  

```txt
List.tsx:11 Each child in a list should have a unique "key" prop.

Check the render method of `List`. See https://react.dev/link/warning-keys for more information.
```

このエラーはとりあえず後で治すとして次に行く。  

### アイテムの配列をフィルタする

さらに変化を加える。  

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

こんな感じの構造化したデータにして、このデータに対して`filter`を適用する。  


```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

### 落とし穴


> アロー関数は => の直後の式を自動的に返しますので、return 文を直接書く必要はありません。

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

なるほどね…！  

> ただし、もし => の次に { が続く場合は、必ず return 文を明示的に書く必要があります。

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

ほうほう。  
これは`JavaScript`の構文だよね。  

> => { を含むアロー関数は “ブロック形式の関数本体” を持つものとして扱われます。これにより複数行のコードが書けるようになりますが、return 文を自分で書かなければなりません。書き忘れた場合は何も返されません！

これは気を付けないとね。  

### key によるリストアイテムの順序の保持

さっきでてきた。  

```txt
Warning: Each child in a list should have a unique “key” prop.
```
のエラーについての解決をする節になる。  

> 配列の各アイテムには、key を渡す必要があります。配列内の他のアイテムと区別できるようにするための一意な文字列ないし数値のことです。


まあこれは `Vue`でもあったよね。  

`Vue`でもこれはエラーが出てくる、ただし描画はできるみたいな状態だったはず。  
`React`も同じ感じかな。  
`Vue`のほうが後発だったと思うのでまあ同じ思想にしているのかもしれない。  

```js
<li key={person.id}>...</li>
```

このようにして、一意の値である`key`という形で指定する必要があるとのこと。  

> key は、配列のどの要素がどのコンポーネントに対応するのかを React が判断し、後で正しく更新するために必要です。これが重要となるのは、配列の要素が移動（ソートなどによって）した場合、挿入された場合、あるいは削除された場合です。

あーなるほど。
`key`を指定するのはそういう意図があったのか。  
配列の順番が変わるときにどれがどうなったのかっていうことか。  
これは、DOMの差分検出アルゴリズムとかにかかわってくるのかな…。  
仮想DOMの概念も知っておきたいな。  

> key は動的に生成するのではなく、元データに含めるべきです。

はい。  
データとして一意に特定のできる物も含めておくとよいということですかね。  

`id`とか`uuid`とかですかね。  
これなかったときは、いろんな要素結合して`key`作ってた記憶があるな。  
まあそれは動的な生成なのであまりよくない感じだったかな。  


### リストアイテムごとに複数の DOM ノードを表示する

> 短い <>...</> フラグメント構文では key を渡せないため、これらを 1 つの <div> にグループ化するか、やや長くてより明示的な <Fragment> 構文を使用する必要があります。

これじゃん。  
`Vue`だと `template`とかで頑張らなかったっけ…。  

`<>～</>`は`key`を持てないんだね。 

### key をどこから得るのか

- データベースからのデータ： データがデータベースから来る場合、データベースのキーや ID は必然的に一意ですので、それを利用できます。
- ローカルで生成されたデータ： データがローカルで生成されて保持される場合（例：ノートを取るアプリにおけるノート）は、アイテムを作成する際に、インクリメンタルなカウンタや crypto.randomUUID()、または uuid などのパッケージを使用します。

あーまあまあこのあたりはそうだよねって感じ。  

### key のルール

- キーは兄弟間で一意でなければなりません。ただし、異なる配列に対応する JSX ノードには同じキーを使用することができます。
- キーは変更してはいけません。さもないと key の目的が台無しになります。レンダーの最中に key を生成してはいけません。

ほうほう。  
兄弟間ってことは同じ階層の要素っていうことだよね。  
階層っていうとちょっと違うか…？  

```js
[['a', 'b', 'c'], ['d', 'e', 'f']]
```
多分こういう配列があったときに、'a', 'b', 'c'は一意、'd', 'e', 'f' 同士で一意ってことなんじゃないかな。

### なぜ React は key を必要とするのか

これは知っておきたい。

> デスクトップ上のファイルに名前がない場合を想像してください。代わりに、最初のファイル、2 番目のファイルといったように、順番によってそれらを区別する必要があるとしましょう。そのうち番号に慣れるかもしれませんが、ファイルを削除した途端に混乱してしまいますね。2 番目のファイルが 1 番目のファイルになり、3 番目のファイルが 2 番目のファイルになり、という具合です。

いい具体例じゃないか。  
さっきの話と同じでソートするととか順番が変わるとッていう話だよね。  
    
> フォルダ内のファイル名と JSX の key の目的は似ています。兄弟間で項目を一意に識別できるようにするのです。適切に選択された key は、配列内の位置よりも多くの情報を提供します。並べ替えによって位置が変更されたとしても、key のおかげで React はその項目が存在する限り、それを一意に識別できるのです。

あーたしかに。
要は同じ階層のフォルダ名は同じ名前はダメだけど、違う階層はいいもんね。  

### 落とし穴

> アイテムのインデックスを key として使用したくなるかもしれません。実際、key を指定しなかった場合、React はデフォルトでインデックスを使用します。しかし、アイテムが挿入されたり削除されたり、配列を並び替えたりすると、レンダーするアイテムの順序も変わります。インデックスをキーとして利用すると、微妙かつややこしいバグの原因となります。

配列のインデックスを使うと…って話だよね。  
まあ確かに削除でインデックスが詰まったりしたりするしね。  


> 同様に、key={Math.random()} などとしてキーをその場で生成してはいけません。こうするとキーがレンダーごとに一切合致しなくなり、コンポーネントと DOM が毎回再作成されるようになります。

動的生成もだめですと。  
あーこれMath.random()とかData.now()とか実行時に動的に変わるのがだめってことで。  
文字列結合をして生成する行為はいいんだね。  
例えば {id}-{name}みたいな生成の仕方とか。  


> データに紐づいた安定した ID を使用してください。

これが一番重要そうだ。  

> コンポーネントは key を props として受け取らないということに注意してください。React 自体がヒントとして使用するだけです。コンポーネントが ID を必要とする場合は、別の props として渡す必要があります：<Profile key={id} userId={id} />。

要は識別するだけでデータとしては扱わないってイメージかな。  
`key`は`props`には入らないと。  

### 演習問題

#### 1. リストを 2 つに分割

```js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export function Item({person}) {
  return (
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>    
  );
}

export default function List() {
  const chemist = people.filter(person =>
    person.profession === 'chemist'
  );
  const others = people.filter(person => 
    person.profession !== 'chemist'
  );
  const listItems = chemist.map(person =>
    <Item person={person} />
  );
  const otherItems = others.map(person => 
    <Item person={person} />
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
      <h1>Others</h1>
      <ul>{otherItems}</ul>
    </article>
  );
}

```
として書いてみたけど、以下のように出た。  
```txt
Each child in a list should have a unique "key" prop.
```

悩んだ挙句わからないのでclaudeに聞いてみると、


```
問題は**keyの場所**。
Itemコンポーネントの中で<li key={person.id}>ってやってるけど、keyはmapで要素を生成している側につけないといけない。
```
とのことで、こういうことらしい。  

```jsx
// ❌ 今のコード
const listItems = chemist.map(person =>
  <Item person={person} />  // ← ここにkeyがない
);

// ✅ 正しくはこう
const listItems = chemist.map(person =>
  <Item key={person.id} person={person} />  // ← mapの返り値にkey
);
```
Item内の<li>のkeyは単に無意味（liに直接keyを書いても、Reactが管理したいのはコンポーネントのリストのほうだから）。

理由としては、Reactがdiffを取る対象は**<Item>のリスト**であって、その中身のDOMじゃないから。<Item>にkeyがないとReactがどの要素が追加・削除・並び替えられたか判断できない。


なるほどな。

```js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export function Item({person}) {
  return (
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>    
  );
}

export default function List() {
  const chemist = people.filter(person =>
    person.profession === 'chemist'
  );
  const others = people.filter(person => 
    person.profession !== 'chemist'
  );
  const listItems = chemist.map(person =>
    <Item key={person.id} person={person} />
  );
  const otherItems = others.map(person => 
    <Item key={person.id} person={person} />
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
      <h1>Others</h1>
      <ul>{otherItems}</ul>
    </article>
  );
}
```
完成コードはこれ。  

ちなみに答えではItemコンポーネントとして共通化していないので、勝手に共通化して勝手にはまってます。  

####  2. 同一コンポーネント内のネストしたリスト

```js
import { recipes } from './data.js';
import { Fragment } from 'react';

export default function RecipeList() {
  const receipeList = recipes.map(recipe => 
    {
      const ingredients = recipe.ingredients.map(ingredient => 
        <li key={recipe.id + ingredient}>{ingredient}</li>
      );
      return (
        <Fragment key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul key={recipe.id}>
            {ingredients}
          </ul>
        </Fragment>
      );
    }
  );
  
  return (
    <div>
      <h1>Recipes</h1>
      {receipeList}
    </div>
  );
}
```
これでいいかな・・・？  

claudeにレビューしてもらったら、

```js
<ul key={recipe.id}>
```
の`key`部分はいらないよねってことだった。  
まあ確かに要らないですね。  

> あとはingredientのkeyでrecipe.id + ingredientってやってるのは、文字列結合だと意図しない衝突が起きる可能性があるので、
> 

```js
<li key={`${recipe.id}-${ingredient}`}>{ingredient}</li>
```
区切り文字入れとくとより安全だね。

なるほど～。


模範解答は下記だった。  

```jsx
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

```


ちょっとclaudeに比較してもらうと下記でかえってきた。


1. <Fragment>じゃなくて<div>
これは正直どっちでもOK。ただ<Fragment>はDOMに余分なノードを生やさない分むしろ良い選択とも言える。好みと状況次第。
2. ingredientのkeyがrecipe.idなしのシンプルな文字列
jsx// 模範解答
<li key={ingredient}>{ingredient}</li>

// 君のコード
<li key={recipe.id + ingredient}>{ingredient}</li>
さっき「兄弟間で一意ならOK」って話したように、<li>のkeyは同じ<ul>の中で一意であれば十分。同じレシピの中に同じ材料が重複することはないはずなのでingredientだけで十分ってこと。

全体的に君のコードは間違いじゃなくて、むしろ丁寧に書いてる印象。模範解答はよりシンプルに書き直した感じだね。


なるほどね。  

あー材料が2度表示はないっていうことをちゃんと考えられてなかった。  

どうしても親の一意の要素と結合して衝突回避を考えちゃうな。  
もっと深く考えて必要最小限にする必要があるのかな。  


### 3: リスト要素のコンポーネントを抽出

> この RecipeList コンポーネントは、2 つのネストした map 呼び出しを含んでいます。これを単純化するために、id, name, ingredients という props を受けとる Recipe コンポーネントを抽出してください。外側の key はどこに置きますか、またその理由は？

1でやっちまったよ…。  


```js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```
これを直していく。  


```js
import { recipes } from './data.js';
function Recipe({id, name, ingredients}) {
  return (
    <div>
      <h2>{name}</h2>
        <ul>
          {ingredients.map(ingredient =>
            <li key={ingredient}>
              {ingredient}
            </li>
          )}
        </ul>
     </div>
  );  
}
export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
        {recipes.map(recipe =>
          <Recipe 
            key={recipe.id}
            id={recipe.id}
            name={recipe.name}
            ingredients={recipe.ingredients}
          />
        )}
    </div>
  );
}
```

こんな感じに直した。  


模範解答を見ると、  

```js
<Recipe {...recipe} key={recipe.id} />
```
ここの部分だけ違かった。スプレッド構文を使っているかどうかの部分だった。  

> key は <Recipe> から返される <div> 内ではなく、<Recipe> 自体に指定する必要があることに注意してください。これは、key を直接必要としているのはそれを囲んでいる配列の文脈の方だからです。これまでは <div> の配列があったので個々の div に key が必要でしたが、今存在するのは <Recipe> の配列です。別の言い方をすると、コンポーネントを抽出する場合は、コピーペーストする JSX の外に key を残すことを忘れないようにしましょう。

これは重要だな。  


#### 4. セパレータ付きリスト


```
import { Fragment } from 'react'
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <Fragment key={index}>
          <p>
            {line}
          </p>
          {index < poem.lines.length - 1 ? <hr /> : '' }
        </Fragment>
      )}
    </article>
  );
}
```

答えを見てみたところアプローチが全然違った…。

```jsx
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

どうやら配列にいったん全部入れて、最初の`<hr>`を消しているみたいだった。  



```jsx
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}

```


あーこういうアプローチのほうが良かったな。  
最初以外に置くという発想だった。  

```js
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
```

こういう発想できるようにしておきたいな。  






