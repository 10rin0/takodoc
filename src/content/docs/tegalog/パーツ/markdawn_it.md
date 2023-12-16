---
title: てがろぐをマークダウンに変換する
---
## 概要
- Javascriptで、てがろぐで書いた文章をマークダウンに変換します
- マークダウンに変換する　[markdown-it](https://markdown-it.github.io/) - [MIT License](https://github.com/markdown-it/markdown-it/blob/master/LICENSE)
- コードをハイライトする　[highlight.js](https://highlightjs.org/) - [BSD 3-Clause License](https://github.com/highlightjs/highlight.js/blob/main/LICENSE)
- 許諾・報告不要です。ご自由にコピペしてご利用ください。
- 非公式のため、使用にあたり自己責任でお願いいたします。

:::caution
注意事項

リンクのためにURLを書いたり、ソースの中でURLを書いた場合、
そのままだと自動リンクに変換されるため、
`https\://www.example.com`のように書く必要があります。[^1]

また、マークダウンで変換した後はてがろぐの独自記法用の装飾とは別に、マークダウン用の装飾をCSS側で設定してあげてください。
:::

## 使い方
まず、使用するにあたり、マークダウンに変換したい範囲を指定します。
てがろぐ本文すべてと、一部を変換するかで方法が異なります。

### 1-1.本文すべてをマークダウンにしたい場合　
（一部てがろぐの装飾記法が使えなくなります）

てがろぐ本文`（[[COMMENT]]）`を`<div class="comment">[[COMMENT]]</div>`このように囲んでください。
クラス名はお好きな内容で問題ありませんが、この後記述するスクリプト内で適切に書き換えてください。

### 1-2.本文の一部をマークダウンにしたい場合
自由装飾記法[^2]で指定します。

投稿本文の指定したい部分を、決まった名前（ここでは「md」と指定します）で指定してください。


### 2. 外側スキンに追記
下記のコードをコピペして、外側スキンの`<body>`内に追記します。

```html {14}
<!-- skin-cover.html -->
<!-- markdown-itのCDNを読み込む -->
<!-- MIT License  https://github.com/markdown-it/markdown-it/blob/master/LICENSE -->
<script src="https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js"></script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        // markdown-itのインスタンスを作成
        var md = window.markdownit();

        // 内側スキンの段階でてがろぐ本文を<div class="comment">で囲んでおく
        //自由装飾にしたい場合は「.deco-md」の形式
        // .commentクラスを持つすべての要素に対して処理
        var inputElements = document.querySelectorAll('.comment');
        inputElements.forEach(function (inputElement) {
            // 変換対象の文字列を取得
            var input = inputElement.innerHTML; // innerHTMLを使用してHTMLの改行（<br>）を保持

            // エスケープ文字を戻す変換
            input = input.replace(/<br>/g, '\n');
            input = input.replace(/&amp;/g, '&')
            input = input.replace(/&quot;/g, '"')
            input = input.replace(/&apos;/g, "'")
            input = input.replace(/&lt;/g, '<')
            input = input.replace(/&gt;/g, '>');
            input = input.replace(/&nbsp;/g, ' '); //タブを空白に（\tだと不都合な人向け）

            // マークダウンに変換
            var outputHTML = md.render(input);

            // 元の内容を非表示にする
            inputElement.style.display = 'none';

            // 変換結果を表示する要素を作成
            var outputHTMLElement = document.createElement('div');
            outputHTMLElement.className = 'outputHTML';
            outputHTMLElement.innerHTML = outputHTML;

            // 変換結果を挿入する
            inputElement.parentNode.insertBefore(outputHTMLElement, inputElement.nextSibling);
        });
    });
</script>
```

ハイライトしている`var inputElements = document.querySelectorAll('.comment');`で、
`<div class="comment">`にした人はそのまま、
自由装飾記法「md」で指定した人は`var inputElements = document.querySelectorAll('.deco-md');`と変更します。

マークダウンだけ使いたい人はこれで完成です。

### highlight.jsを使う人向け
ブロックコードなどをいい感じにハイライトしてくれるライブラリがあります。
今回はhighlight.jsを合わせて設定します。
外側スキンの先ほどの内容の下に、下記のコードをコピペしてください。
```html
<!-- skin-cover.html -->
<!-- highlight.jsのCDNを読み込む -->
<!-- BSD 3-Clause License https://github.com/highlightjs/highlight.js/blob/main/LICENSE -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<!-- 言語の選択 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        hljs.highlightAll();

        // インラインコードに対してハイライト
        document.querySelectorAll('code').forEach(function (code) {
            hljs.highlightBlock(code);
        });
    });
</script>
```
あわせて`<head>`タグ内でスタイルシートを読み込んでください。
```html "monokai"
<!-- skin-cover.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css">
```
highlight.jsの[公式サイト](https://highlightjs.org/examples)で、好きなデザインを選べます。
「Theme」で選んだ名前を確認して、「～styles/***名前***.min.css」部分を書き換えてください。
例ではmonokaiを選んでいます。

## 備考
マークダウンの記法自体は注意事項に上げたもの以外はmarkdown-itに準じます。
今回使用したサイトの[デモページ]((https://markdown-it.github.io/))が参考になります。
オプションのカスタマイズもできるので、できそうな方はやってみてください！
[（GitHubのページ）](https://github.com/markdown-it/markdown-it)

マークダウンでのテーブルジェネレーターもあります。
[Markdown表テーブル作成ツール](https://notepm.jp/markdown-table-tool)

---

## 注釈
[^1]:公式マニュアル[自動でリンクにはならないURLを一時的に書きたい場合の書き方](https://www.nishishi.com/cgi/tegalog/faq/#temp-unlinked-url)

[^2]:公式マニュアル[class名を自由に指定できる装飾記法](https://www.nishishi.com/cgi/tegalog/usage/#howtouse-chardecoration-class)