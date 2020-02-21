FROM node:13-slim

ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

WORKDIR /opt/MeDIA_Web
COPY . .

RUN npm install

ENTRYPOINT ["tini", "--"]
CMD ["tail", "-f", "/dev/null"]
