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
# Docker network の作成
$ docker network create media_network
# 全てのコンポーネントの起動
$ docker-compose up -d --build
```

また、Elasticsearch、Nuxt.js のために HostOS の Kernel Option を変更しておく必要がある。

```bash
# 仮想メモリの上限を変更する (for Elasticsearch)
$ sysctl -w vm.max_map_count=262144

# ファイル監視数の上限を変更する (for Nuxt.js)
$ sysctl -w fs.inotify.max_user_watches=524288

# sysctl の reload
$ sysctl -p
```

より詳細なドキュメントとして以下を参照する。

- [MeDIA Web](https://github.com/suecharo/MeDIA/blob/develop/Web/README.md)
- [Elasticsearch](https://github.com/suecharo/MeDIA/blob/develop/Elasticsearch/README.md)
- [Nginx](https://github.com/suecharo/MeDIA/blob/develop/Nginx/README.md)

<!-- TODO Develop な URL であるため、後々変更が必要 -->
