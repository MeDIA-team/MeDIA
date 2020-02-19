#!/usr/bin/env python3
# coding: utf-8
import sys

from media_cli.arg_parser import parse_args
from media_cli.conf_reader import read_conf
from media_cli.es import delete_document, load_data, search_document


def main():
    try:
        args = parse_args()
        if not hasattr(args, "subcommand"):
            print("[Error] Please use subcommands {load,search,delete}.\n"
                  "Try `media --help`")
            sys.exit(1)
        host = read_conf("host") if args.host is None else args.host
        port = read_conf("port") if args.port is None else args.port
        print(f"Elasticsearch Host: {host}")
        print(f"Elasticsearch Port: {port}")
        if args.subcommand == "load":
            load_data(host, port, args.json_file)
        elif args.subcommand == "search":
            search_document(host, port, args.index, args.key, args.value)
        elif args.subcommand == "delete":
            delete_document(host, port, args.index, args.document_id)
    except Exception:
        import sys
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
