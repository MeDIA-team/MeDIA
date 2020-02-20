#!/usr/bin/env python3
# coding: utf-8
import argparse

from media_cli.conf_reader import read_all_index


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
        help="Load the data to specify the JSON file.",
        description="Load the data to specify the JSON file.")
    load_parser.set_defaults(subcommand="load")
    load_parser.add_argument("json_file",
                             help="Json file to insert",
                             metavar="JSON")

    validate_parser = subparsers.add_parser(
        "validate",
        help="Validate the JSON file to load.",
        description="Validate the JSON file to load.")
    validate_parser.set_defaults(subcommand="validate")
    validate_parser.add_argument("json_file",
                                 help="Json file to validate",
                                 metavar="JSON")

    search_parser = subparsers.add_parser(
        "search",
        help="Search for each document.",
        description="Search for each document.")
    search_parser.set_defaults(subcommand="search")
    search_parser.add_argument(
        "-i",
        "--index",
        choices=read_all_index(),
        required=True,
        help=f"Index type ({', '.join(read_all_index())})"
    )
    search_parser.add_argument(
        "-k",
        "--key",
        default="id",
        help="Key of the attribute to search"
    )
    search_parser.add_argument(
        "value",
        help="Value of the attribute to search"
    )

    delete_parser = subparsers.add_parser(
        "delete",
        help="Delete the document.",
        description="Delete the document.")
    delete_parser.set_defaults(subcommand="delete")
    delete_parser.add_argument(
        "-i",
        "--index",
        choices=read_all_index(),
        required=True,
        help=f"Index type ({', '.join(read_all_index())})"
    )
    delete_parser.add_argument(
        "document_id",
        help="Document ID to delete"
    )

    args = parser.parse_args()

    return args
