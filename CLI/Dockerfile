FROM python:3.6-slim

RUN apt update && \
    apt install -y --no-install-recommends \
    tini && \
    apt clean &&\
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt/MeDIA_CLI
COPY . .
ENTRYPOINT ["tini", "--"]
CMD ["tail", "-f", "/dev/null"]
