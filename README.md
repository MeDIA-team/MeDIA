# MeDIA

微生物叢情報と臨床マルチモーダルデータの統合管理システム

コンポーネントとして、

- MeDIA App
  - データの閲覧/出力を行う Web アプリケーション
- Elasticsearch
  - RESTful な API を提供する分散型検索/分析エンジン
  - データを格納する DB として使用する

からなる。

## 簡単な使い方

環境構築として、[Docker](https://www.docker.com)、[docker-compose](https://docs.docker.com/compose/) を使用している。

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

## 起動前に確認したほうが良い設定

[`docker-compose.yml`](./docker-compose.yml) 内で、Elasticsearch のヒープメモリとして `-Xms16g -Xmx16g` を指定している。
そのため、通常のサーバではメモリ不足で落ちる場合がある。
その場合、`-Xms4g -Xmx4g` のように少なめに指定する。

---

Elasticsearch、Nuxt.js のために HostOS の Kernel Option を変更する。

```bash
# 仮想メモリの上限を変更する (for Elasticsearch)
$ sysctl -w vm.max_map_count=262144

# ファイル監視数の上限を変更する (for Nuxt.js)
$ sysctl -w fs.inotify.max_user_watches=524288

# sysctl の reload
$ sysctl -p
```

## より詳細なドキュメント

システム管理者向けのドキュメントとして下記が挙げられる。

- [MeDIA App](./app/README.md)
- [Elasticsearch](./Elasticsearch/README.md)

また、それぞれの環境ごとの Deploy 用のドキュメントとして下記が挙げられる。

- [GitHub - MeDIA-team/MeDIA-data-keio - deployment.md](https://github.com/MeDIA-team/MeDIA-data-keio/blob/master/docs/deployment.md)
- [GitHub - MeDIA-team/MeDIA-data-riken - deployment.md](https://github.com/MeDIA-team/MeDIA-data-riken/blob/master/docs/deployment.md)

最後に、システム利用者向けのドキュメントとして、[ui-docs.md](./ui-docs.md) が用意されている。
