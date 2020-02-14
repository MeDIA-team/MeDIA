#!/usr/bin/env python3
# coding: utf-8
from pathlib import Path

from setuptools import find_packages, setup

BASE_DIR = Path(__file__).parent.resolve()
REQUIREMNTS_TEXT = BASE_DIR.joinpath("requirements.txt")


def read_requirements_txt():
    with REQUIREMNTS_TEXT.open(mode="r") as f:
        packages = [line for line in f.read().splitlines() if line != ""]

    return packages


def main():
    setup(name="media_cli",
          version="1.0.0",
          description="",
          author="",
          author_email="",
          url="",
          license="",
          platforms="any",
          zip_safe=False,
          classifiers=["Programming Language :: Python"],
          packages=find_packages(),
          install_requires=read_requirements_txt(),
          include_package_data=True,
          entry_points={
              "console_scripts": [
                    "media = media_cli.main:main",
              ]
          }
          )


if __name__ == "__main__":
    main()
