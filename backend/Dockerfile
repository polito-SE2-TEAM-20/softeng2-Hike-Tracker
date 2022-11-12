FROM node:16.14.0-slim

ENV PORT 3500

WORKDIR /srv

RUN apt-get update && apt-get install -y git dumb-init

ADD package*.json tsconfig*.json nest-cli.json /srv/

RUN npm install

ADD . /srv

RUN npm run build

RUN mkdir -p /srv/uploads

RUN chown node:node /srv

HEALTHCHECK CMD node healthcheck.js localhost ${PORT} /healthcheck 200

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

USER node

CMD ["node", "dist/main"]
