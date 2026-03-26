### チャレンジ問題にトライ

#### チャレンジ 1/4: 更新されないコンポーネントの修正

```js
import { useState } from 'react';

export default function Clock(props) {
  const color = props.color;
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

`props`で受け取ったものを`useState`を使わないってことだ。  
と思ったけど、別に`props.color`をそのまま使えばよかった。  

### チャレンジ 2/4: 壊れた荷物リストの修正


```js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const total = items.length;
  const packed = items.filter((item) => {
      return item.packed;
  }).length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} out of {total} packed!</b>
    </>
  );
}

```

これでOKかな。  

### チャレンジ 3/4: 選択項目が消える問題を修正


```js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetterId, setHighlightedLetterId] = useState(null);

  function handleHover(letter) {
    setHighlightedLetterId(letter.id);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedLetterId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

> 問題は、highlightedLetter に手紙オブジェクトを保持していることです。しかし同じ情報を letters 配列にも保持しています。つまり state に重複があるのです！

ですよね。  


### チャレンジ 4/4: 複数選択を実装

```js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedCount = selectedIds.length;

  function handleToggle(e, toggledId) {
    if (e.target.checked) {
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    } else {
      console.log(selectedIds.filter( id => id !== toggledId ));
      setSelectedIds(selectedIds.filter( id => id !== toggledId ));
    }
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={ (e) => handleToggle(e, letter.id)}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}

```
こんな感じで修正してみた。  
`selectedIds`として配列にしてみた。  





