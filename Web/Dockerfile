FROM node:13.10.1

ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

RUN apt update && \
    apt install -y --no-install-recommends \
    build-essential \
    python-dev \
    curl && \
    apt clean &&\
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt/MeDIA_Web

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 8080
EXPOSE 8080

ENTRYPOINT ["tini", "--"]
CMD ["npm", "run", "start"]
