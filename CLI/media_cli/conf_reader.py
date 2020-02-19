#!/usr/bin/env python3
# coding: utf-8
"""
Priority:
1. Command Argument (do in main.py)
2. Environment Variable
3. Conf YAML
4. Defalt Value in This File
"""

import json
import os
import sys
from pathlib import Path

import yaml

BASE_DIR = Path(__file__).resolve().parent.parent
MODULE_DIR = Path(__file__).resolve().parent
ES_CONF = BASE_DIR.joinpath("es_conf.yml")
DATA_SCHEMA = MODULE_DIR.joinpath("data_schema.yml")

DEFAULT_VALUE = {
    "host": "localhost",
    "port": 9200,
    "num_of_shards": 5,
    "num_of_replicas": 1
}


def read_conf(key_name):
    env_key = "ES_" + key_name.upper()
    if env_key in os.environ:
        return os.environ[env_key]

    if ES_CONF.exists():
        data = load_yaml(ES_CONF)
        if key_name in data:
            return data[key_name]

    return DEFAULT_VALUE.get(key_name, None)


def check_and_resolve_file_path(str_path):
    path = Path(str_path).resolve()
    if path.exists() is False:
        print(f"[Error] Your JSON file {path} does not exist.")
        sys.exit(1)

    return path


def load_yaml(yaml_file_path):
    with yaml_file_path.open(mode="r") as f:
        data = yaml.safe_load(f)

    return data


def load_json(json_file_path):
    with json_file_path.open(mode="r") as f:
        data = json.loads(f.read())

    return data


def read_all_index():
    schema_file_path = check_and_resolve_file_path(DATA_SCHEMA)

    return load_yaml(schema_file_path)["properties"].keys()
