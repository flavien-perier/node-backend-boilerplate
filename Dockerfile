FROM node:lts-alpine

LABEL maintainer="Flavien PERIER <perier@flavien.cc>"
LABEL version="1.0"
LABEL description="NodeJs backend"

WORKDIR /app
COPY . .

RUN rm -Rf node_modules
RUN npm install
RUN npm run build
RUN rm -Rf node_modules
RUN npm install --production

EXPOSE 8080

CMD npm start
