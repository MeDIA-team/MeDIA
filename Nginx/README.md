# Nginx

- Web サーバ
  - MeDIA Web へのリバースプロキシ・アクセスログの管理を行っている

Container Image として `nginx:1.17` を使っている。

## Settings

設定は、`./nginx.conf.tmpl` に記述している。

また、`../docker-compose.yml` でにて、environment を用いて記述した後に、`./nginx.conf.tmpl` に埋め込んでいる。

```yaml
environment:
  SERVER_NAME: "10.1.1.82"
  APP_URL: "http://app:8080"
```

ここで、 `SERVER_NAME` は `nginx.conf` 内の `server_name` になる。

また、 `APP_URL` は、リバースプロキシ先となる。こちらは、基本的に docker network 内の設定で固定されているため、deploy 時の変更が必要ない。
