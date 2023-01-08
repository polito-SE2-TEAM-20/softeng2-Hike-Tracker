FROM node:16.14.0-alpine

ENV PORT 3500

WORKDIR /srv

# RUN apt-get update && apt-get install -y git dumb-init
RUN apk add --no-cache git zip dumb-init

ADD package*.json tsconfig*.json nest-cli.json /srv/

RUN npm install

ADD . /srv

RUN npm run build

RUN mkdir -p /srv/uploads/gpx
RUN mkdir -p /srv/uploads/images

RUN chown -R node:node /srv/uploads

# copy demo hikes and images
RUN unzip /srv/demo/demo_uploads.zip -d /srv/uploads/
# load hut images
RUN node demo/demo-prep.js

HEALTHCHECK CMD node healthcheck.js localhost ${PORT} /healthcheck 200

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

USER node

CMD ["node", "dist/main"]
