## チャレンジ問題にトライ

### チャレンジ 1/3: CSS クラスの追加・削除

```js
import { useState } from 'react'

const STATUS_NORMAL    = 'normal';
const STATUS_HIGHLIGHT = 'highlighting';

export default function Picture() {
  const [status, setStatus] = useState(STATUS_NORMAL);

  function handleClick() { 
    if (status === STATUS_NORMAL) {
        setStatus(STATUS_HIGHLIGHT);
    } else if (status === STATUS_HIGHLIGHT) {
        setStatus(STATUS_NORMAL);    
    }
  }
  
  return (
    <div className={"background " + (status === STATUS_NORMAL ? "background--active" : '')}>
      <img
        className={"picture " + (status === STATUS_HIGHLIGHT ? "picture--active" : '')}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={handleClick}
      />
    </div>
  );
}

```

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

あーこっちの方がだいぶすっきりしているね…。  
`Active`かどうかでっていう判断のほうがいいね。 
そして自分のコードは伝搬停止を入れていないのでちゃんと動いていないね…。  
(;-;)

もう一つの別解に`isActive`で返すJSXを分けるものがあった。  
これは正直メンテナンス性としては微妙だと思うので参考程度に…。  

### チャレンジ 2/3: プロフィールエディタ


```js
import { useState } from 'react'

const STATUS_EDIT = 'edit';
const STATUS_DISPLAY = 'display';

export default function EditProfile() {
  const [status, setStatus] = useState('edit');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  function handle() {
    
  }

  function changeState() {
    if (status === STATUS_EDIT) {
      setStatus(STATUS_DISPLAY);
    } else if (status === STATUS_DISPLAY) {
      setStatus(STATUS_EDIT);
    }
  }
  
  return (
    <form>
      <label>
        First name:{' '}
        {status === STATUS_DISPLAY && <b>{firstName}</b>}
        {status === STATUS_EDIT && (
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        )}
      </label>
      <label>
        Last name:{' '}
          {status === STATUS_DISPLAY && <b>{lastName}</b>}
          {status === STATUS_EDIT && (
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          )}
      </label>
      <button type="submit" onClick={
        (e) => { 
          e.preventDefault();
          changeState();
        }
      }>
        Edit Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

こんな感じで作成。  

いくつか指摘があったので修正

れびゅー

良く書けています！いくつか改善点を挙げます。

---

**① `isEditing` の方がシンプル**

```js
// 自分のコード
const [status, setStatus] = useState('edit');
const STATUS_EDIT = 'edit';
const STATUS_DISPLAY = 'display';

// 公式
const [isEditing, setIsEditing] = useState(false);
```

状態が2つしかないなら `boolean` の方がシンプルです。将来的に状態が増える可能性がある場合は文字列定数のアプローチも有効なので、設計意図次第です。

---

**② `handle()` が空のまま**

```js
function handle() {
  // 空！
}
```

使っていない関数は削除しましょう。

---

**③ `onSubmit` をフォームに書く**

```jsx
// 自分のコード — buttonのonClickで処理
<button onClick={(e) => { 
  e.preventDefault();
  changeState();
}}>

// 公式 — formのonSubmitで処理
<form onSubmit={e => {
  e.preventDefault();
  setIsEditing(!isEditing);
}}>
```

フォームの送信処理は `form` の `onSubmit` に書くのがHTMLの慣習に沿っており、Enterキーでの送信にも対応できます。

---

**④ ボタンのラベルが固定**

```jsx
// 自分のコード
<button>Edit Profile</button>

// 公式
<button>{isEditing ? 'Save' : 'Edit'} Profile</button>
```

編集中は「Save」、表示中は「Edit」と切り替えると、ユーザーに現在の状態が伝わりやすくなります。

---

**⑤ `Last name` のインデントがずれている**

```jsx
<label>
  Last name:{' '}
      {status === STATUS_DISPLAY && ...}  // ← インデント深すぎ
```

`First name` と揃えましょう。

---

**総評**

ロジックは正しく動作しており、`&&` を使った条件分岐や定数の定義など良い点も多いです。主な改善点は「不要なコードの削除」と「イベント処理の置き場所」です。


```js
import { useState } from 'react'

const STATUS_EDIT = 'edit';
const STATUS_DISPLAY = 'display';

export default function EditProfile() {
  const [status, setStatus] = useState('edit');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function changeState() {
    if (status === STATUS_EDIT) {
      setStatus(STATUS_DISPLAY);
    } else if (status === STATUS_DISPLAY) {
      setStatus(STATUS_EDIT);
    }
  }
  
  return (
    <form onSubmit={
      (e) => { 
        e.preventDefault();
        changeState();
      }
    }>
      <label>
        First name:{' '}
        {status === STATUS_DISPLAY && <b>{firstName}</b>}
        {status === STATUS_EDIT && (
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        )}
      </label>
      <label>
        Last name:{' '}
        {status === STATUS_DISPLAY && <b>{lastName}</b>}
        {status === STATUS_EDIT && (
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        )}
      </label>
      <button type="submit">
        {status === STATUS_EDIT ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}

```

### チャレンジ 3/3: React を使わない命令型コードのリファクタリング

スキップ
