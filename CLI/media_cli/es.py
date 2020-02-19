#!/usr/bin/env python3
# coding: utf-8

import sys
import traceback
from uuid import uuid4

import jsonschema
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError

from media_cli.conf_reader import (DATA_SCHEMA, check_and_resolve_file_path,
                                   load_json, load_yaml)
from media_cli.es_index_mapping import INDEX_MAPPING


def load_data(host, port, json_file):
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
      - hit_false: create 処理を行うとする
    """

    print("Start load data...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    json_file_path = check_and_resolve_file_path(json_file)
    schema_file_path = check_and_resolve_file_path(DATA_SCHEMA)
    _validate_json_file(json_file_path, schema_file_path)
    _create_not_existing_indices(client)

    data = load_json(json_file_path)
    for index, content_array in data.items():
        for ele in content_array:
            if ele["id"] != "":
                result = _search_by_id(client, index, ele["id"])
                if result is not None:
                    _update(client, index, ele)
                else:
                    _create(client, index, ele)
            else:
                result = _search_by_other(client, index, ele)
                if result is not None:
                    _update(client, index, ele)
                else:
                    ele["id"] = str(uuid4)
                    _create(client, index, ele)

    print("Finish load data...")


def _search_by_id(client, index, id):
    return None


def _search_by_other(client, index, ele):
    return None


def _update(client, index, ele):
    pass


def _create(client, index, ele):
    ele_id = ele["id"]
    del ele["id"]
    for key, value in ele.items():
        ele[key] = None if value == "" else value
    client.index(index=index, id=ele_id, body=ele)


def search_document(host, port, index, key, value):
    print("Start query document...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _create_not_existing_indices(client)

    print("Finish query document...")


def delete_document(host, port, index, document_id):
    print("Start delete document...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _create_not_existing_indices(client)

    print("Finish delete document...")


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
    if health["status"] == "red":
        print(f"[Error] Elasticsearch cluster's status is {health['status']}\n"
              "Please check your cluster (e.g. unassigned_shards)")
        sys.exit(1)


def _create_not_existing_indices(client):
    for index_name, mapping in INDEX_MAPPING.items():
        if client.indices.exists(index_name) is False:
            client.indices.create(index=index_name, body=mapping)


def _delete_index(client, index_name):
    client.indices.delete(index_name, ignore=[400, 404])


def _validate_json_file(job_file_path, schema_file_path):
    job = load_json(job_file_path)
    schema = load_yaml(schema_file_path)
    try:
        jsonschema.validate(instance=job, schema=schema)
    except Exception:
        print("[Error] An error occurred when validating the your JSON file.\n"
              "Please check traceback.")
        traceback.print_exc()
        sys.exit(1)
