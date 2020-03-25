# MeDIA Web

- データの閲覧/出力を行う Web アプリケーション

## 使い方

起動直後は以下の画面である。

![media_initial](./docs_images/media_initail.png)

まず、Filter Tool を使うことによって、行を制限できる。

![media_filter](./docs_images/media_filter.png)

次に、Selector Tool を使うことによって、表示する列を制限できる。

![media_selector](./docs_images/media_selector.png)

また、Selector Tool のプルダウンメニューを開くことによって、より詳細な情報の列を表示できる。

![media_selector2](./docs_images/media_selector_2.png)

Sort 機能として、それぞれの列の Header をクリックすることで Sort を行える。

![media_sorter](./docs_images/media_sorter.png)

Pagination や表示できる行数を替えながら、Export したい行を選択する。

![media_pagination](./docs_images/media_pagination.png)

最後に、Export Table ボタンを押すことで、選択した行が、select された列のまま (つまり現在見えている table の列) が tsv file として出力される。

![media_export](./docs_images/media_export.png)

## 設定

設定項目は、`../docker-compose.yml` の environment に集約されている。

```yaml
environment:
  BASIC_AUTH_PASS: "pass"
  BASIC_AUTH_USER: "media"
  BASIC_ENABLED: "true"
  BROWSER_BASE_URL: "http://10.1.1.82:8888"
  ES_URL: "http://db:9200"
  NUXT_HOST: "0.0.0.0"
  NUXT_PORT: "8080"
```

- `BASIC_AUTH_PASS`
  - Basic 認証の password
- `BASIC_AUTH_USER`
  - Basic 認証の user name
- `BASIC_ENABLED`
  - Basic 認証をかけるかどうか (true or false)
- `BROWSER_BASE_URL`
  - クライアントから見た際の、MeDIA Web の URL
  - 基本的に nginx へと入るための URL を記述すればよい
- `ES_URL`
  - Elasticsearch の URL
  - docker network で設定されているため、基本的に変更する必要がない
- `NUXT_HOST`
  - MeDIA Web を起動する Host
  - docker network で設定されているため、基本的に変更する必要がない
- `NUXT_PORT`
  - MeDIA Web を起動する Port
  - docker network で設定されているため、基本的に変更する必要がない

## JSON データの読み込み

### Validate

Data Crawler を用いて、作成した JSON Data を Validate するためのコマンドとして、 `npm run validate` が用意されている。

```bash
# (注意) -- が必要である、絶対 path が望ましい
$ npm run validate -- /your/json/file/path
```

このコマンドを使用するために、Host Machine の `./data` Directory が Docker Container 内に Mount されている。そのため、実際には、

```bash
$ ls data
your.json

$ docker-compose exec app npm run validate -- /opt/MeDIA_Web/data/your.json
```

で Validate 処理が行える。ここで注意することとして、 `/opt/MeDIA_Web` に Host Machine の Web Dir が mount されていることである。

---

Schema として、`./schema.json` を用いている。Schema を編集したい場合は、このファイルを編集する。

Dummy Data を用いて Test を行った際の、正常系と異常系の出力は下記の通りである。

```bash
# 正常系
$ docker-compose exec app npm run validate -- /opt/MeDIA_Web/tests/dummy-data.json

> media-web@1.0.0 validate /opt/MeDIA_Web
> ./bin/validate-data-json.js "./tests/dummy-data.json"

Start to validate the data json file.
OK!!
Finish to validate the data json file.

# 異常系 (一箇所、projectID を抜いている)
docker-compose exec app npm run validate -- /opt/MeDIA_Web/tests/dummy-data.json

> media-web@1.0.0 validate /opt/MeDIA_Web
> ./bin/validate-data-json.js "./tests/dummy-data.json"

Start to validate the data json file.
ERROR!!
[
  ValidationError {
    property: 'instance[0]',
    message: 'requires property "projectID"',
    schema: { type: 'object', properties: [Object], required: [Array] },
    instance: {
      projectName: 'Retrospective clinical data',
      patientID: '20e96521bc822441c881914fd69247a8f0a50872f69996fae0d6baf08e6b9306',
      sex: 'Female',
      age: 56,
      sampleID: '4b96267b1c659e44b5bd60f44306d605',
      samplingDate: '2012-03-11T00:00:00.000Z',
      dataType: 'Microbiome',
      'File Path': '/data/RCD/Microbiome/4b96267b1c659e44b5bd60f44306d605.txt'
    },
    name: 'required',
    argument: 'projectID',
    stack: 'instance[0] requires property "projectID"'
  }
]
Finish to validate the data json file.
```

### Bulk

Data Crawler を用いて、作成した JSON Data を Elasticsearch に読み込むためのコマンドとして、 `npm run bulk` が用意されている。Elasticsearch に Index が存在しない場合、このコマンドを使うことで自動的に生成される。

```bash
# (注意) -- が必要である、絶対 path が望ましい
$ npm run bulk -- /your/json/file/path
```

このコマンドを使用するために、Host Machine の `./data` Directory が Docker Container 内に Mount されている。そのため、実際には、

```bash
$ ls data
your.json

$ docker-compose exec app npm run bulk -- /opt/MeDIA_Web/data/your.json
```

で bulk 処理が行える。ここで注意することとして、 `/opt/MeDIA_Web` に Host Machine の Web Dir が mount されていることである。

---

Dummy Data として、`./tests/dummy-data.json` が用意してある。そのため、Dummy Data を使って読み込む場合は、

```bash
$ docker-compose exec app npm run bulk -- /opt/MeDIA_Web/tests/dummy-data.json
```

を実行する。

また、Dummy Data は `./tests/generate-dummy-data.js` を使って生成している。実行したい場合は、

```bash
$ npx node ./tests/generate-dummy-data.js
```

を実行する。

## Development mode

Development mode での起動は、まず `../docker-compose.yml` の command を編集する。

```
-    command: ["npm", "run", "start"]
-    # command: ["tail", "-f", "/dev/null"]
+    # command: ["npm", "run", "start"]
+    command: ["tail", "-f", "/dev/null"]
```

その後、production mode と同様に `docker-compose up` をし、手動で nuxt dev server を起動する。

```bash
$ docker-compose up -d
$ docker-compose exec app npm run dev
```

ネットワーク周りの設定は、production mode と同様である。
