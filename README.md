# 1. 環境構築
Node.js の環境を構築．

バージョン

---
Node: v16.15.0

npm: 8.5.5

---

## node または nvm のインストール 

Windows環境の場合，[Node.js](https://nodejs.org/ja/) の公式サイトからダウンロードし，ダウンロードしたファイルを実行．

PowerShell やコマンドプロンプトを開き
```bash
$ node -v
$ npm -v
# バージョンが表示
```

Linux の場合，
```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# 確認用
# $ vi ~/.bashrc
# 以下の様な記述があればＯＫ（正確に同じではない場合あり）
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

$ source ~/.bashrc

$ nvm install 16.15.0
$ node -v
$ npm -v
# バージョンが表示される
```

## ローカルでの起動確認
wsl で起動する場合は，上手く行かない場合があり，別途設定が必要．
(ただし，ローカルで確認出来ないだけで，Githubにpush後，Renderでホスティングすれば正常に動くはず)

今回はWindows（PowerShellかコマンドプロンプト）で確認！

```bash
# powershellを使用
# ScrapingAppディレクトリ
$ ls
Procfile   assets      jsconfig.json  node_modules    package-lock.json  pages              static
README.md  components  layouts        nuxt.config.js  package.json       server-middleware  storeProcfile   assets      jsconfig.json  node_modules    package-lock.json  pages              static
README.md  components  layouts        nuxt.config.js  package.json       server-middleware  store

# 必要なパッケージをインストール(依存関係の解消)
$ npm install

# ローカルでの起動
$ npm run dev
```

起動後，curl や Postman，別のプログラムから，POST リクエストを送ることで，動作確認が可能
```bash
$ curl -X POST -d "name=Unity" localhost:8000/api/scraping
```

# 2. プログラムの説明
(注：図書館の検索ページが変わると利用できない．2023年3月2日時点では使用可能)

今回必要な物は server-middleware 内のファイルである．

まず，`index.js` の10行目，
```js
app.use('/api', require('./api/routerIndex'))
```
`~/api` のリクエストを server-middleware/api/routerIndex.js に流す．

routerIndex.js
```js
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
```
これはおまじないだと思ってスルー

17行目から[OPAC](https://webcat.lib.okayama-u.ac.jp/drupal/)のキーワードで検索したページにアクセス．

18行目～55行目まではHTMLを分解して蔵書情報を取得．

58行目で取得情報をレスポンスとして返す．

# 3. Renderでのホスティング手順

1. ScrapingAppのファイルをGithubの自分のアカウントにpush
2. Renderに`sign in`後，Newボタンを押し，Web Serviceを選択．
3. Githubを連携し，リポジトリを選択．
4. Nameはアプリ名を入力（アプリのURLに使用される）
5. Build Commandに`yarn; yarn build`
6. Start Commandに`yarn start`

