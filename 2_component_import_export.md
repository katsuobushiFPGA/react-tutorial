## コンポーネントのインポートとエクスポート

https://ja.react.dev/learn/your-first-compoddnent

### ルートコンポーネントファイル

前の章でProfile, Galleryコンポーネントを作ったよねという話。

### コンポーネントのエクスポートとインポート

別のコンポーネントとかファイルからコンポーネントを呼び出す方法について書いてある。
というわけでやってみる。

といってもちょっと気になってやってみたのがあるのでもうすでにコミット済みだったりするのだが。

Gallery, Profileではなく、
TextBoxとかにしておくか。

TextBox.tsxを作成して、App.tsxでそれをimportするということをやってみよう。


```js:TextBox.tsx
export default function TextBox() {
  return (
    <input type="text"></input>
  )
}
```

```diff:App.tsx
+import TextBox from './TextBox'


export default function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <List />
      {content}
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
      <Gallery />
+     <TextBox />
    </div>
  )
}

```
こんな感じに作ってみた。
まあ動くと…。


### デフォルトエクスポート vs 名前付きエクスポート


デフォルトエクスポート,名前付きエクスポートについてのこと。


例えば、

```js
export default function Foo() ...
export default function Bar() ...

↑これはできない。defaultは一つのファイルにひとつだけ

export default function Foo()
export function Bar()

↑ これはOK、export宣言はいくらでもできる、defaultは1つだけ。
```


```js

importについて...

Hoge.js↓

export default function Foo()
export function Bar()

こういう宣言に対して、
import Banana from './Hoge.js'という風にすると、defaultのFoo()がBananaという名前で使えるようになるとのこと。

Fuga.js↓

export function Foo()

こういう宣言に対しては以下のように名前を合わせる必要がある。
import { Foo } from './Fuga.js'
```

### 同じファイルから複数のコンポーネントをエクスポート・インポートする

さっきの、Profile, Galleryコンポーネントについて、GalleryコンポーネントではProfileコンポーネントを何回も呼び出している。  
ただ、場合によっては1回だけ呼び出したいこともある。  
なのでProfileだけ使いたい！というケースのようだ。  

その場合は、


```js
export function Profile() {
  // ...
}
```
として、
名前付きインポートをすればよいとのこと。  

演習問題をやって完了…！




