## state 内の配列の更新

https://ja.react.dev/learn/updating-arrays-in-state

> JavaScript の配列はミュータブル（mutable, 書き換え可能）なものですが、state に格納する場合はイミュータブル（immutable, 書き換え不能）として扱うべきです。
> オブジェクトの時と同様に、state に保存された配列を更新する場合は、新しい配列を作成して（または既存の配列をコピーして）、その新しい配列で state をセットする必要があります。

まあそうだよね。  

### このページで学ぶこと
- React の state 内にある配列に対し要素の追加、削除、変更を行う方法
- 配列内にあるオブジェクトを更新する方法
- Immer を使って配列コピーのためのコードの冗長さを緩和する方法

### 配列を書き換えずに更新する

> JavaScript において、配列とは単なるオブジェクトの一種です。オブジェクトのときと同様に、React の state 内にある配列は、読み取り専用として扱う必要があります。これは、arr[0] = 'bird' のような形で配列内の要素に再代入を行ってはならず、push() や pop() のような配列をミューテーション（mutation, 書き換え）するメソッドを使ってもいけないということです。

扱いはオブジェクトと同じだよね。  

> 代わりに、いつでも配列を更新したいときには、新しい配列を state セッタ関数に渡す必要があります。これを実現するために、state から取り出した元の配列から、filter() や map() といった書き換えを行わないメソッドを呼び出すことで、新しい配列を作成できます。そして、結果として得られた新しい配列を state にセットすることができます。

はい。  

> また、どちらの列のメソッドも使用できるようにしてくれる Immer を使う方法もあります。

ここでもImmerがでるのか。  

### 落とし穴

あー`slice`は`Go`で何回も見たので大丈夫だな。  
`splice`はまさに部分的に削除とか挿入だったような。  


### 配列に要素を追加

`push()`は書き換えなので避けよう！  

> 代わりに、既存の要素の末尾に新しい要素が加わった、新しい配列を作成します。これには複数の方法がありますが、もっとも簡単なのは ... という配列スプレッド構文を使用することです。

ここでもスプレッド構文が出てくると。  

> 配列スプレッド構文を使用すれば、元の ...artists の先頭に要素を追加することもできます：

こっちはオブジェクトと違って `key`参照ではなく`index`だから、前も後ろも関係ないね。  

### 配列から要素を削除

`filter`を使って削除しようということ。  
この例だと`artist.id`に一致して押されたボタンの要素については返さないで更新しているって感じだね。  

> ここで、artists.filter(a => a.id !== artist.id) というコードは「artist.id と異なる ID を持つ artists のみの配列を作成する」という意味です。

だね。  

> 言い換えると、各アーティストの “Delete” ボタンは、該当アーティストを配列からフィルタリングして取り除き、結果として得られる配列で再レンダーを要求します。filter は元の配列を書き換えないことに注意してください。

`map`とか`filter`のような関数型プログラミングを意識したメソッド（なんていうんだっけ）はOKでしょう。  
副作用を起こさないような設計思想のはず。  

### 配列の変換

> 配列の一部またはすべての要素を変更したい場合は、map() を使用して新しい配列を作成できます。

加工して新しい配列を作る感じだね。  

### 配列内の要素の置換

これも`map`を使えば満たせる。  

押したボタンの`index`に一致するカウンターを増やしているだけ。  

### 配列への挿入

`slice`と`...`を使おう。  

> 場合によっては、先頭でも終端でもない特定の位置に要素を挿入したいことがあります。これを行うには、... 配列スプレッド構文と slice() メソッドを組み合わせて使用できます。

### 配列へのその他の変更

> スプレッド構文や、map()、filter() などの書き換えを行わないメソッドを使っているだけでは不可能なこともあります。
> 例えば、配列を逆順にしたり、ソートしたりすることができません。JavaScript の reverse() や sort() メソッドは元の配列を書き換えるため、直接使うことはできません。

確かに。  

まあコピーしてからこねこねしてそれを返すで行ける気がする。  

> ただし、配列をコピーしても、その中の既存のアイテムを直接変更することはできません

はい。`cloneDeep`とか`clone`とかであれば・・・。  
shallow copyじゃなくてdeep copyをしようという話。  

> nextList と list は異なる 2 つの配列ですが、nextList[0] と list[0] は同じオブジェクトを指しています。そのため、nextList[0].seen を変更することで、list[0].seen も変更されます。これは state のミューテーションであり、避けるべきです！

はい…。  

### 配列内のオブジェクトを更新する

> オブジェクトは、実際には配列の「中に」あるわけではありません。コード中では「中に」あるように見えますが、配列内の各オブジェクトはそれぞれ独立した値であり、配列はそれらを「参照」しています。これが、list[0] のようなネストしたフィールドを変更する際に注意が必要な理由です。他の人のアートワークリストが、配列の同じ要素を指しているかもしれません！

これは大事。


```js
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );
```
ここの部分だね。  


```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```
で、ここでおかしくなると。    

> この例では、2 つの別々のアートワークリストが同じ初期 state を持っています。これらは独立していることになっているのですが、ミューテーションが起きているため state が誤って共有され、一方のリストでボックスをチェックするともう一方のリストに影響してしまっています。

まあこれはそうだね。 


この場合は、`map`をすればOK  

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

> 一般的には、作成したばかりのオブジェクト以外は書き換えてはいけません。

はい。  

### Immer を使って簡潔な更新ロジックを書く

ネストされた配列の話ですね。  
これらを更新する場合はどうするかっていうこと。  

> Immer を使用することで artwork.seen = nextSeen のような書き換えができるようになりました

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```
まあこういう書き方ができると。  

> これが可能なのは、Immer から渡される特別な draft オブジェクトを書き換えているのであり、元の state は書き換えていないためです。同様に、draft の内容に対して push() や pop() などのミューテーション型のメソッドを使用することもできます。

> 裏側では、Immer は常に、draft に対して行った書き換え操作に基づいて、次の state をゼロから構築します。これにより、state を書き換えてしまう心配をせず、イベントハンドラを非常に簡潔に保つことができます。

まあここが重要だね。  

### まとめ

- 配列を state に入れることができるが、それを直接変更してはいけない。
- 配列を変更せず、代わりに新しい版を作成し、state を更新する。
- [...arr, newItem] という配列スプレッド構文を使用して、新しい項目を持つ配列を作成できる。
- filter() や map() を使用して、フィルタリングされた、あるいは変換されたアイテムを含む新しい配列を作成できる。
- Immer を使ってコードを簡潔に保つことができる。

### チャレンジ問題にトライ

#### チャレンジ 1/4: ショッピングカートの商品を更新

```js
  function handleIncreaseClick(productId) {
    setProducts(products.map((product) => {
      if (product.id === productId) {
        return { 
          ...product, 
          count: product.count + 1
        }
      }
      return product
    }));
  }
```

こんな感じで用意すればOK  


答えもそんな感じですね。  
elseケースに書いているかそうでないかの差くらい。  

#### チャレンジ 2/4: ショッピングカートから商品を削除

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    setProducts(products
      .filter(product => product.count - 1 > 0)
      .map(product => {
        if (product.id === productId) {
          return {
            ...product,
            count: product.count - 1
          };
        } else {
          return product;
        }
      }));
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

`filter` + `map`を使って実装してみた。  
これでいいのかな。  


模範解答だと2段階でやってますね。  

```js
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
```

### チャレンジ 3/4: ミューテーションを行わないように修正


```js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;

const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos(
      [
        ...todos,
        {
          id: nextId++,
          title: title,
          done: false
        }
      ],
    );
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return {
          id: nextTodo.id,
          title: nextTodo.title,
          done: nextTodo.done
        };
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(todos.filter(todo => {
      return todo.id !== todoId
    }));
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}

```

### チャレンジ 4/4: Immer でミューテーションを修正

こんな感じか？？？

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t => t.id === nextTodo.id);
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t => t.id === todoId);
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}

```



