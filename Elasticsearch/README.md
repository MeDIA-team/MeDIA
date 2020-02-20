# Elasticsearch

- RESTful な API を提供する分散型検索/分析エンジン
- データを格納する DB としても動作する

Elasticsearch のコンテナ image として `docker.elastic.co/elasticsearch/elasticsearch:7.6.0` を使っている。

## 設定

基本的に single node での稼働を想定している。

いくつかの設定は `../docker-compose.yml` の environment において指定している。

```yaml
discovery.type: "single-node"
ELASTIC_PASSWORD: "media_elasticsearch_passwd"
ES_JAVA_OPTS: "-Xms512m -Xmx512m" # TODO for development
```

また、 `./elasticsearch.yml` において、primary/replicate shard の数を指定している。この file は container 内において `/etc/elasticsearch/elasticsearch.yml` に mount されている。

```yaml
index.number_of_shards: 1
index.number_of_replicas: 0
```

---

Elasticsearch のために Host Server の Kernel Option をする必要がある。

```bash
$ sysctl -w vm.max_map_count=262144
```

## REST API

Docker の port mount として以下の設定を使用している。

```yaml
ports:
  - 9200:9200 # TODO for development
  - 9300:9300 # TODO for development
```

そのため、Host Server からは `localhost:9200` で REST API にリクエストを送ることが出来る。

また、docker-compose において、それぞれの container で同一の Docker Network を使用しているため、MeDIA CLI や MeDIA Web container からは `db:9200` で REST API にリクエストを送ることが出来る。

## 動作確認

[Elasticsearch 公式 API 仕様](https://www.elastic.co/guide/en/elasticsearch/reference/master/docs.html)

```bash
# 起動確認
$ curl -X GET http://localhost:9200/
{
  "name" : "a73e54246b27",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "2olHWpcfRPuDhKP7vn5pUg",
  "version" : {
    "number" : "7.6.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "7f634e9f44834fbc12724506cc1da681b0c3b1e3",
    "build_date" : "2020-02-06T00:09:00.449973Z",
    "build_snapshot" : false,
    "lucene_version" : "8.4.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}

# Cluster の状態確認
$ curl -X GET http://localhost:9200/_cat/health?v
epoch      timestamp cluster        status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
1582184374 07:39:34  docker-cluster green           1         1      7   7    0    0        0             0                  -                100.0%

# Index 一覧
$ curl -X GET http://localhost:9200/_cat/indices?v
health status index                    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   data                     dGx1zW5mQZipkhDMUsCqlw   1   0       2279            0    676.5kb        676.5kb
green  open   .kibana_task_manager_1   KwmyiWD6SW-uwaUZa_daAQ   1   0          2            1     29.7kb         29.7kb
green  open   patient                  GxlFAjOsQ2CKUA0MugQYjA   1   0        100            0     19.9kb         19.9kb
green  open   .apm-agent-configuration bZrS5Eg3TBG11Xoh72R-CA   1   0          0            0       283b           283b
green  open   project_patient          meJ8VHY8SqaKDYxebqzYyQ   1   0        900            0    131.8kb        131.8kb
green  open   project                  zg6Z3297TWS7FBbmPIG5MQ   1   0          9            0      4.9kb          4.9kb
green  open   .kibana_1                JNFfWkEVQbOfPqfiL7AXPA   1   0         10            4     25.8kb         25.8kb
```

Index は Kibana 起動時や MeDIA CLI での data load 時に自動的に作成される。そのため、初期起動時は存在しない。
