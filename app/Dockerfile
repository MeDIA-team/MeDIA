FROM node:16.3.0-buster-slim

RUN apt update && \
  apt install -y --no-install-recommends \
  build-essential \
  curl \
  python-dev \
  tini \
  wait-for-it && \
  apt clean &&\
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

ENV PATH /app/node_modules/.bin:$PATH

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 8080
EXPOSE 8080

ENTRYPOINT ["tini", "--"]
CMD ["yarn", "start"]
