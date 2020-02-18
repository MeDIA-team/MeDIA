#!/usr/bin/env python3
# coding: utf-8

import sys
import yaml
from pathlib import Path
import jsonschema
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError
import traceback
from media_cli.es_index_mapping import INDEX_MAPPING


MODULE_DIR = Path(__file__).resolve().parent
DATA_SCHEMA = MODULE_DIR.joinpath("data_schema.yml")


def load_json(host, port, json_file):
    """
    Bulk API は replace が行われる場合があるため、使用しない

    基本的に data_json は、
    (1) id と other attr の両方が存在するデータと、
    (2) other attr のみが存在するデータ
    が存在するとする。
    (1) の場合、id を用いて検索し、
      - exists_true: update 処理
      - exists_false: create 処理
    を行うとする。
    (2) の場合、other attr を用いて検索し、
      - hit_true: update 処理
      - exists_false: create 処理を行うとする
    """

    print("Start load json...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    json_file_path = _check_and_resolve_file_path(json_file)
    schema_file_path = _check_and_resolve_file_path(DATA_SCHEMA)
    _validate_json_file(json_file_path, schema_file_path)
    _create_not_existing_indices(client)

    with json_file_path.open(mode="r") as f:
        data = yaml.safe_load(f.read())
    for index_name, content_array in data.items():
        pass

    print("Finish load json...")


def query_entry(host, port, entity, key, value):
    print("Start query entry...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _create_not_existing_indices(client)

    print("Finish query entry...")


def delete_entry(host, port, entity, entry_id):
    print("Start delete entry...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _create_not_existing_indices(client)

    print("Finish delete entry...")


def _generate_client(host, port):
    return Elasticsearch([f"{host}:{port}"])


def _check_es_connection(client):
    try:
        client.info()
    except ConnectionError:
        print("[Error] Elasticsearch Connection Error\n"
              "Please check like: curl -X GET your_host:your_port/")
        raise sys.exit(1)


def _check_cluster_status(client):
    health = client.cluster.health()
    if health["status"] != "green":
        print(f"[Error] Elasticsearch cluster's status is {health['status']}\n"
              "Please check your cluster (e.g. unassigned_shards)")
        sys.exit(1)


def _create_not_existing_indices(client):
    for index_name, mapping in INDEX_MAPPING.items():
        if client.indices.exists(index_name) is False:
            client.indices.create(index=index_name, body=mapping)


def _delete_index(client, index_name):
    client.indices.delete(index_name, ignore=[400, 404])


def _check_and_resolve_file_path(str_path):
    path = Path(str_path).resolve()
    if path.exists() is False:
        print(f"[Error] Your JSON file {path} does not exist.")
        sys.exit(1)

    return path


def _validate_json_file(job_file_path, schema_file_path):
    with job_file_path.open(mode="r") as f_j:
        job = yaml.safe_load(f_j)
    with schema_file_path.open(mode="r") as f_s:
        schema = yaml.safe_load(f_s)
    try:
        jsonschema.validate(instance=job, schema=schema)
    except Exception:
        print("[Error] An error occurred when validating the your JSON file.\n"
              "Please check traceback.")
        traceback.print_exc()
        sys.exit(1)
