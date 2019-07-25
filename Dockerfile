FROM node:lts-alpine

ENV PORT=3000

RUN mkdir -p /user/src/app/node_modules && chown -R node:node /user/src/app

WORKDIR /user/src/app

COPY ./package.json ./yarn.* /tmp/

USER node

RUN cd /tmp/ && yarn && yarn cache clean

RUN cd /user/src/app && ln -s /tmp/node_modules

COPY ./js .

EXPOSE 3000

CMD ["node","./server/index"]


