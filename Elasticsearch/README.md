# Elasticsearch

- RESTful な API を提供する分散型検索/分析エンジン
- データを格納する DB としても動作する

Elasticsearch Container Image として `docker.elastic.co/elasticsearch/elasticsearch:7.6.1` を使っている。

## Settings

基本的に single node での稼働を想定している。

いくつかの設定は `../docker-compose.yml` の environment において指定している。

```yaml
environment:
  bootstrap.memory_lock: "true"
  discovery.type: "single-node"
  ELASTIC_PASSWORD: "media_elasticsearch_passwd"
  ES_JAVA_OPTS: "-Xms1g -Xmx16g -Xlog:disable -Xlog:all=warning:stderr:utctime,level,tags -Xlog:gc=warning:stderr:utctime"
  TAKE_FILE_OWNERSHIP: "true"
```

また、 `./elasticsearch.yml` や `./log4j2.properties` においてもいくつかの設定を行い、Container 内の `/usr/share/elasticsearch/config` 内に mount している。

## REST API

Port を bind していないため、Host Machine から REST API Request を送ることは出来ない。もし、送りたい場合は、下記の記述を `docker-compose.yml` に追加する。

```yaml
ports:
  - 9200:9200
  - 9300:9300
```

または、docker-compose において、それぞれの Container 間で同一の Docker Network を使用しているため、MeDIA Web Container から `db:9200` で REST API リクエストを送ることが出来る。

```yaml
$ docker-compose exec app curl http://db:9200/
```

## 動作確認

[Elasticsearch 公式 API 仕様](https://www.elastic.co/guide/en/elasticsearch/reference/master/docs.html)

```bash
$ docker-compose exec app curl http://db:9200/
{
  "name" : "aeb36f253c49",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "AB1SuJZOQjmJID530qogSw",
  "version" : {
    "number" : "7.6.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "aa751e09be0a5072e8570670309b1f12348f023b",
    "build_date" : "2020-02-29T00:15:25.529771Z",
    "build_snapshot" : false,
    "lucene_version" : "8.4.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 初期化

Host Server 側の `./data` を Container 側の `/usr/share/elasticsearch/data` に mount することによりデータの永続化を行っている。

Data を初期化したい場合は、以下の Dir を削除すれば良い

```bash
# 消去される file, dir の確認
`$ git clean -nd Elasticsearch

# 消去
`$ git clean -fd Elasticsearch
```
