## state の保持とリセット

https://ja.react.dev/learn/preserving-and-resetting-state

### チャレンジ問題にトライ

#### チャレンジ 1/5: 入力テキストの消失を修正

```js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      { showHint && <p><i>Hint: Your favorite city?</i></p> }
      <Form />
      <button onClick={() => {
       setShowHint(!showHint);
      }}>{ (showHint ? "Hide": "Show") + " hint"}</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}

```

### チャレンジ 2/5: 2 つのフィールドを入れ替え 

```js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(firstName) {
    setFirstName(firstName);
  }

  function handleLastNameChange(lastName) {
    setLastName(lastName);
  }

  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  return (
    <>
      {reverse && 
        <>
          <Field label="Last name" value={lastName} onChange={ (e) => handleLastNameChange(e.target.value) } /> 
          <Field label="First name" value={firstName} onChange={ (e) => handleFirstNameChange(e.target.value)} />
        </>
      }
      {!reverse && 
        <>
          <Field label="First name" value={firstName} onChange={ (e) => handleFirstNameChange(e.target.value)} />
          <Field label="Last name" value={lastName} onChange={ (e) => handleLastNameChange(e.target.value) } /> 
        </>
      }
      {checkbox}
    </>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={value}
        placeholder={label}
        onChange={onChange}
      />
    </label>
  );
}

```

リフトアップで回答したけど模範解答は`key`を使った回答でしあ・・・。  

### チャレンジ 3/5: 詳細フォームをリセット

リフトアップすることを考えたけどそうじゃなくてわからなかった。  

key={selectedId}を入れるという発想で良かったみたい。  

うーん。この辺わかってないな。  

### チャレンジ 4/5: 読み込み中に画像をクリア

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={index} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];

```
これはまさに`key`を入れればよい問題のはず。  

あー

> “Next” ボタンを押すとブラウザが次の画像を読み込み始めます。ただし、同一の <img> タグを使って画像を表示しているため、このままでは次の画像が読み込まれるまで前の画像が表示されたままになります。テキストが常に画像と一致することが重要である場合、これは望ましくないかもしれません。“Next” を押した瞬間に前の画像がクリアされるように変更してください。

ってことで、`img.src`を`key`とするのが正解ですね…。  
自分の場合は`index`にしてしまっているので毎回再生成されてしまうわけですね。  


### チャレンジ 5/5: リスト内の state 位置ズレを修正

```js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];

```
これでよしか？  

```js
<li key={i}>
↓
<li key={contact.id}>
```
に変えた感じ。  

まあこれでよさそう。  


