#!/usr/bin/env python3
# coding: utf-8

from media_cli.conf_reader import read_conf

INDEX_SETTINGS = {
    "number_of_shards": read_conf("num_of_shards"),
    "number_of_replicas": read_conf("num_of_replicas")
}

INDEX_MAPPING = {
    "project": {
        "settings": INDEX_SETTINGS,
        "mappings": {
            "properties": {
                "name": {"type": "keyword"},
                "abbreviation": {"type": "keyword"},
                "start_date": {"type": "date"},
                "end_date": {"type": "date"}
            }
        }
    },
    "patient": {
        "settings": INDEX_SETTINGS,
        "mappings": {
            "properties": {
                "sex": {"type": "keyword"},
                "birth_date": {"type": "date"}
            }
        }
    },
    "project_patient": {
        "settings": INDEX_SETTINGS,
        "mappings": {
            "properties": {
                "project_id": {"type": "keyword"},
                "patient_id": {"type": "keyword"}
            }
        }
    },
    "data": {
        "settings": INDEX_SETTINGS,
        "mappings": {
            "properties": {
                "data_type": {"type": "keyword"},
                "project_patint_id": {"type": "keyword"},
                "sampling_date": {"type": "date"},
                "url": {"type": "keyword"},
                "metadata": {
                    "dynamic": True,
                    "properties": {}
                }
            }
        }
    },
}
