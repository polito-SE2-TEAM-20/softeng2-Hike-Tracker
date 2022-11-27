FROM node:16.14.0-slim

ARG PORT=3600
ENV PORT ${PORT}

WORKDIR /srv

RUN apt-get update && apt-get install -y git dumb-init

RUN npm install -g serve

ADD package*.json /srv/

RUN npm install

ADD . /srv

RUN npm run build

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

USER node

EXPOSE ${PORT}

CMD  ["serve", "-s", "build", "-l", "$PORT"]
