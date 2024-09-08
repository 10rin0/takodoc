---
title: カスタム絵文字ピッカー(その1)
---
## 概要
- てがろぐ Ver 4.0.5.から実装されている、カスタム絵文字リストをスキンへ持ってくるスプリクト
- jQuery使用
- AI生成物を加筆修正したもの（検証：Windows/vivaldi、iOS/safari）
- 使用は自己責任でお願いいたします

:::tip[参考（2024/09/08追記）]
10pressのえむおか様が、改変版のコードを作成・公開されています！
こちらも是非！  
**[てがろぐのカスタム絵文字が面白い](https://10prs.com/view/68)**

:::

## 詳細
iOS/safariでは、カスタム絵文字をダブルクリックでコピーする機能を使うと画面が拡大されてしまうため、作りました。
今後の本実装での仕様変更で使えなくなったり、実装予定の絵文字リストの追加によって無用のものになったりする可能性がありますので、いったんテスト的にこっそり公開します。

使用感をいただけると助かります。教えて頂かなくても、改変・自作されたものを公開していただけるとすごく嬉しいです……。

管理画面のカスタム絵文字のページ（`tegalog.cgi?mode=admin&work=cemoji`）にある、
リストと機能（Javascriptでクリックするとコピーするようになっています）をjQueryで取得し、
スキン側の任意の箇所に持ってくるスプリクトです。

クイック投稿フォームの近くに持ってくることを想定しています。

CSSで装飾できるので、ご自身のスキンに合わせて、ご自由に改変することが可能です。


## 使用方法
### skin-cover.htmlへ追加する記述
好きなところに下記を追加する。
```html "cepicker"
<!-- skin-cover.html -->
<div class="cepicker Login-Required"></div>
```
クイック投稿フォームの近くがおすすめです。

`cepicker`＝`custom emoji picker`
このクラス名は自由に変更して大丈夫ですが、以降のスプリクト部分でクラス名の部分を適切に置き換えてください。

管理画面の情報を取得するので、ログインしないとリストが表示できません。
`Login-Required`（ログイン時のみ表示するクラス）は必ず加えてください。

BODYタグ内に下記を追記
```html
<!-- skin-cover.html -->
<script>
   $(document).ready(function () {
      // ?mode=admin&work=cemoji(絵文字ページ)から情報を取得
      $.get("?mode=admin&work=cemoji", function (data) {
         var CElist = $(data).find("#CemojiList").html();
         var scriptContent = $(data).find("script").html();

         // Scriptタグは実行するために追加
         var scriptElement = document.createElement("script");
         scriptElement.innerHTML = scriptContent;

         // cepicker以外のクラス名を指定した場合はここを書き換える(1)
         $(".cepicker").html(`
         <div id="CemojiList">${CElist}</div>
      `);

         // cepicker以外のクラス名を指定した場合はここを書き換える(2)
         $(".cepicker").append(scriptElement);
      });
   });   
</script>
```
### CSSに追記
CSSに追記する例（見た目の設定）
```css
/*全体の調整*/
.cepicker {
   margin: 10px auto;
   padding: 5px 0;
   width: calc(100% - 10px);
   max-width: 900px;
   max-height: 300px;
   overflow-y: auto;
   background-color: #dedede;
}

/*絵文字リスト全体を横並びにする*/
.cepicker #CemojiList {
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   gap: 6px 3px;
}

/*絵文字、名前、コピーボタンを縦並びに*/
.cepicker .oneCemoji {
   display: inline-grid;
   justify-items: center;
   padding: 2px;
   background-color: #f0f0f0;
}

/*絵文字名は隠す*/
.cepicker .cename {
   display: none;
}

/*コピーボタンを小さめにする*/
.cepicker .cectrl button {
   font-size: 0.7em;
}

/*絵文字の高さを指定する（記事の絵文字とは別）*/
.cepicker .oneCemoji img {
   height: 1.5em;
}
```

CSSは例のため、お好きに変更できます。
ブラウザのデベロッパーモードなどでクラス名等を確認しながら装飾してみてください。

なお、ご利用の端末や、追加したい絵文字によっては、絵文字ごとor全体にCSSの追加設定が必要になります。
SVG画像を使用していて表示が崩れる場合は、公式マニュアル（[▼iPhone等のiOS端末でSVG絵文字が縦に並んでしまう場合の対処方法](https://www.nishishi.com/cgi/tegalog/custom/#customemoji-ios)）を参考にCSSを追記してください。


●このスプリクトは、てがろぐのアップデートにかかわらず、不定期に更新・変更、削除する可能性があります。●