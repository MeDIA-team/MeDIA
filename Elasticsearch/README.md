# Elasticsearch

- RESTful な API を提供する分散型検索/分析エンジン
- データを格納する DB として動作

Elasticsearch container image として `docker.elastic.co/elasticsearch/elasticsearch:7.13.1` を使用している。

## 設定

基本的に single node での稼働を想定している。

いくつかの設定は [`docker-compose.yml`](../docker-compose.yml) の `environment` において指定している。

```yaml
environment:
  discovery.type: "single-node"
  ELASTIC_PASSWORD: "media_elasticsearch_passwd"
  ES_JAVA_OPTS: "-Xms16g -Xmx16g -Xlog:disable -Xlog:all=warning:stderr:utctime,level,tags -Xlog:gc=warning:stderr:utctime"
```

また、 [`elasticsearch.yml`](./elasticsearch.yml) や [`log4j2.properties`](log4j2.properties) においてもいくつか設定し、container 内の `/usr/share/elasticsearch/config` に mount している。

## REST API Request

Port を host os に bind していないため、host os から REST API Request を送ることは出来ない。
送りたい場合は、下記を [`docker-compose.yml`](../docker-compose.yml) に追加する。

```yaml
ports:
  - 9200:9200
  - 9300:9300
```

また、それぞれの Container 間で同一の Docker Network を使用しているため、MeDIA app Container から `db:9200` で REST API Request を送ることが出来る。

```yaml
$ docker-compose exec app curl http://db:9200/
```

## 動作確認

[Elasticsearch 公式 API 仕様](https://www.elastic.co/guide/en/elasticsearch/reference/master/docs.html)

```bash
$ docker-compose exec app curl http://db:9200/
{
  "name" : "5a8bee462b1f",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "D1yvTefQTJa1yujdDpctZw",
  "version" : {
    "number" : "7.13.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "9a7758028e4ea59bcab41c12004603c5a7dd84a9",
    "build_date" : "2021-05-28T17:40:59.346932922Z",
    "build_snapshot" : false,
    "lucene_version" : "8.8.2",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 初期化

Host os 側の `./data` を container 側の `/usr/share/elasticsearch/data` に mount することでデータの永続化を行っている。

Data を初期化したい場合は、`./data` の中身を削除する

```bash
# 消去される file, dir の確認
$ git clean -nd Elasticsearch/data

# 消去
$ git clean -fd Elasticsearch/data
```
