## state 内のオブジェクトの更新

https://ja.react.dev/learn/updating-objects-in-state

> state にはどのような JavaScript の値でも保持することができます。これにはオブジェクトも含まれます。
> しかし、React の state に保持されたオブジェクトを直接書き換えるべきではありません。
> オブジェクトを更新したい場合、代わりに新しいオブジェクトを作成（または既存のもののコピーを作成）し、それを使って state をセットする必要があります。

なるほど。配列も同じなのかな。  

### このページで学ぶこと

- React の state 内のオブジェクトを正しく更新する方法
- ミューテートせずにネストされたオブジェクトを更新する方法
- イミュータビリティとは何で、どのようにして遵守するのか
- Immer を使ってオブジェクトコピーのためのコードの冗長さを緩和する方法

### ミューテーションとは？


```js
const [x, setX] = useState(0);
setX(5);
```
 
0という数字そのものが5になったというわけではないということ。  

オブジェクトの場合  

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

> 技術的には、オブジェクト自体の内容を書き換えることが可能です。これをミューテーション (mutation) と呼びます。

確かに

```js
position.x = 5;
```
とすればよいと。  

ただ、以下の理由でこういう直接な書き換えはよろしくないということ。  
> しかし、React の state 内にあるオブジェクトは技術的にはミュータブル（mutable, 書き換え可能）であるとしても、数値、真偽値、文字列と同様に、イミュータブルなものであるかのように扱うべきです。書き換えるのではなく、常に置き換えるべきです。

### state を読み取り専用として扱う

> 言い換えると、state として格納するすべての JavaScript オブジェクトは読み取り専用として扱う必要があります。

なるほど。  

例のコードに問題があると。

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

> このコードは、直近のレンダーで position に割り当てられたオブジェクトを書き換え、つまりミューテートしています。しかし、state セット関数が使用されないと、React はそのオブジェクトが変更されたことを認識できません。

確かにそうだ。  
`useState`関数での書き換えを行わないと反応しないよねという話。  

> これは料理をすでに食べた後で注文を変更しようとするようなものです。

クレーマーですね。  

> state のミューテートは一部のケースでは機能することがありますが、おすすめしません。レンダー内でアクセスできる state 値は、読み取り専用として扱うべきです。

なるほど。  
機能するケースもあるんだ！  

> この場合、実際に再レンダーをトリガするためには、新しいオブジェクトを作成し、それを state セット関数に渡す必要があります。


```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

set関数を通して新しいオブジェクトを渡していると。  

> setPosition を使うことで、React に次のことを伝えます。
>
> - position をこの新しいオブジェクトに置き換えよ
> - そしてもう一度このコンポーネントをレンダーせよ

ですね。これはさっきやったところだ。  

### ローカルミューテーションは問題なし

> 以下のようなコードは、state の既存のオブジェクトを変更しているため、問題があります。

```js
position.x = e.clientX;
position.y = e.clientY;
```

これはさっきの例の奴だ。  

> しかし、以下のようなコードは全く問題ありません。なぜなら、作成したばかりの新しいオブジェクトを書き換えているからです。

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

あーなるほど。ローカルで作ったやつを書き換えているだけですね。


> 実際、これは以下のように書くことと全く同等です。

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```
確かに。  

> state として存在する既存のオブジェクトを変更する場合にのみ、ミューテーションは問題になります。
> 作成したばかりのオブジェクトであれば他のコードはまだそれを参照していないので、書き換えても問題ありません。
> それを書き換えてもそれに依存する何かに誤って影響を与えることはありません。これを “ローカルミューテーション (local mutation)” と呼びます。

はい。なるほど。まあそうだ。  

> レンダー中にもローカルミューテーションを行うことができます。とても便利で、全く問題ありません！

いいね。  

### スプレッド構文を使ったオブジェクトのコピー

> 前の例では、position オブジェクトは現在のカーソル位置から常に新規作成されます。しかし、多くの場合、新しく作成するオブジェクトに既存のデータも含めたいことがあります。

それはそう。  
一部のformで変更された値だけ適用したいのにform全てのオブジェクトを一から書くのは大変です…。  

> 例えば、フォームの 1 つのフィールドだけを更新し、他のすべてのフィールドについては以前の値を保持したい、ということがあります。

うんうん。  

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

この例は`onChange`で`state`の変数であるオブジェクトを書き換えていますが、  
setXXX関数を使っていないのと、新しいオブジェクトをセットしていないのでだめですね。  

> 例えば、以下の行は過去のレンダーからの state を書き換えてしまっています。

```js
person.firstName = e.target.value;
```

ですね。  

> 望んだ動作を得る確実な方法は、新しいオブジェクトを作成して setPerson に渡すことです。しかし、ここではフィールドのうちの 1 つだけが変更されているため、既存のデータもコピーしたいでしょう。

これはその通り。  


```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

スプレッド構文が便利だよという話。  


今度はスプレッド構文とsetXXX関数での更新をしましょうと。  

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

これで期待通りの動きになっているね。  

> ... スプレッド構文は「浅い (shallow)」ことに注意してください。これは 1 レベルの深さでのみコピーを行います。これは高速ですが、ネストされたプロパティを更新したい場合は、スプレッド構文を複数回使用する必要があるということでもあります。

あーこれは自分も知らなかった。  
オブジェクトがネストされている場合はスプレッド1回じゃ足りないわけですね。  

### 複数のフィールドに単一のイベントハンドラを使う

> オブジェクト定義内で [ と ] 括弧を使って、動的な名前のプロパティを指定することもできます。以下は上記と同じ例ですが、3 つの異なるイベントハンドラの代わりに 1 つのイベントハンドラを使用しています。


```js
  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }
```
あーこういうやつね。  

要は変更のあった属性名と同じフィールドを更新できるようにしているってことね。  
これは項目数多いフォームの共通化とかで便利だな。  

### ネストされたオブジェクトの更新

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

こういうのがあると。  

> person.artwork.city を更新したい場合、ミューテーションで変更する方法は明らかです。

```js
person.artwork.city = 'New Delhi';
```

ドット演算子でアクセスして変更するだけですね。  


> しかし、React では state をイミュータブルなものとして扱います！ city を更新するためには、まず（既存のデータも含まれた）新しい artwork オブジェクトを生成する必要があります。そして、新しい artwork を含む新しい person オブジェクトを生成します。

うむ。  

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

なるほど。ネストされた(2階層目の)オブジェクトを用意して、1階層目のオブジェクトにはめるって形になると。  


> あるいは、単一の関数呼び出しとして記述する場合は以下のようになります。

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

まあこちらでもよいか。  

### オブジェクトは実際にはネストされない

> このようなオブジェクトはコード内で「ネストされている」ように見えるでしょう

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

はい。  
ネストしてますよね…？  

> しかし、オブジェクトの振る舞いを考える場合、「ネスト」という考え方は正確ではありません。コードが実行されてしまえば「ネストされた」オブジェクトというものは存在しません。実際には、2 つの異なるオブジェクトを見ているだけです：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

あーなるほど。  

> obj1 オブジェクトは obj2 の「内部」にあるのではありません。例えば、obj3 も obj1 を「参照する」ことができます：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

まあ確かに…か？  

> obj3.artwork.city を変更すると、obj2.artwork.city と obj1.city の両方に影響を与えます。これは、obj3.artwork、obj2.artwork、および obj1 が同一のオブジェクトであるためです。これは、オブジェクトが「ネストされている」と考えると理解しにくくなります。そうではなく、これらはあくまで別々のオブジェクトであり、プロパティで互いを「参照している」のです。

あー参照されているっていうことね。  
まあこれはそうだね。オブジェクト生成段階でそのアドレスの位置は決まっていて。  
その参照だけ返されている状態のはず。  

### Immer で簡潔な更新ロジックを書く

> もし state が深くネストされている場合、フラットにすることを検討するべきかもしれません。
> しかし、state の構造を変更したくない場合は、スプレッド構文をネストして使うより短いやり方が欲しくなるかもしれません。

そうだ！そうだ!  

> 人気ライブラリである Immer は、使いやすいミューテート型の構文を使って書きつつ、コピーを自動的に作成してくれるというものです。
> Immer を使うと、あなたのコードは一見オブジェクトをミューテートして「ルール違反」をしているかのように見えます。  

なるほど？  

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

これは違反でしかないだろ。  

> しかし、通常のミューテーションとは異なり、過去の state は上書きされません！

そういうライブラリってことね。  

### Immer はどのように動作するのか？

> Immer から渡される draft は、プロキシ (Proxy)と呼ばれる特殊なタイプのオブジェクトで、それに対して何を行ったのかを「記録」します。
なるほど。  

> これが好きなだけミューテートができる理由です！ 内部では、Immer は draft のどの部分が変更されたかを把握し、あなたの編集内容を反映した完全に新しいオブジェクトを生成します。

はいはい。そういうことか。  
下書きを何回でもできるみたいな感じ。  
`draft`だしね。

`immer`は確かに見た感じ便利そうだ。  

### React ではなぜ state の変更が非推奨なのか？

> デバッグ：console.log を使用しているなら、state を書き換えないことにより、古いログの内容が後に起きた state 変更によって上書きされる心配をしなくて済むようになります。つまり、レンダー間で state がどのように変化したかはっきり見ることができるようになります。

確かに。この点はそうだよね。  
過去の値をログとして見れなくなると困るね。  

> 最適化：React の一般的な最適化戦略は、前の props や state が次のものと同一である場合作業をスキップする、ということに依存しています。state を書き換えないことで、変更があったかどうかを非常に素早くチェックすることができます。prevObj === obj であれば、内部で何も変更されていないと自信を持って言えるようになります。

キャッシュ的な部分か。  
同じであれば即座に返せる部分はそうできると。  

> 新機能：開発中の新しい React の機能は、state がスナップショットのように扱われることを前提としています。過去の state の書き換えを行うと、新しい機能を使用できなくなる可能性があります。

互換的な部分か。  

> 仕様変更のしやすさ：一部のアプリケーション機能（取り消し/やり直し、履歴の表示、フォームを以前の値にリセットするなど）は、ミューテーションが起きないのであれば実装が容易です。これはメモリ内に過去の state のコピーを保持しておけば、必要に応じて再利用できるからです。ミューテーションを行うアプローチで始めてしまうと、このような機能を後で追加するのが困難になることがあります。

それはそうだね。  

> 実装のシンプルさ：React はミューテーションの仕組みに依存しないため、オブジェクトに特別なことを一切しなくてすみます。他の多くの「リアクティブ」系ソリューションは、オブジェクトのプロパティを乗っ取ったり、プロキシにラップしたり、初期化時にその他もろもろの作業を行ったりしていますが、React ではその必要がありません。これが、React がどんな大きさのオブジェクトでも、パフォーマンスや正確性の問題を心配せずに state に入れることができる理由でもあります。

確かに。  
stateに関しては、こいつは変更される変数だぞっていう識別子的な感じだよね。  
んで、それらの変数はReactのルールの中で更新とかの制約が設けられる感じ。  


> 実際には、React の state をミューテートしても「やり過ごせる」場合も多いのですが、そうしないことを強くお勧めします。

そうなんだ！  

### まとめ
- React のすべての state はイミュータブルとして扱う。
- state にオブジェクトを格納する場合、それらをミューテートしてもレンダーがトリガされない。それは過去のレンダー内の state の「スナップショット」を書き換えているだけである。
- オブジェクトを書き換えるのではなく、代わりに新たなバージョンのオブジェクトを作成して、その新しいバージョンを新しい値として state をセットすることで再レンダーをトリガする。
- {...obj, something: 'newValue'} というオブジェクトスプレッド構文を使ってオブジェクトのコピーを作成できる。
- スプレッド構文は「浅い」、つまり 1 レベルのみのコピーを行う。
- ネストされたオブジェクトを更新するには、更新している場所から一番上までの全オブジェクトのコピーを作成する必要がある。
- コピーのためのコードが冗長になったら Immer を使う。

よし。  

### チャレンジ問題にトライ

#### チャレンジ 1/3: 間違った state 更新を修正


```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```
たぶんこれでいいはず。  


```js
  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }
```

```js
  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }
```
この辺を直した。

**バグについての説明**

- スコアを増やすボタンを何度かクリックしてみてください。スコアが増えないことに気付くと思います。

これは、ミューテーションでの更新をしているからですね。  
`player.score++`だと過去のstateの値を更新しており、再レンダリングが発生しないので反映されません。  
なので、`setPerson`関数を用いて更新する必要があります。  

- 次に、ファーストネーム欄に入力をしようとすると、思い出したかのようにスコアが最新の値に更新されることを確認してください。

これは`player.score++`で更新がつまれた値が`setXXX`の関数で再レンダリングされたので反映されたとなります。  

- 最後に、ラストネームを入力してみてください。今度はスコアが完全に消えてしまいます。

はい、これは`setPerson`関数で更新しておりますが、前の値を保持せずに`lastName`だけ更新しているので`score`の値がnullとなります。 
`firstName`の値が消えていないように見えますが、メモリ上は消えているはずです。  
~~ただ、ここの更新が入っておらずJSX内のDOMツリーが部分的に更新されないからという理由なんじゃないかなと思います。~~~
→全然違かった。  

inputのvalueにundefinedが渡ると、Reactはその入力欄を非制御コンポーネントとして扱い、DOMの値をそのまま残すという挙動をするかららしい。  
なので、表示上は残っているらしい。  

### チャレンジ 2/3: ミューテーションを探して修正


```js
  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }
```

ミューテーションで更新されていた部分をsetXXXの更新用関数に変更した。  

### チャレンジ 3/3: Immer を使ってオブジェクトを更新


```js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```
こんな感じ。  








