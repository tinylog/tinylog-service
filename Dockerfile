FROM node:8.6-alpine
MAINTAINER ruiming <ruiming.zhuang@gmail.com>

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn
COPY ./ ./

RUN yarn run build

EXPOSE 8000
ENTRYPOINT node ./build/tasks/data.js
