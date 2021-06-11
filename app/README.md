# MeDIA App

データの閲覧/出力を行うアプリケーション

## config file

config file の validate

```bash
$ yarn config:validate ./tests/config.test.json
[2021/06/11 02:38:10] Start to validate the config.
[2021/06/11 02:38:10] validating...
[2021/06/11 02:38:10] Finish to validate the config.
Done in 5.48s.
```

投入用データの schema 生成

```bash
$ yarn config:dumpSchemas ./tests/config.test.json
[2021/06/11 02:40:23] Start to dump schemas.
[2021/06/11 02:40:23] validating...
[2021/06/11 02:40:23] dumping...
[2021/06/11 02:40:23] Finish to dump schemas.
Done in 5.25s.

$ ls schema/
data.schema.json  patient.schema.json  sample.schema.json
```

## 設定

設定項目は、`../docker-compose.yml` の environment に集約されている。

```yaml
environment:
  BASIC_AUTH_PASS: 'pass'
  BASIC_AUTH_USER: 'media'
  BASIC_ENABLED: 'true'
  BROWSER_BASE_URL: 'http://127.0.0.1:8888'
  ES_URL: 'http://db:9200'
  NUXT_HOST: '0.0.0.0'
  NUXT_PORT: '8080'
```

- `BASIC_AUTH_PASS`
  - Basic 認証の password
- `BASIC_AUTH_USER`
  - Basic 認証の user name
- `BASIC_ENABLED`
  - Basic 認証をかけるかどうか (true or false)
- `BROWSER_BASE_URL`
  - クライアントから見た MeDIA App の URL
- `ES_URL`
  - Elasticsearch の URL
  - docker network で設定されているため、基本的に変更する必要がない
- `NUXT_HOST`
  - MeDIA App を起動する Host
  - docker network で設定されているため、基本的に変更する必要がない
- `NUXT_PORT`
  - MeDIA App を起動する Port
  - docker network で設定されているため、基本的に変更する必要がない

## データの読み込み

Data crawler を用いて作成した data を Elasticsearch に bulk import する。

```bash
$ yarn bulk:entry /your/json/file/path
$ yarn bulk:sample /your/json/file/path
$ yarn bulk:patient /your/json/file/path
```

Host machine の `./data` directory が app container 内に mount されている。
そのため、`./data` directory を用いて、下のようにして実行する。

```bash
$ docker-compose exec app yarn bulk:entry /app/data/your.json
```

上のコマンドで行われる処理は、

- app container と Elasticsearch container の疎通確認
- schema を用いた json の validate
- Elasticsearch の index の作成
- bulk 処理

である。

また JSON schema として、`./es_schema` 以下の json を用いている。

## Development

開発サーバを起動するためには、

```bash
$ yarn dev
```

また、dummy data として、以下が用意されている。

```bash
# ./tests 以下に dummy data を生成
$ yarn test:generateTestData

# patientNum の default は 100. 変更したい場合は下記
$ yarn test:generateTestData 1000

# Elasticsearch に bulk import
$ yarn test:bulk:entry
$ yarn test:bulk:sample
$ yarn test:bulk:patient
```
