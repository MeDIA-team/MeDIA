# MeDIA

内容としては、

- MeDIA CLI
- Elasticsearch
- MeDIA Web

## 開発環境

```bash
$ cat /etc/os-release
NAME="Ubuntu"
VERSION="16.04.6 LTS (Xenial Xerus)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.6 LTS"
VERSION_ID="16.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial
$ docker --version
Docker version 19.03.5, build 633a0ea838
$ docker-compose --version
docker-compose version 1.23.1, build b02f1306
```

## Usage

まず、Elasticsearch のために kernel option を変更しておく

```bash
$ sysctl -w vm.max_map_count=262144
```

各 container を起動

```bash
$ docker-compose up -d --build
```
