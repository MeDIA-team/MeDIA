FROM node:13-slim

# RUN apt update && \
#     apt install -y --no-install-recommends \
#     tini && \
#     apt clean &&\
#     rm -rf /var/lib/apt/lists/*

ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

WORKDIR /opt/MeDIA_Web
COPY . .
ENTRYPOINT ["tini", "--"]
CMD ["tail", "-f", "/dev/null"]
