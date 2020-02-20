# MeDIA CLI

- ストレージから収集したデータを Elasticsearch に投入するための CLI Tool

Python Container Base Image として `python:3.6-slim` を使っている。

- 投入したい data を JSON 形式でまとめた後、この CLI Tool を用いて Elasticsearch に投入する
  - 機関や Project、Data Type に応じて、Crawl の方法が異なるため、それぞれに適した言語で JSON 形式の data を作成する方が効率かつ柔軟にデータの投入が行える
  - Data は ID が振られていないケースが存在するため、ID 管理を自動で行う
  - Elasticsearch の bulk API は document の update ではなく replace が行われるため、意図しないデータの削除の恐れがある。そのため、この CLI Tool は update のみを行うように設計されている

## Settings

`media` command を用いて諸々の処理を行う。

Host Server に直接 Install したい場合は、以下を実行する。

```bash
$ python3 setup.py install
```

---

Elasticsearch の諸々の設定は以下の優先度で使用される。

1. Command Argument
2. Environment Variable
3. Conf YAML (at `./es_conf.yml`)
4. Defalt Value (e.g. `localhost`, `9200`)

Environment Variable は、`../docker-compose.yml` の environment において指定している。

```yaml
environment:
  ES_HOST: "db"
  ES_PORT: 9200
  ES_NUM_OF_SHARDS: 1 # TODO for development
  ES_NUM_OF_REPLICAS: 0 # TODO for development
```

## Usage

以下の 4 つの Subcommand を実装している。

- load
  - JSON 形式の data を指定して、Elasticsearch に data を投入する
- validate
  - JSON 形式の data の validate を行う
- search
  - それぞれの index の ID などを指定して検索を行う
- delete
  - それぞれの index の ID などを指定して document の削除を行う

```bash
$ media --help
usage: media [-h] [-H HOST] [-p PORT] {load,validate,search,delete} ...

CLI tool for operating Elasticsearch of MeDIA.

positional arguments:
  {load,validate,search,delete}
    load                Load the data to specify the JSON file.
    validate            Validate the JSON file to load.
    search              Search for each document.
    delete              Delete the document.

optional arguments:
  -h, --help            show this help message and exit
  -H HOST, --host HOST  Elasticsearch's host
  -p PORT, --port PORT  Elasticsearch's port
```

### Load

JSON 形式の data を指定して、Elasticsearch に data を投入する。

```bash
$ media load --help
usage: media load [-h] JSON

Load the data to specify the JSON file.

positional arguments:
  JSON        Json file to insert

optional arguments:
  -h, --help  show this help message and exit
```

Example:

```bash
$ media load ./data/your_data.json
```

Elasticsearch の bulk API は document の update ではなく replace が行われるため使用していない。そのため、それぞれの Data の Load は以下の手順で行われる。

```
(1) ID とその他の Attribute の両方が存在するデータと、
(2) その他の Attribute のみが存在するデータ
が存在するとする。
(1) の場合、id を用いて検索し、
  - exists_true: update 処理
  - exists_false: create 処理
(2) の場合、その他の Attribute を用いて検索し、
  - hit_true: update 処理
  - hit_false: create 処理
```

### Validate

JSON 形式の data の validate を行う。

```bash
$ media validate --help
usage: media validate [-h] JSON

Validate the JSON file to load.

positional arguments:
  JSON        Json file to validate

optional arguments:
  -h, --help  show this help message and exit
```

Example:

```bash
$ media validate ./data/your_data.json
```

Schema は `./media_cli/data_schema.yml` に jsonschema 形式で記述している。また、Elasticsearch の index 定義として `./media_cli/es_index_mapping.py` が存在する。そのため、Schema を編集する際は、それぞれの file の編集が必要である。

単純な document としての定義は `./data_entity.md` に記載している。

### Search

それぞれの index の ID などを指定して検索を行う。

```bash
$ media search --help
usage: media search [-h] -i {project,patient,project_patient,data} [-k KEY]
                    value

Search for each document.

positional arguments:
  value                 Value of the attribute to search

optional arguments:
  -h, --help            show this help message and exit
  -i {project,patient,project_patient,data}, --index {project,patient,project_patient,data}
                        Index type (project, patient, project_patient, data)
  -k KEY, --key KEY     Key of the attribute to search
```

Example:

```bash
# Project ID を指定しての検索
$ media search -i project RCD
Elasticsearch Host: db
Elasticsearch Port: 9200
Start query document...
Index: project
Key: id
Value: RCD
{'abbreviation': 'U',
 'end_date': '2014-12-31',
 'name': 'Retrospective clinical data',
 'start_date': '2012-01-01'}
Finish query document...

# Data ID を指定しての検索
$ media search -i data 8ea5c317-4ec8-4aa5-8bd6-8b918d69180b
Elasticsearch Host: db
Elasticsearch Port: 9200
Start query document...
Index: data
Key: id
Value: 8ea5c317-4ec8-4aa5-8bd6-8b918d69180b
{'data_type': 'Cutometer',
 'metadata': {'checksum': 'e127efcf1b786954ac8571bb0fec65b9'},
 'project_patient_id': 'U_324',
 'sampling_date': '2012-07-22',
 'url': '/data/RCD/Cutometer/U_324.txt'}
Finish query document...

# Project Patient ID を指定して Data の検索
$ media search -i data -k project_patient_id U_324
Elasticsearch Host: db
Elasticsearch Port: 9200
Start query document...
Index: data
Key: project_patient_id
Value: U_324
{'hits': [{'_id': 'ac8a07c0-e056-4a69-91f6-e0579ab70f13',
           '_index': 'data',
           '_score': 7.131824,
           '_source': {'data_type': 'Cytokine',
                       'metadata': {'checksum': '5ef823b8e69b31a7975091110f771420'},
                       'project_patient_id': 'U_324',
                       'sampling_date': '2012-02-25',
                       'url': '/data/RCD/Cytokine/U_324.txt'},
           '_type': '_doc'},
          {'_id': '8ea5c317-4ec8-4aa5-8bd6-8b918d69180b',
           '_index': 'data',
           '_score': 7.131824,
           '_source': {'data_type': 'Cutometer',
                       'metadata': {'checksum': 'e127efcf1b786954ac8571bb0fec65b9'},
                       'project_patient_id': 'U_324',
                       'sampling_date': '2012-07-22',
                       'url': '/data/RCD/Cutometer/U_324.txt'},
           '_type': '_doc'}],
 'max_score': 7.131824,
 'total': {'relation': 'eq', 'value': 2}}
Finish query document...
```

### Delete

それぞれの index の ID などを指定して document の削除を行う。

```bash
$ media delete --help
usage: media delete [-h] -i {project,patient,project_patient,data} document_id

Delete the document.

positional arguments:
  document_id           Document ID to delete

optional arguments:
  -h, --help            show this help message and exit
  -i {project,patient,project_patient,data}, --index {project,patient,project_patient,data}
                        Index type (project, patient, project_patient, data)
```

Example:

```bash
$ media delete -i data 8ea5c317-4ec8-4aa5-8bd6-8b918d69180b
```

## Test

データ投入における結合テストとして、

- `./tests/dummy_data_generator.py`
  - `dummy_data.json` を生成するためのスクリプト
- `./tests/project_list.json`
  - dummy data として使用する Project の List
- `./tests/dummy_data.json`
  - 実際の JSON 形式の dummy data

のそれぞれの file を用いて行った。

ダミーデータ生成アルゴリズムとして、

```
# Project
- project_list.json に記載
- id は常に存在するものとする
- end_data が存在しない場合がある

# Patient
- ランダムで生成する
- id は常に存在するものとする

# Project * Patient
- 生成した Project と Patient を組み合わせて生成する
- ID は Project の abbreviation に対して連番の int を振っていく

# Data
- ID は存在する場合と存在しない場合がある
  - ID として UUID4 を使用
  - 存在しない場合は、MeDIA CLI にて発行する
- 全ての Project * Patient に対して生成する
- data_type は、前もって作成した List から選択する
- sampling_date は、Project の start_date - end_data の間である
- url は Project などに基づいて生成する
```

実行方法として

```bash
# dummy_data.json が生成される。現状だと既に用意しているため必要ない処理
$ python3 dummy_data_generator.py

# 実際に Elasticsearch に load する
$ media load ./dummy_data.json
```

### Development Tips

isort, flake8 での lint を行っている。

```bash
# isort
$ pip3 install isort
$ isort

or

$ python3 setup.py isort # Only Python>=3.7

# flake8
$ python3 setup.py flake8
```

---

setuptools の develop mode での開発

```bash
# Install
$ python3 setup.py develop

# Uninstall
$ python setup.py develop --uninstall
```
