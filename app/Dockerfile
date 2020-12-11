FROM node:15.2.1-stretch-slim

ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

RUN apt update && \
    apt install -y --no-install-recommends \
    build-essential \
    curl \
    python-dev \
    wait-for-it && \
    apt clean &&\
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# COPY package*.json yarn.lock ./
# RUN yarn install

# COPY . .

# RUN yarn build

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 8080
EXPOSE 8080

ENTRYPOINT ["tini", "--"]
# CMD ["yarn", "start"]
CMD ["sleep", "infinity"]
