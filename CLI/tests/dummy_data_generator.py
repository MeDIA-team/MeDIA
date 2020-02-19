#!/usr/bin/env python3
# coding: utf-8
"""
結構場当たり的な実装が多いコマンド
リファクタリングするかどうかは微妙なとこ

# Project
- とりあえず、ランダムで生成は無理
- dummy_data_project にそれっぽいのを作成した
- id は常に存在するものとする
- end_data が存在しない場合があるとする

# Patient
- ランダムで生成する
- id は常に存在するものとする
  - 存在しない場合は、cli を使う前の data を作る段階で付与すればいいのではないか
  - cli の search command で id が存在するかどうかを追うことも出来るはず
    - sex と birth date しか attr がないため、識別が難しいと思われる
    - そもそも個人情報を破棄したデータであるため識別が難しく、id をどこかでふるべきだと思われる
  - patient_id は 64ID とか AID と呼ばれるもの
    - string 型で適当に 16 進法 64 桁生成しておく
    - 2 ** 256 も人間は存在しないと思うが、、、

# Project * Patient
- Project と Patient から適当に抜き出して、生成する
- Project * Patient 数分生成する
- ID は Primary ID という形で管理していた
    - Project の abbreviation に対して連番の int を振っていくとする

# Data
- id はある場合と無い場合があるとする
  - uuid
  - ない場合は、CLI の方で発行する
- 全ての project_patient_id に対して生成する
- data_type は random.choice する、数は random
- sampling_date は project の start - end の間にする
- url はそれっぽいのを生成する
- metadata はどうすればいいか迷っている
"""

import hashlib
import json
import os
from calendar import monthrange
from datetime import date, timedelta
from pathlib import Path
from random import choice, randint, random, randrange, sample
from uuid import uuid4

from media_cli.conf_reader import DATA_SCHEMA
from media_cli.es import _validate_json_file

NUM_OF_PATIENT = 100
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_FILE_PATH = SCRIPT_DIR.joinpath("dummy_data.json")
PROJECT_LIST = SCRIPT_DIR.joinpath("project_list.json")
SEX = ["male", "female"]
SKIN_DISEASE = [
    "Atopic dermatitis",
    "Psoriasis",
    "Prurigo nodularis",
    "Other skin disease",
    "Healthy"
]
DATA_TYPE = [
    "Skin image",
    "Microbiome",
    "Cutometer",
    "RNAseq",
    "Medication data",
    "Genome",
    "Histology",
    "Clinical lab data",
    "Cytokine",
    "Nerve imaging"
]
LIBRARY_PREP = ["Kazusa", "Riken"]
BODY_REGION = ["Back", "Thigh", "Arm", "Others"]


def load_project_data():
    with PROJECT_LIST.open(mode="r") as f:
        return json.loads(f.read())["project"]


def convert_projects(projects):
    d_projects = dict()
    for p in projects:
        d_projects[p["id"]] = {
            "name": p["name"],
            "abbreviation": p["abbreviation"],
            "start_date": date(*map(int, p["start_date"].split("-"))),
            "end_date": date(2019, 12, 31) if p["end_date"] == ""
            else date(*map(int, p["end_date"].split("-")))
        }

    return d_projects


def generate_patient_data():
    patients = []
    for _ in range(NUM_OF_PATIENT):
        patient = {
            "id": _generate_patient_id(),
            "sex": choice(SEX),
            "birth_date": _generate_birth_date()
        }
        patients.append(patient)

    return patients


def _generate_birth_date():
    year = randint(1930, 2010)
    month = randint(1, 12)
    start, end = monthrange(year, month)
    day = randint(start + 1, end)

    return date(year, month, day).isoformat()


def _generate_patient_id():
    buf = ""
    while len(buf) < 64:
        buf += hashlib.md5(os.urandom(100)).hexdigest()

    return buf[0:64]


def generate_project_patient_data(d_projects, patients):
    results = []
    project_id_lists = list(d_projects.keys())
    for i in range(len(project_id_lists) * len(patients)):
        project_id = choice(project_id_lists)
        patient = choice(patients)
        project_patint_id = f"{d_projects[project_id]['abbreviation']}_{i}"
        pro_pat_result = {
            "id": project_patint_id,
            "project_id": project_id,
            "patient_id": patient["id"]
        }
        results.append(pro_pat_result)

    return results


def generate_data(d_projects, project_patient):
    results = []
    for pro_pat in project_patient:
        project_id = pro_pat["project_id"]
        project = d_projects[project_id]
        data_types = sample(DATA_TYPE, randint(0, len(DATA_TYPE)))
        for data_type in data_types:
            data = {
                "id": str(uuid4()) if random() <= 0.5 else "",
                "data_type": data_type,
                "project_patient_id": pro_pat["id"],
                "sampling_date":
                _random_date(project["start_date"],
                             project["end_date"]).isoformat(),
                "url": f"/data/{project_id}/{data_type}/{pro_pat['id']}.txt",
                "metadata": _generate_metadata(data_type)
            }
            results.append(data)

    return results


def _generate_metadata(data_type):
    metadata = {
        "checksum": hashlib.md5(os.urandom(100)).hexdigest()
    }
    if data_type == "RNAseq":
        metadata["Library prep"] = choice(LIBRARY_PREP)
    if data_type == "Skin image":
        metadata["Body region"] = choice(BODY_REGION)

    return metadata


def _random_date(start, end):
    delta = end - start
    random_days = randrange(delta.days)

    return start + timedelta(days=random_days)


def dump_data(projects, patients, project_patient, data):
    all_data = {
        "project": projects,
        "patient": patients,
        "project_patient": project_patient,
        "data": data
    }
    with OUTPUT_FILE_PATH.open(mode="w") as f:
        f.write(json.dumps(all_data,
                           indent=2,
                           ensure_ascii=False))


def main():
    projects = load_project_data()
    d_projects = convert_projects(projects)
    patients = generate_patient_data()
    project_patient = generate_project_patient_data(d_projects, patients)
    data = generate_data(d_projects, project_patient)
    dump_data(projects, patients, project_patient, data)
    _validate_json_file(OUTPUT_FILE_PATH, DATA_SCHEMA)


if __name__ == "__main__":
    main()
