FROM node:16.14.0-slim

ENV PORT 3600

WORKDIR /srv

RUN apt-get update && apt-get install -y git dumb-init

RUN npm install -g serve

ADD package*.json .env.demo /srv/

RUN npm install

ADD . /srv

ENV REACT_APP_API_BASE=http://localhost:3500

RUN npm run build:demo:d

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

USER node

EXPOSE 3600

CMD  ["serve", "-s", "build", "-l", "3600"]
