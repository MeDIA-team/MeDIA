# MeDIA App

データの閲覧/出力を行う Web アプリケーション

## 設定

設定項目は、[`docker-compose.yml`](../docker-compose.yml) の `environment` において指定している。

```yaml
environment:
  BASIC_AUTH_PASS: 'pass' # Basic 認証の password
  BASIC_AUTH_USER: 'media' # Basic 認証の user name
  BASIC_ENABLED: 'true' # Basic 認証をかけるかどうか (true or false)
  BROWSER_BASE_URL: 'http://127.0.0.1:8888' # クライアントから見た MeDIA App の URL
  ES_URL: 'http://db:9200' # Elasticsearch の URL (docker network を使っているため変更する必要がない)
  NUXT_HOST: '0.0.0.0' # MeDIA App を起動する Host (docker network を使っているため変更する必要がない)
  NUXT_PORT: '8080' # MeDIA App を起動する Port (docker network を使っているため変更する必要がない)
```

恐らく躓く部分として、`BROWSER_BASE_URL` が挙げられる。
これは、ES への request 部分において Nuxt.js の proxy 機能を使っているため、CROS の問題から適切に設定する必要がある。
実際に browser でアクセスするときの url を適切に記述すればよい。
例えば、内部 DNS などで、`https://media.example.com` をこのアプリに向けている際、それを記述する。

## データの読み込み (config file and entry file)

config file と entry file を理解している場合は、下記のコマンドで validate から bulk insert まですべて行うことが出来る。

```bash
# yarn bulk ['data', 'patient', 'sample'] <config-file-path> <entry-file-path>
$ yarn bulk data /app/data/your.config.json /app/data/your.data.json
```

host machine の `./data` directory が app container 内に mount されている。
そのため、`./data` directory を用いて、下のようにも実行できる。

```bash
$ docker-compose exec app yarn bulk data /app/data/your.config.json /app/data/your.data.json
```

---

Elasticsearch や UI を汎用化するために、config file と entry file というそれぞれの概念を導入した。

- config file
  - UI の設定や elasticsearch の field 情報を記述する
  - data parser は config file を元に entry file を生成する
  - [Schema](./config.schema.json)
  - [test 用の例](./tests/config.test.json)
- entry file
  - UI で表示したい情報
  - 'data', 'patient', 'sample' の 3 種類
  - elasticsearch に bulk insert される
  - schema は config から自動生成される
    - [test 用の data schema](./tests/data.schema.test.json)
    - [test 用の patient schema](./tests/patient.schema.test.json)
    - [test 用の sample schema](./tests/sample.schema.test.json)

以上より、elasticsearch に entry を投入する手順として以下のようになる

1. config file を書く
2. config file を validate して、config file から entry file 用の schema を生成する
3. entry file 用の schema に基づいて data parser を作成し、entry file を生成する
4. entry file を validate して、elasticsearch に bulk insert する

validate などの各種コマンド と config file と entry file のより詳細な仕様は後述する。

### 各種コマンド

#### config file の validate

```bash
# yarn config:validate <config-file-path>
$ yarn config:validate ./tests/config.test.json
[2021/06/15 09:29:01] Start to validate the config file.
[2021/06/15 09:29:02] Validating the config file...
[2021/06/15 09:29:02] Finish to validate the config file.
Done in 6.46s.
```

#### config file から entry file 用の schema の生成

```bash
# yarn config:dumpSchemas <config-file-path>
$ yarn config:dumpSchemas ./tests/config.test.json
[2021/06/15 09:30:24] Start to dump entry file schemas.
[2021/06/15 09:30:24] Validating the config file...
[2021/06/15 09:30:24] Dumping entry file schemas...
[2021/06/15 09:30:24] Finish to dump entry file schemas.
Done in 6.25s.

$ ls schema/
data.schema.json  patient.schema.json  sample.schema.json
```

`./schema` 以下にそれぞれの schema が生成される。

#### entry file の validate

```bash
# ここでの entry file は generateTestEntries command で生成した test data である

# yarn bulk:validate ['data', 'patient', 'sample'] <config-file-path> <entry-file-path>
$ yarn bulk:validate data ./tests/config.test.json ./tests/data.test.json
[2021/06/15 09:48:04] Start to validate the entry file.
[2021/06/15 09:48:04] Validating the config file...
[2021/06/15 09:48:05] Dumping entry file schemas...
[2021/06/15 09:48:05] Validating the entry file...
[2021/06/15 09:48:05] Finish to validate the entry file.
Done in 7.02s.

$ yarn bulk:validate patient ./tests/config.test.json ./tests/patient.test.json
$ yarn bulk:validate sample ./tests/config.test.json ./tests/sample.test.json
```

#### entry file の bulk insert

bulk insert は http request body size の制限から 100MB までの制限があるため、実際の処理として分割して bulk insert する。
そのため、コマンドライン引数における entry file のサイズ上限はない。

```bash
# yarn bulk:validate ['data', 'patient', 'sample'] <config-file-path> <entry-file-path>
$ yarn bulk data ./tests/config.test.json ./tests/data.test.json
[2021/06/15 09:49:20] Start to bulk the entry file.
[2021/06/15 09:49:20] Validating the config file...
[2021/06/15 09:49:20] Dumping entry file schemas...
[2021/06/15 09:49:20] Validating the entry file...
[2021/06/15 09:49:20] Creating the ES index: data...
[2021/06/15 09:49:20] Bulking the entry data...
[2021/06/15 09:49:25] Updating the dataTypes filed in mappings....
[2021/06/15 09:49:25] Inserting config data...
[2021/06/15 09:49:25] Finish to bulk the entry file.
Done in 12.55s.

$ yarn bulk patient ./tests/config.test.json ./tests/patient.test.json
$ yarn bulk sample ./tests/config.test.json ./tests/sample.test.json
```

### config file のより詳細な仕様

- [Schema](./config.schema.json)
- [test 用の例](./tests/config.test.json)

---

`filter.fields[]` 以下には、それぞれの filter 用の field が入る。
UI コンポーネントから考えられる field の種類とそれぞれの仕様として以下が挙げられる。

- checkbox field
  - checkbox で AND 条件で filter をかけるための field
  - `.type` は `string` のみである
- chip field
  - プルダウンメニューから条件を選び filter をかけるための field
  - `.type` は `string` のみである
  - `.form.logic` として `OR` か `AND` を指定することが出来る
  - `.form.boxWidth` と `.form.boxLabel` を指定することが出来る
    - `boxWidth` の初期値は `660px`
- text field
  - インクリメンタルサーチのようなテキストボックスではなく、range 条件で filter をかけるための field
  - `.type` は `integer` と `date` のみである
  - `.form.boxWidth` を指定することが出来る
    - `boxWidth` の初期値は `200px`

また、いくつか注意するべき点として

- `filter.fields[].id` として `patientId`, `sampleId`, `dataType` のそれぞれは必ず記述されなければならない
- `filter.fields[]` の記述順が UI の filter における記述順になる
- `filePath` などの `dataType` に紐づく meta field は記述する必要がない

---

`selector.dataType[]` 以下には、selector の tree 構造が入る

`child` field の有無に応じて階層構造を作ることが出来る。
例えば、下記のようなパターンの場合、

```json
{
  "id": "category",
  "label": "Category",
  "child": [
    {
      "id": "histology",
      "label": "Histology"
    },
    {
      "id": "childCategory",
      "label": "Child Category ",
      "child": [
        {
          "id": "clinicalLabData",
          "label": "Clinical lab data"
        }
      ]
    }
  ]
}
```

`child` を持つ `category` と `childCategory` (tree 構造の節) は実際の `dataType` の値ではなく、UI のために config file 内でのみ記述されるものである。
`child` を持たない `histology` と `clinicalLabData` (tree 構造の葉) は実際の `dataType` の値であり、elasticsearch に投入される entry file に含まれていなければならない。

注意するべき点として、

- entry file の dataType の値において、tree 構造の葉に含まれていない値が存在する場合、validate で error が発生する

### entry file のより詳細な仕様

基本的に config file から生成される schema に基づいて作成すれば良い。

`filePath` などの meta field の記述位置として、

- `data` の場合
  - `items.properties` に他の field と横並びに記述する
- `patient` の場合
  - `items.properties.samples.items.properties.dataTypes.items.properties` に紐づく dataType に併記する
- `sample` の場合
  - `items.properties.dataTypes.items.properties` に紐づく dataType に併記する

## Development

開発環境として [`docker-compose.dev.yml`](../docker-compose.dev.yml) を使用する。

```bash
$ docker-compose -f docker-compose.dev.yml up -d --build
$ docker-compose -f docker-compose.dev.yml exec app bash
```

kibana も用意されている。

`http://0.0.0.0:5601`

### テスト用 entry file の生成

```bash
# ./tests 以下に テスト用 entry file を生成
# patient num を指定することが出来る
# yarn test:generateTestEntries <patient-num>
$ yarn test:generateTestEntries 1000
[2021/06/15 09:44:42] Start to generate test entry files.
[2021/06/15 09:44:42] PatientNum: 1000
Generated DataNum: 17155
FileSize: 9043682
Generated PatientNum: 1000
FileSize: 6004464
Generated SampleNum: 5801
FileSize: 5496793
[2021/06/15 09:44:45] Finish to generate test entry files.
Done in 8.28s.

# Elasticsearch に bulk insert
$ yarn test:bulk
```

### 開発用 Nuxt.js サーバ

```bash
$ yarn dev
```

default では `http://127.0.0.1:8888`

### 単体テストの実行

```bash
$ yarn test
```
