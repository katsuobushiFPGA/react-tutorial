## JSXでマークアップを記述する

https://ja.react.dev/learn/writing-markup-with-jsx

ReactではJSX使っていこう！

### JSX: JavaScript にマークアップを入れ込む

だよねって感じ。

> 長年にわたり、ウェブ開発者はコンテンツは HTML で書き、デザインは CSS で書き、ロジックは JavaScript で書き、そして大抵の場合はそれらを別ファイルにしていました。

> しかしウェブがよりインタラクティブなものになるにつれ、ロジックがコンテンツの中身をも決めるようになっていきました。JavaScript が HTML の領分も担当するようになったのです！ これが、React ではロジックとマークアップを同じ場所、すなわちコンポーネントに書く理由です。

なるほど…！  
とはいえ、まだ慣れない…。
ロジックとビューが混在しているので直感的にわかりにくい…。


> ボタンのレンダリングロジックとマークアップを同じ場所に書くことで、それらが毎回の編集時に同期されることが保証されます。逆に、ボタンのマークアップとサイドバーのマークアップといった互いに関係のない詳細は、互いに分離されるようになるため、それぞれをより安全に独立して更新できるようになります。

なるほど、ロジックとビューが密接になることで同期を保証しているってことなのか。

> 個々の React のコンポーネントは JavaScript の関数であり、React がブラウザに表示するためのマークアップを含めることができます。

なるほど？

> そのマークアップを表現するのに、React コンポーネントは JSX と呼ばれる拡張構文を使用します。JSX は HTML ととてもよく似ていますが、より構文が厳密であり、動的な情報を表示することができます。
> 理解するには、HTML マークアップを JSX マークアップへと変換してみるのが最もよいでしょう。

おー理解のためにHTML→JSXの変換の練習もしてみようかな。

### HTML を JSX に変換する

できた！のでコミットした。

```html
 <h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```
↓
```js
export default function Todo() {
  const items = [
    { id: 1, content: "Invent new traffic lights" },
    { id: 2, content: "Rehearse a movie scene" },
    { id: 3, content: "Improve the spectrum technology" }
  ];

  const listItems = items.map(item =>
    <li
      key={item.id}
    > {item.content}
    </li>
  );

  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      {listItems}
    </>
  )
}
```

というわけで答えとか解説を見ていく。

### JSXのルール

#### 1. 単一のルート要素を返す

これはチュートリアルでやりましたね。

ルート要素は1つだけってやつ。  
Vue2はそうだったよね。  
Vue3はそうじゃなくなったんだけど確か。  

<></> で囲めばよいということ。
→これReact側で省略できるようにすればよくないか？と思ったりもする。  
ちょっとＡＩに聞いてみるとReact19以降のServer Componentsとかだと緩和される方向に進化しているとのこと。  
このあたりは進めてみてまた調べてみよう。  

> この中身のないタグはフラグメント (Fragment) と呼ばれるものです。フラグメントを使えば、ブラウザの HTML ツリーに痕跡を残すことなく、複数の要素をまとめることができます。

あーフラグメントか!
Vue2だと`template` とかだったような気がする。
→違うかった。

Vue2で制御文の時に要素を出力しないときのテクニックだった。

```js

<template v-if="show">
 <h1>見出し</h1>
 <span>本文</span>
</template>

```
みたいなやつだった。

> JSX は HTML のように見えますが、裏ではプレーンな JavaScript オブジェクトに変換されます。関数から 2 つのオブジェクトを返したい場合、配列でラップしないといけませんよね。2 つの JSX タグを返したい場合に別のタグかフラグメントでラップしないといけないのも、同じ理由です。

なるほど、ルート要素が複数あると、JavaScriptオブジェクトにそもそも変換できないからダメってことなんだよね。  


#### 2. すべてのタグを閉じる

まあこれは原則HTMLもそうだよね。  
閉じタグがないと終了がわからないからってことかな。  
このあたりはJS内でHTML書くからの制約なのか、パーサーの話か。  

そういえば、ここの <li>の部分はlistにしてみたけど、固定値ならベタ書きでいいような気もする。  

#### 3. （ほぼ）すべてキャメルケースで！

> JSX は JavaScript に変換され、中に書かれた属性は JavaScript オブジェクトのキーになります。コンポーネント内では、これらの属性を変数に読み出したくなることがよくあります。しかし JavaScript の変数名には一定の制約があります。例えば、名前にハイフンを含めたり class のような予約語を使ったりすることはできません。

あーなるほどね。
JSXじゃJavaScriptに一旦変換されるから、JavaScriptの制約上、ハイフンとか`class`とかの予約語は使えないよってことなんだね。  
キャメルケースねってことね。  

### 落とし穴

> 歴史的理由により、aria-* と data-* 属性は HTML 属性と同じようにハイフン付きで書くことになっています。

落とし穴すぎるだろ…！  

### ヒント：JSX コンバータを使う

https://transform.tools/html-to-jsx

html-to-jsxのコンバータがあるとのこと↑

### 演習問題

上記でやった内容を含めて問題を解いて終了


