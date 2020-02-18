#!/usr/bin/env python3
# coding: utf-8
from media_cli.arg_parser import parse_args
from media_cli.conf_reader import read_default_host, read_default_port
from media_cli.es import delete_entry, load_json, query_entry
import sys


def main():
    try:
        args = parse_args()
        if not hasattr(args, "subcommand"):
            print("[Error] Please use subcommands {load,query,delete}.\n"
                  "Try `media --help`")
            sys.exit(1)
        host = read_default_host() if args.host is None else args.host
        port = read_default_port() if args.port is None else args.port
        print(f"Elasticsearch Host: {host}")
        print(f"Elasticsearch Port: {port}")
        if args.subcommand == "load":
            load_json(host, port, args.json_file)
        elif args.subcommand == "query":
            query_entry(host, port, args.entity, args.key, args.value)
        elif args.subcommand == "delete":
            print(args)
            delete_entry(host, port, args.entity, args.entry_id)
    except Exception:
        import sys
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
