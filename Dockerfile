FROM node:lts-alpine

RUN mkdir -p /user/src/app

WORKDIR /user/src/app

COPY ./package.json ./yarn.* ./

RUN yarn install --network-timeout 1000000 && yarn cache clean

COPY . .

EXPOSE 3000

CMD ["node","./js/server"]




