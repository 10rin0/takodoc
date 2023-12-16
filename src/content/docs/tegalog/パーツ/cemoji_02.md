---
title: カスタム絵文字ピッカー(その2)
---

## 概要
- てがろぐ Ver 4.0.5.から実装されている、カスタム絵文字リストをスキンへ持ってくるスクリプト
- 前回配布したものとは別
- jQuery・PHP使用
- AI生成物を加筆修正したもの（検証：Windows/vivaldi、iOS/safari）
- 使用は自己責任でお願いいたします

## 詳細
カスタム絵文字ピッカーを、Misskeyみたいに使うためのスクリプト第二弾です。前のものとは別物になったので別の記事にしました。

PHPで絵文字を使用するフォルダ（ディレクトリ）内の画像ファイルを一覧化し、
HTML（スキン）内の任意のdiv要素内へ出力します。
そうやって出力された絵文字をクリックすると、クイック投稿フォームの現在のカーソル位置へ挿入される、というものです。
使用する場合は、スキンへの記述の追加のほかに、PHPファイルを作成する必要があります。

[デモでお試しください。](https://takotubo.10rino.net/demo/tegalog.cgi?skin=test)  
（デフォルトスキンのクイック投稿フォームの近くに配置しています）

## 使用方法
### PHPファイルの作成
「get_cemoji.php」というPHPファイルを作成します。

```php {4} {16} "https://www.example.com" "emoji/"
// get_cemoji.php
<?php
// ここに許可するドメイン（自分のサイトのURL）を追加
$allowedDomain = 'https://www.example.com';

// Refererヘッダーを取得
$referer = $_SERVER['HTTP_REFERER'];

// Refererヘッダーが許可するドメインで始まるかどうかを確認
if (strpos($referer, $allowedDomain) === 0) {
    // 許可するドメインからのアクセスの場合、処理を続行

    // ここから　カスタム絵文字ピッカーについての記述

    // カスタム絵文字ディレクトリのパス（デフォルトはemoji）
    $imgDir = 'emoji/';

    // ディレクトリ内のファイル一覧を取得
    $files = scandir($imgDir);
    // 余分な要素を削除
    $files = array_diff($files, array('.', '..'));
    // JSON形式でファイルリストを返す
    header('Content-Type: application/json');
    echo json_encode($files);
    // ここまで　カスタム絵文字ピッカーについての記述

} else {
    // 許可しないドメインからのアクセスの場合、エラーを返すなどの処理を行う
    http_response_code(403); // 403 Forbiddenを返す
    echo "アクセスが許可されていません。";
    exit;
}
?>
```

phpファイルのみにアクセスされるのを防ぐため（別に見えても画像ファイル名しかないと思いますが…）、
自分のサイトからしかphpを呼び出せないようにします。

「`https://www.example.com`の部分を自分のサイトのURLに書き換えてください。
（他にいい方法があったら教えてください・・・）

また、カスタム絵文字のディレクトリを変更している場合は、そちらも適切に書き換えてください。

:::tip[設定の確認]
てがろぐの設定から、
設定=>システム設定=>【カスタム絵文字機能の設定】で設定しているディレクトリを確認してください。

phpで指定するスクリプトには、その名前の末尾に/を追加してください。
:::

phpファイルが作成出来たら、tegalog.cgiが設置してあるディレクトリ内に設置してください。
（異なる場所に配置したり、get_cemoji.php以外のファイル名にする場合は、下記のスクリプトの記述で、ご自身で適切に書き換えてください。）

### skin-cover.htmlの記述
続いてスキン側（skin-cover.html）へ、絵文字を出力位置へ要素を追加
適当なところ（クイック投稿フォームの近くがおすすめ）に下記を追加
```html "cemojipicker"
<!-- skin-cover.html -->
<div class="cemojipicker Login-Required"></div>
```
Login-Requiredはログイン時以外は非表示にできるクラスです。（[公式マニュアル](https://www.nishishi.com/cgi/tegalog/custom/#customizeinfo-loginrequired) ）
cemojipickerの部分は好きに置き換えて問題ないですが、スクリプトのcemojipickerの部分を置き換える必要があります。

```html {12-13} {19} "get_cemoji.php" "emoji/" ".cemojipicker"
<!-- skin-cover.html -->
<script>
   $(document).ready(function () {
      // サーバーサイドのスクリプトから画像ファイルリストを取得
      $.ajax({
         url: 'get_cemoji.php', // サーバーサイドのスクリプトへのパスを指定
         dataType: 'json',
         success: function (data) {
            // 取得したファイルリストを処理
            $.each(data, function (index, filename) {

               // 拡張子を取り除いたファイル名を生成 必要であれば有効にする（不要なのでコメントアウト）
               // var fileBaseName = filename.split('.').slice(0, -1).join('.');

               // 画像の<img>要素を作成し、alt属性を設定して<div class="cemojipicker">に追加
               var imgSrc = 'emoji/' + filename;

               // alt属性を指定された形式に設定。拡張子を含めないときはfilenameをfileBaseNameにする
               var altText = '[:' + filename + ':]';

               var img = $("<img>").attr("src", imgSrc).attr("alt", altText);
               img.appendTo(".cemojipicker");

               // 画像をクリックしたときの処理
               img.click(function () {
                  // クリックされた画像のalt属性の値を取得
                  var altText = $(this).attr("alt");

                  // <textarea class="tegalogpost">のDOM要素を取得
                  var textarea = document.querySelector(".tegalogpost");

                  // カーソルの位置を取得
                  var cursorPos = textarea.selectionStart;

                  // テキストエリアの内容を取得
                  var text = textarea.value;

                  // カーソル位置に新しいテキストを挿入
                  var newText = text.slice(0, cursorPos) + altText + text.slice(cursorPos);

                  // テキストエリアに新しいテキストを設定
                  textarea.value = newText;

                  // カーソル位置を更新
                  textarea.selectionStart = cursorPos + altText.length;
                  textarea.selectionEnd = cursorPos + altText.length;
               });
            });
         }
      });
   });
</script>
```

これは絵文字のAlt属性を`[:ファイル名.拡張子:]`の形式で作成し、そのAlt要素を取得=>テキストエリアに貼り付けています。
拡張子を含めることで、投稿フォームのライブプレビュー機能等を実装している場合に、絵文字をプレビューすることができます。

不要な場合は`[:ファイル名:]`の形式がスマートだと思うので、コメントアウトしている部分を有効にして使ってください。

また、`get_cemoji.php`、`emoji/`、`.cemojipicker`の部分は、前の項目でファイル名・クラス名を変更している場合に変更が必要な箇所です。

### CSS 
CSS（例）
```css
/*全体の見た目を整える*/
.cemojipicker{
   margin: 10px auto;
   padding: 5px 0;
   width: calc(100% - 10px);
   max-width: 900px;
   max-height: 300px;
   overflow-y: auto;
   background-color: #dedede;
}

/*カスタム絵文字のサイズをそろえて余白をつける*/
.cemojipicker img {
   margin: 2px 5px;
   height: 2em;
   transition: 0.3s;
}

/*絵文字をクリックしたらちょっと小さくなる*/
.cemojipicker img:active{
transform: scale(0.8);
}
```
●このスプリクトは、てがろぐのアップデートにかかわらず、不定期に更新・変更、削除する可能性があります。●