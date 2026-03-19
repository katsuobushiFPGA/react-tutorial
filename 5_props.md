## コンポーネントに props を渡す

Vueでもあったpropsという機能ですと。  
propsはpropertiesの略でいいのかな。  

最初のコードは適当に書いて動作確認もOK  


### コンポーネントに props を渡す

まだ `props`はでてきていないと。  

これから`props`を与えていきましょう  

### Step 1: 子コンポーネントに props を渡す


```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

`<Avatar>`に`props`を渡してみる。  

### Step 2: 子コンポーネントから props を読み出す 

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

呼び出すときは、

```js
<Avatar 
  size={size}
  person= {person}
/>
```
みたいな感じかな。

### 落とし穴

`props`の宣言時に `( {} )`を付ける必要があると。  

```js
function Avatar({ person, size }) {
  // ...
}
```

分割代入と↑のコードは同じとのこと
```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

### props のデフォルト値を指定する

デフォルト引数、`Python`とか `C#`でもあるやつ。  


### JSX スプレッド構文で props を転送する

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

引数が多くてやだね！  
 
↓のようにスプレット構文で展開すればよいらしい。

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

ちょっとやってみると、propsの名前で見てくれるみたいなので、
`Avatar`のコンポーネントでは引数は下記の感じでいいみたい。  

```js
function Avatar({ person, size, isSepia, thickBorder }) {
  return (
    <div>
      <p>name={person.name}</p>
      <p>size={size}</p>
      <p>isSepia={isSepia}</p>
      <p>thickBorder={thickBorder}</p>
    </div>
  );
}

export default function Spread(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}

↓呼び出し側
import Spread from './Spread'

      <Spread
        person={{ name: 'hiroto' }}
        size={100}
        isSepia={false}
        thickBorder={'test'}
      />

```

> これにより、Profile に渡された props を、個々の名前を列挙することなくすべて Avatar に転送できます。

> スプレッド構文は慎重に使ってください。この構文をあらゆるコンポーネントで使っているなら、何かが間違っています。多くの場合は、コンポーネントを分割して JSX として children を渡すべきというサインです。今からこれについて述べていきます。

確かにそうだよね。

### children として JSX を渡す

```js
<div>
  <img />
</div>

みたいに、コンポーネントも入れ子にしたいことがある

<Card>
  <Avatar />
</Card>
```

CardコンポーネントはAvatarがセットされた`children`を`props`として受け取る。  

`<Card>` コンポーネント内に色々入れてみても表示できることを確認した。  

> <Card> 内の <Avatar> を何かテキストに置き換えてみて、ネストされているどんなコンテンツでも Card コンポーネントは囲んで表示できるということを確かめてください。中に何が表示されるかあらかじめ知っておく必要はありません。

なるほどね～。  

### props は時間とともに変化する

なるほどね～。  

> この例は、コンポーネントは時間経過とともに別の props を受け取る可能性があるということを示しています。props は常に固定だとは限らないのです！

確かに…！  

> ここでは time プロパティは毎秒変化していますし、color プロパティもあなたが別の色を選択するたびに変化します。props とはコンポーネントの最初の時点ではなく、任意の時点でのコンポーネントのデータを反映するものなのです。

人為的なものなのかそうでないものかにしろ、データは常に変化しているという状況の場合ってことらしい。  

> しかし、props はイミュータブル (immutable) です。

データ変わっているけど不変ということは…

> これは「不変な」という意味のコンピュータサイエンス用語です。コンポーネントの props が（例えばユーザ操作や新しいデータの到着に反応して）変わらないといけない場合、親のコンポーネントに別の props、つまり新しいオブジェクトを渡してもらう必要があります！ 古い props は忘れられ、使われていたメモリは JavaScript エンジンがそのうち回収します。

まあ新しいオブジェクトを常に生成しているということなのかな。  

### 演習

演習問題をやって完了!











