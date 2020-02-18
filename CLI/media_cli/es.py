#!/usr/bin/env python3
# coding: utf-8

import sys

from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError

from media_cli.es_index_mapping import INDEX_MAPPING


def load_json(host, port, json_file):
    print("Start load json...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _generate_indices(client)

    print("Finish load json...")


def query_entry(host, port, entity, key, value):
    print("Start query entry...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _generate_indices(client)

    print("Finish query entry...")


def delete_entry(host, port, entity, entry_id):
    print("Start delete entry...")
    client = _generate_client(host, port)
    _check_es_connection(client)
    _check_cluster_status(client)
    _generate_indices(client)

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


def _generate_indices(client):
    for index_name, mapping in INDEX_MAPPING.items():
        if client.indices.exists(index_name) is False:
            client.indices.create(index=index_name, body=mapping)


def _delete_index(client, index_name):
    client.indices.delete(index_name, ignore=[400, 404])
