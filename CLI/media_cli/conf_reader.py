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


def read_default_host():
    if "ES_HOST" in os.environ:
        return os.environ["ES_HOST"]

    if ES_CONF.exists():
        with ES_CONF.open(mode="r") as f:
            data = yaml.safe_load(f.read())
        if "es_host" in data:
            return data["es_host"]

    return DEFAULT_HOST


def read_default_port():
    if "ES_PORT" in os.environ:
        return os.environ["ES_PORT"]

    if ES_CONF.exists():
        with ES_CONF.open(mode="r") as f:
            data = yaml.safe_load(f.read())
        if "es_port" in data:
            return data["es_port"]

    return DEFAULT_PORT
