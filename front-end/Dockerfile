FROM node:16.14.0-slim

ENV PORT 3600

WORKDIR /srv

RUN apt-get update && apt-get install -y git dumb-init

ADD package*.json /srv/

RUN npm run build

ADD . /srv

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

USER node

EXPOSE 3600

CMD  ["serve", "-s", "build", "-l", "3600"]
