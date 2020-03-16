# MeDIA

微生物叢情報と臨床マルチモーダルデータの統合管理システム

コンポーネントとして、

- MeDIA Web
  - データの閲覧/出力を行う Web アプリケーション
- Elasticsearch
  - RESTful な API を提供する分散型検索/分析エンジン
  - データを格納する DB としても動作する
- Nginx
  - Web サーバ

からなる。

## 簡単な使い方

環境構築として、[Docker](https://www.docker.com)、[docker-compose](https://docs.docker.com/compose/) を使用している。

```bash
# inotify の設定を変更する
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
$ sysctl -p
# Docker network の作成
$ docker network create media_network
# 全てのコンポーネントの起動
$ docker-compose up -d --build
```

Docker を使わない環境構築や様々な設定方法について、より詳細なドキュメントとして以下を参照する。

- [MeDIA CLI](https://github.com/suecharo/MeDIA/blob/develop/CLI/README.md)
- [Elasticsearch](https://github.com/suecharo/MeDIA/blob/develop/Elasticsearch/README.md)
- [MeDIA Web](https://github.com/suecharo/MeDIA/blob/develop/Web/README.md)

<!-- TODO Develop な URL であるため、後々変更が必要 -->

## 開発環境

- OS
  - `Ubuntu 16.04.6 LTS (Xenial Xerus)`
- Docker
  - `19.03.5`
- docker-compose
  - `1.23.1`
