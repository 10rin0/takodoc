---
title: 絵文字と画像管理画面をiframeで追加する
---
## 概要
- てがろぐ管理画面の新規投稿・編集画面に、カスタム絵文字の管理画面と画像の管理画面を表示
- edit.css、edit.jsを読み込み（てがろぐの機能）
- iframeで実装
- 使用は自己責任でお願いいたします。


## ライセンス
CC0

著作権表記や許諾などは一切不要です。どなたでもご自由にご利用ください。

改変したり、これから配布するスキンに組み込んだりすることも可能です。
ご利用にあたり、たこつぼくらぶは一切の責任を負わないものとします。

## 使い方
まず、てがろぐの管理画面からedit.css、edit.jsを有効にします。
:::tip[設定方法]
公式マニュアル：[新規投稿/編集画面に自由なCSSやJavaScriptを加える方法 【高度な設定】](https://www.nishishi.com/cgi/tegalog/custom/#ctrl-posteditpage)

マニュアルの通りに、
管理画面の
[設定]→[システム設定]→【機能制限／自動調整／高度な設定】→[高度な設定]→『編集画面で、edit.cssとedit.jsを(あれば)読み込む』
にチェックを入れてください。
:::

続いて、空のファイルedit.cssとedit.jsを作成し、それぞれCSSとJavascriptをコピペして保存してください。

```javascript
// edit.js
// ページが読み込まれたときに行われる
window.onload = function () {
    Takoceimgpanel();
};

function Takoceimgpanel() {
    // 新しい checkbox 要素を作成
    var TakoCEbtn = document.createElement("input");
    TakoCEbtn.type = "checkbox";
    TakoCEbtn.id = "tako_emoji";

    var TakoIMGbtn = document.createElement("input");
    TakoIMGbtn.type = "checkbox";
    TakoIMGbtn.id = "tako_img";

    // 新しい label 要素を作成
    var TakoCElabel = document.createElement("label");
    TakoCElabel.htmlFor = "tako_emoji";
    TakoCElabel.appendChild(document.createTextNode("絵文字")); // ラベルに表示される文字

    var TakoIMGlabel = document.createElement("label");
    TakoIMGlabel.htmlFor = "tako_img";
    TakoIMGlabel.appendChild(document.createTextNode("画像")); // ラベルに表示される文字

    // body 要素に新しい checkbox 要素を追加
    document.body.appendChild(TakoCEbtn);
    document.body.appendChild(TakoIMGbtn);

    // label をまとめる div を作成
    var TakoLabelbtn = document.createElement("div");
    TakoLabelbtn.className = "tako_label-btn";
    // label を追加
    TakoLabelbtn.appendChild(TakoCElabel);
    TakoLabelbtn.appendChild(TakoIMGlabel);

    document.body.appendChild(TakoLabelbtn);

    // 実際に表示するゾーンとして新しい div 要素を作成
    var TakoCEpanel = document.createElement("div");
    TakoCEpanel.className = "tako_cepanel";

    var TakoIMGpanel = document.createElement("div");
    TakoIMGpanel.className = "tako_imgpanel";

    // 新しい iframe 要素を作成
    var CEiframe = document.createElement("iframe");
    CEiframe.src = "?mode=admin&work=cemoji";
    CEiframe.frameBorder = "0";

    var IMGiframe = document.createElement("iframe");
    IMGiframe.src = "?mode=admin&work=images";
    IMGiframe.frameBorder = "0";

    // div 要素に iframe 要素を追加
    TakoCEpanel.appendChild(CEiframe);
    TakoIMGpanel.appendChild(IMGiframe);

    // body 要素に新しい div 要素を挿入
    document.body.appendChild(TakoCEpanel);
    document.body.appendChild(TakoIMGpanel);
}
```

```css
/*edit.css*/
/*チェックボックスを非表示にする*/
input#tako_emoji, input#tako_img {
    display: none;
}
/*中身を外側要素いっぱいに広げる*/
iframe {
    width: 100%;
    height: 100%;
}

/* -------------------- ここから好きに調整してください -------------------- */
:root{
    /*z-indexの指定（既存のz-indexプロパティと衝突しないように注意してください）
     数値が大きいほうが上に表示されます*/

    /*カスタム絵文字 管理画面*/
    --z-index-ce:2;
    /*アップロード画像 管理画面*/
    --z-index-img:1;
}

/*カスタム絵文字ピッカーのサイズ調整*/
.tako_cepanel {
    position: fixed;
    bottom: 0;
    left: -100%;
    width: 100%;
    max-width: 600px;
    height: 50vh;
    max-height: 600px;
    transition: 0.5s;
    z-index: var(--z-index-ce); 
}
/*ボタンを押したら左から出てくる*/
input#tako_emoji:checked~.tako_cepanel {
    left: 0;
}

/*画像管理画面のサイズ調整*/
.tako_imgpanel {
    position: fixed;
    bottom: 0;
    right: -100%;
    width: 100%;
    max-width: 600px;
    height: 50vh;
    max-height: 600px;
    transition: 0.5s;
    z-index: var(--z-index-img);
}

/*ボタンを押したら右から出てくる*/
input#tako_img:checked~.tako_imgpanel {
    right: 0;
}

/*------ラベル部分の装飾------*/
/*ボタンを囲んでいる外側のポジション決め*/
.tako_label-btn {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    padding: 0;
    position: fixed;
    top: 0;
    right: 5rem;
}
/*ボタンひとつひとつ*/
.tako_label-btn label {
    display: inline-block;
    margin: 2px;
    padding: 0.3rem 0.5rem;
    transition: 0.3s;
    font-size: 1rem;
    border-radius: 5px;
    color: aliceblue;
    background-color: royalblue;

}
/*押したらちょっとへこむ感じに*/
.tako_label-btn label:active {
    transform: scale(0.8);
}

/*選択されているボタンは色を変える*/
input#tako_emoji:checked~.tako_label-btn>label[for="tako_emoji"],
input#tako_img:checked~.tako_label-btn>label[for="tako_img"] {
    color: mintcream;
    background-color: teal;
}
```


てがろぐ本体（tegalog,cgi）を同じフォルダにアップロードしたらうまくいっているはずです。

CSSは例として入れているだけなので、お好きに改変してください。
絵文字や画像を表示する部分を、画面の下半分に表示するようにしているので、
ボタンは上のほうにあったらいいかな…と思い、右上に固定するようにしています。

## 備考
表示が崩れる場合はキャッシュを削除してみてください。

クラス名や変数名などに入っている「tako」は作者の主張というより、
何かあっても既存のクラスと干渉しないように統一して入れているので、
お好きな名前に入れ替えて使ってくださって問題ありません。

予告なく改変する場合がありますのでご注意ください。