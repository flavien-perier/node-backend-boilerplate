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

ARG DOCKER_UID="500"
ARG DOCKER_GID="500"

ENV NODE_ENV="production"
ENV NODE_ID=""
ENV PORT="8080"
ENV LOG="debug"
ENV SALT="salt"
ENV JWT_TOKEN="jwttoken"
ENV REDIS_URL="redis://:password@redis:6379"
ENV POSTGRES_URL="psql://admin:password@postgres:5432/admin"

WORKDIR /opt/app
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/build ./build
COPY --from=builder /opt/app/swagger.yaml ./swagger.yaml
COPY --from=builder /opt/app/configuration.yaml ./configuration.yaml
COPY --from=builder /opt/app/package.json ./package.json
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/LICENSE ./LICENSE

RUN addgroup -g $DOCKER_GID app && \
    adduser -G app -D -H -h /opt/app -u $DOCKER_UID app && \
    chown -R app:app /opt/app

USER app

EXPOSE 8080

CMD npm start
