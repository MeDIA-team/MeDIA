#!/usr/bin/env python3
# coding: utf-8
import argparse

ENTITY_TYPE = ["project", "patient", "project_patient", "data"]


def parse_args():
    parser = argparse.ArgumentParser(
        description="CLI tool for operating Elasticsearch of MeDIA.")
    parser.add_argument("-H",
                        "--host",
                        help="Elasticsearch's host",
                        metavar="HOST")
    parser.add_argument("-p",
                        "--port",
                        type=int,
                        help="Elasticsearch's port",
                        metavar="PORT")

    subparsers = parser.add_subparsers()

    load_parser = subparsers.add_parser(
        "load",
        help="Insert the data to specify the JSON file.",
        description="Insert the data to specify the JSON file.")
    load_parser.set_defaults(subcommand="load")
    load_parser.add_argument("json_file",
                             help="Json file to insert",
                             metavar="JSON")

    query_parser = subparsers.add_parser(
        "query",
        help="Search the data for each entity.",
        description="Search the data for each entity.")
    query_parser.set_defaults(subcommand="query")
    query_parser.add_argument(
        "-e",
        "--entity",
        choices=ENTITY_TYPE,
        required=True,
        help=f"Entity type ({', '.join(ENTITY_TYPE)})"
    )
    query_parser.add_argument(
        "-k",
        "--key",
        default="id",
        help="Key of the attribute to query"
    )
    query_parser.add_argument(
        "value",
        help="Value of the attribute to query"
    )

    delete_parser = subparsers.add_parser(
        "delete",
        help="Delete the data for each entity.",
        description="Delete the data for each entity.")
    delete_parser.set_defaults(subcommand="delete")
    delete_parser.add_argument(
        "-e",
        "--entity",
        choices=ENTITY_TYPE,
        required=True,
        help=f"Entity type ({', '.join(ENTITY_TYPE)})"
    )
    delete_parser.add_argument(
        "id",
        help="ID to delete"
    )

    args = parser.parse_args()

    return args
