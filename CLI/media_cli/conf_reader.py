#!/usr/bin/env python3
# coding: utf-8
"""
Priority:
1. Command Argument (do in main.py)
2. Environment Variable
3. Conf YAML
4. Defalt Value in This File
"""

import os
from pathlib import Path

import yaml

BASE_DIR = Path(__file__).resolve().parent.parent
ES_CONF = BASE_DIR.joinpath("es_conf.yml")

DEFAULT_HOST = "localhost"
DEFAULT_PORT = 9200
DEFAULT_NUM_OF_SHARDS = 5
DEFAULT_NUM_OF_REPLICAS = 1


def read_default_host():
    if "ES_HOST" in os.environ:
        return os.environ["ES_HOST"]

    if ES_CONF.exists():
        with ES_CONF.open(mode="r") as f:
            data = yaml.safe_load(f.read())
        if "host" in data:
            return data["host"]

    return DEFAULT_HOST


def read_default_port():
    if "ES_PORT" in os.environ:
        return os.environ["ES_PORT"]

    if ES_CONF.exists():
        with ES_CONF.open(mode="r") as f:
            data = yaml.safe_load(f.read())
        if "port" in data:
            return data["port"]

    return DEFAULT_PORT


def read_number_of_shards():
    if ES_CONF.exists():
        with ES_CONF.open(mode="r") as f:
            data = yaml.safe_load(f.read())
        if "num_of_shards" in data:
            return data["num_of_shards"]

    return DEFAULT_NUM_OF_SHARDS


def read_number_of_replicas():
    if ES_CONF.exists():
        with ES_CONF.open(mode="r") as f:
            data = yaml.safe_load(f.read())
        if "num_of_replicas" in data:
            return data["num_of_replicas"]

    return DEFAULT_NUM_OF_REPLICAS
