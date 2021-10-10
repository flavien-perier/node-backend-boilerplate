FROM node:lts-alpine as builder

WORKDIR /opt/app
COPY . .

RUN apk add --no-cache python3 gcc g++ make && \
    npm install && \
    npm run build && \
    rm -Rf node_modules && \
    npm install --production

FROM node:lts-alpine

LABEL maintainer="Flavien PERIER <perier@flavien.io>" \
      version="1.0.0" \
      description="NodeJs backend"

ARG DOCKER_UID="500" \
    DOCKER_GID="500"

ENV NODE_ENV="production" \
    NODE_ID="" \
    PORT="8080" \
    LOG="debug" \
    SALT="salt" \
    JWT_TOKEN="jwttoken" \
    REDIS_URL="redis://:password@redis:6379" \
    POSTGRES_URL="psql://admin:password@postgres:5432/admin"

WORKDIR /opt/app

RUN addgroup -g $DOCKER_GID app && \
    adduser -G app -D -H -h /opt/app -u $DOCKER_UID app

COPY --from=builder --chown=app:app /opt/app/dist ./dist
COPY --from=builder --chown=app:app /opt/app/build ./build
COPY --from=builder --chown=app:app /opt/app/swagger.yaml ./swagger.yaml
COPY --from=builder --chown=app:app /opt/app/configuration.yaml ./configuration.yaml
COPY --from=builder --chown=app:app /opt/app/package.json ./package.json
COPY --from=builder --chown=app:app /opt/app/node_modules ./node_modules
COPY --from=builder --chown=app:app /opt/app/LICENSE ./LICENSE

USER app

EXPOSE 8080

CMD npm start
