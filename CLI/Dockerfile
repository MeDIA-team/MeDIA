FROM python:3.7-slim

RUN apt update && \
    apt install -y --no-install-recommends \
    build-essential \
    curl \
    tini && \
    apt clean &&\
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt/MeDIA_CLI
COPY . .

# RUN pip install -U pip wheel setuptools && \
#     python3 setup.py install

RUN pip install -U pip wheel setuptools && \
    python3 setup.py develop

ENTRYPOINT ["tini", "--"]
CMD ["tail", "-f", "/dev/null"]
