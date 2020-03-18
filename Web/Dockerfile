FROM node:13.10.1

RUN apt update && \
    apt install -y --no-install-recommends \
    build-essential \
    python-dev \
    curl && \
    apt clean &&\
    rm -rf /var/lib/apt/lists/*

ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

WORKDIR /opt/MeDIA_Web
COPY . .

RUN npm install && \
    npm run build

ENTRYPOINT ["tini", "--"]
CMD ["npm", "run", "start"]
