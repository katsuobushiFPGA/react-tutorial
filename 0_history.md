# React.devの学習

## 学習について
https://react.dev のクイックスタート～構築～学ぶ部分を学習する。

### 学習方針

プロジェクトはAIを基本的に使わずに、全て手で書くことを行うこととする。
これは、学習の定着を元としたものでAIの開発を否定するものではない。

## 実行したコマンドについて

https://ja.react.dev/learn/build-a-react-app-from-scratch

### ステップ1: ビルドツールのインストール

まずは、ビルドツールのインストールを行う。

```bash
npm create vite@latest my-app -- --template react-ts
```

npm create → Node.jsのパッケージを作成するためのコマンドである。
見た感じ、React+typescriptがインストールされるようだ。

### ステップ2: 一般的なアプリケーションパターンの構築

読んだ感じシンプルなSPAのプロジェクトができたみたい。  
ここに書いてある通り、スクラッチで試すならこれでいいけど、この後拡張をしていくのであればフレームワークを使ってくださいとのことらしい。  

#### ルーティング

React Router
Tanstack Router 
ってのがあるらしい。

VueだとVue Routerてきなやつか・・・？


#### データフェッチ

> サーバやその他のデータソースからデータを取得することは、ほとんどのアプリケーションにおいて重要な作業です。
> これを適切に行うには、ローディング状態の管理、エラー状態の管理、および取得したデータのキャッシュ管理が必要であり、複雑になりがちです。

なるほど…？  
Vueだとこういうのあったっけ…？

> コンポーネント内で直接データを取得すると、ネットワークリクエストのウォーターフォールに伴う遅延が発生し、読み込み時間が遅くなる可能性があることに注意してください。可能な限り、ルータローダやサーバで、データを事前フェッチすることをお勧めします！

VueだとcomponentからAPI呼び出すコンポーネントとか共通モジュールを呼び出してAPIコールしていたような…？  


#### コード分割
webpackとかviteでやってるバンドルのことっぽい。
JSにトランスパイルするときにいい感じに分割してくれるってこと…？


#### アプリケーションパフォーマンスの向上

> あなたのレンダー戦略を、ルータと統合する必要があります。それによりあなたのフレームワークで構築されたアプリが、ルートごとにレンダー戦略を選択できるようにするのです

なるほど…？
つまり、SPA, SSR, SSG, RSCの4種類のレンダリング方式を異なるルートで適用できるということかな。  
/ssg であればSSG
/spaであれば SPA　てきな？

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




