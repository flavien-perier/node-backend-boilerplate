FROM node:lts-alpine as builder

LABEL maintainer="Flavien PERIER <perier@flavien.io>"
LABEL version="1.0"
LABEL description="NodeJs backend"


WORKDIR /opt/app
COPY . .

RUN rm -Rf node_modules
RUN npm install && \
    npm run build && \
    chmod -R 750 /opt/app
RUN rm -Rf node_modules
RUN npm install --production

FROM node:lts-alpine

ARG DOCKER_UID=500
ARG DOCKER_GID=500

WORKDIR /opt/app

COPY --from=builder /opt/app .

RUN addgroup -g $DOCKER_GID app && \
    adduser -G app -D -H -h /opt/app -u $DOCKER_UID app && \
    chown -R app:app /opt/app

USER app
EXPOSE 8080

CMD npm start
