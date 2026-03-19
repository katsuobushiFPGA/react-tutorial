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


