## React.dev コンポーネントの作成とネスト

https://ja.react.dev/learn

コンポーネントとか作成していく。

## はじめてのコンポーネント

https://ja.react.dev/learn/your-first-component

### コンポーネント：UIの構成部品

コンポーネントは素晴らしい！再利用できる！バンザイ！ってことかな。

この辺チュートリアルでやったけど見ていこう。

```react
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```
`App.js`内でexportで外部参照できるようにして、defaultでimportされたときにファイル内でどの関数がデフォルト(初期値)になるのかを設定している。
(であってる？)

### Step1: コンポーネントをエクスポートする

Step1に書いてあった。
メイン関数とするという方が正しいな。
exportはあってるね。外部参照できるようにするでよいでしょう。

### Step2: 関数を定義する

ReactコンポーネントはJS関数と同じだけど名前は大文字から始めること！
まあこれは抑えておかないといけないね。

### Step3: マークアップを加える

この構文は JSX と呼ばれるもので、これによりマークアップを JavaScript 内に埋め込めるようになります。
→あ～これね。
JS内でのマークアップって、PHPのファイルにHTMLに書いてあるような違和感を感じるんだけどどうなの。

```react
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```
でもよいし、複数行であれば、

```react
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

としてもよいということ。
複数行ある場合は () をつけないといけない。
まあまあこの辺はね。

### コンポーネントを使う

Profile.tsxというのを作って、中にProfileとGalleryの関数を入れてexportしてみた。

### コンポーネントのネストと整理方法

!!落とし穴!!

コンポーネントをネストするのは許されない…！
子コンポーネントが親コンポーネントの情報を必要とする場合は、propsを使えとのこと。
まあチュートリアルでやったところだね。

```react
function Child({count, onClick}) {
    return (
      <button onClick={{ handle }}>Click {count} times</button>  
    )
}

function Parent() {
    const [count, setCount] = useState(0);
    
    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div>
            <Child count={count} onClick={handleClick} />
        </div>
    )
}
```




