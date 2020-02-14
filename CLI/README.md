# MeDIA CLI

- Elasticsearch への data 投入用の CLI
  - json などを入力として投入する
  - 機関ごとに crawl の仕方が異なるため、好きな言語で json 生成まで頑張り、その後この CLI を使って投入する
  - ID の管理や情報の Update を抽象化している

## 開発 Memo

### 起動

#### Docker の場合

投入したい json が入っている dir を mount しておく

```bash
$ docker build -t media_cli .
$ docker run -it --rm -v /your/data/path:/opt/MeDIA_CLI/data media_cli bash
```

#### docker-compose の場合

投入したい json が入っている dir を mount しておく (`docker-compose.yml` にて)

```bash
$ docker-compose up -d --build
$ docker-compose exec cli bash
```

#### Local の場合

```bash
$ python3 setup.py install
```

### Elasticsearch の疎通確認

```bash
# docker-compose の場合
$ curl db:9200/
{
  "name" : "b0952efae70d",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "9jg9-c0VQsKvj1V1oJAuCA",
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

# host の場合
$ curl localhost:9200/
```

その他情報の確認

```bash
# Cluster の状態確認
$ curl -X GET db:9200/_cat/health?v
epoch      timestamp cluster        status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
1581661097 06:18:17  docker-cluster green           1         1      0   0    0    0        0             0                  -                100.0%

# Index 一覧
$ curl -X GET db:9200/_cat/indices?v
health status index uuid pri rep docs.count docs.deleted store.size pri.store.size
```
