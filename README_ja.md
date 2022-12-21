# MeDIA: Medical Data Integration Assistant

臨床マルチモーダルデータの統合管理システム。システムは以下の2つのコンポーネントから構成される:

- MeDIA App
  - データの閲覧/出力を行う Web アプリケーション
- Elasticsearch
  - RESTful な API を提供する分散型検索/分析エンジン
  - データを格納する DB として使用する

## 起動に必要な設定

### Kernel option

Elasticsearch、Nuxt.js のために HostOS の Kernel Option を変更する。

```bash
# 仮想メモリの上限を変更する (for Elasticsearch)
$ sysctl -w vm.max_map_count=262144

# ファイル監視数の上限を変更する (for Nuxt.js)
$ sysctl -w fs.inotify.max_user_watches=524288

# sysctl の reload
$ sysctl -p
```

### RAM size for Elasticsearch

[`docker-compose.yml`](./docker-compose.yml) 内で、Elasticsearch に割り当てるヒープメモリの量を16GB `-Xms16g -Xmx16g` に指定している。Dockerに割り当てられたメモリ量が少ないとメモリが不足して起動しない。その場合にはメモリ量を適宜減らすことで起動することができる `-Xms4g -Xmx4g` 。この場合、データ量が膨大になるとデータのロードに失敗することがあるので注意すること。

## システムの起動

[Docker](https://www.docker.com)、[docker-compose](https://docs.docker.com/compose/) を使用する。

```bash
$ git clone git@github.com:MeDIA-team/MeDIA.git
$ cd MeDIA

# Elasticsearch の data directory の存在や権限を先に確認する
$ ls -l ./Elasticsearch/ | grep data
drwxrwxr-x 3 ubuntu ubuntu 4096 Jun 15 17:22 data
# 存在しない場合や root:root の場合は作成・変更する必要がある
$ mkdir -p -m 777 Elasticsearch/data
# or
$ chmod 777 Elasticsearch/data

# Docker network の作成
$ docker network create media_network

# 全てのコンポーネントの起動
$ docker-compose up -d --build
```

## ドキュメント

- システム利用者向け
  - [ui-docs.md](./ui-docs.md)
- システム管理者向け
  - [MeDIA App](./app/README.md)
  - [Elasticsearch](./Elasticsearch/README.md)
