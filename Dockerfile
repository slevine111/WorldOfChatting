FROM node:lts-alpine

RUN mkdir -p /user/src/app && mkdir /user/src/app/js

WORKDIR /user/src/app

COPY ./package.json ./yarn.* ./

RUN yarn install --network-timeout 1000000 && yarn cache clean

COPY tsconfig.json ormconfig.js nodemon.json ./

COPY ./src ./src

#RUN yarn run build

EXPOSE 3000

CMD ["yarn","run","server:watch"]




