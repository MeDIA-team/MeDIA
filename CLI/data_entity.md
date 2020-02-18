# MeDIA Data Entity

## Project

```json
[
  {
    "name": "string (e.g.Bleach bath)",
    "abbreviation": "string (e.g.ADc-KO)",
    "id": "string (e.g.ADc-KO9)",
    "start_date": "datetime (e.g.2016.04.01)",
    "end_date": "datetime (e.g.2017.04.30)"
  }
]
```

## Patient

```json
[
  {
    "id": "string (e.g.64ID or AID)",
    "sex": "string (e.g.male or female)",
    "birth_date": "datetime (e.g.1994.04.01)"
  }
]
```

## Project \* Patient

```json
[
  {
    "project_patint_id": "string",
    "project_id": "string (e.g.ADc-KO9)",
    "patient_id": "string (e.g.64ID or AID)"
  }
]
```

## Data

```json
[
  {
    "id": "uuid",
    "data_type": "string (e.g.RNA-seq)",
    "project_patint_id": "string",
    "sampling_date": "datetime (e.g.2016.04.01)",
    "url": "string (e.g./your/file/path)",
    "metadata": {
      "any (e.g.library_prep, body_region)": "any (e.g.kazusa, body_region)"
    }
  }
]
```
