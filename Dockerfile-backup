FROM node:lts-alpine

RUN apk add --no-cache python make g++

RUN mkdir -p /user/src/app && mkdir /user/src/app/js

WORKDIR /user/src/app

COPY ./package.json ./yarn.* ./

RUN yarn install --network-timeout 1000000 && yarn cache clean

COPY tsconfig.json ormconfig.js webpack.config.js index.html ./

COPY ./@types ./@types

COPY ./src ./src

RUN yarn tsc

RUN yarn webpack

EXPOSE 3000

CMD ["node","./js/server"]




