FROM node:lts-alpine

ENV PORT=3000

RUN mkdir -p /user/src/app && chown -R node:node /user/src/app

WORKDIR /user/src/app

COPY ./package.json ./yarn.* ./

USER node

RUN yarn && yarn cache clean

COPY . .

EXPOSE 3000

CMD ["yarn","run","server:watch"]




