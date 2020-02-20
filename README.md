# MeDIA

微生物叢情報と臨床マルチモーダルデータの統合管理システム

コンポーネントとして、

- MeDIA CLI
  - ストレージから収集したデータを Elasticsearch に投入するための CLI Tool
- Elasticsearch
  - RESTful な API を提供する分散型検索/分析エンジン
  - データを格納する DB としても動作する
- MeDIA Web
  - データの閲覧/出力を行う Web アプリケーション

からなる。

## 簡単な使い方

環境構築として、[Docker](https://www.docker.com)、[docker-compose](https://docs.docker.com/compose/) を使用している。

```bash
# 全てのコンポーネントの起動
$ docker-compose up -d --build

# ./CLI/data 以下に投入したいデータを配置する (TODO: 現状だと CLI 以下を全て mount している)
$ docker-compose exec cli media validate /opt/MeDIA_CLI/data/your_data.json
$ docker-compose exec cli media load /opt/MeDIA_CLI/data/your_data.json

# 手元の Browser で http://localhost:8080 にアクセスし MeDIA Web を起動する (TODO: 現状 8080 に http アクセス)
```

Docker を使わない環境構築や様々な設定方法について、より詳細なドキュメントとして以下を参照する。

- [MeDIA_CLI](https://github.com/suecharo/MeDIA/blob/develop/CLI/README.md)
- [Elasticsarch](https://github.com/suecharo/MeDIA/blob/develop/Elasticsearch/README.md)
- [MeDIA_Web](https://github.com/suecharo/MeDIA/blob/develop/Web/README.md)

<!-- TODO Develop な URL であるため、後々変更が必要 -->

## 開発環境

- OS
  - `Ubuntu 16.04.6 LTS (Xenial Xerus)`
- Docker
  - `19.03.5`
- docker-compose
  - `1.23.1`
