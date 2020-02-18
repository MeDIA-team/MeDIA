#!/usr/bin/env python3
# coding: utf-8
from media_cli.arg_parser import parse_args
from media_cli.conf_reader import read_default_host, read_default_port
from media_cli.elastic_search import delete_entry, load_json, query_data


def main():
    try:
        args = parse_args()
        if not hasattr(args, "subcommand"):
            print("Please use subcommands {load,query,delete}.\n"
                  "Try `media --help`")
            raise Exception("No subcommands error")
        host = read_default_host() if args.host is None else args.host
        port = read_default_port() if args.port is None else args.port
        print(f"Elasticsearch Host: {host}")
        print(f"Elasticsearch Port: {port}")
        if args.subcommand == "load":
            load_json(host, port, args.json_file)
        elif args.subcommand == "query":
            query_data(host, port, args.entity, args.key, args.value)
        elif args.subcommand == "delete":
            delete_entry(host, port, args.entity, args.id)
    except Exception:
        import sys
        sys.exit(1)


if __name__ == "__main__":
    main()
