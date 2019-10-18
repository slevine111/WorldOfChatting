FROM node:lts-alpine AS base
RUN apk --no-cache add --virtual builds-deps build-base python
#RUN apk add --no-cache python make g++
RUN mkdir -p /user/src/app
WORKDIR /user/src/app
COPY ./package*.json  ./

FROM base as test-install
RUN npm install
COPY tsconfig.json jest.config.js ./
CMD ["sh","-c","echo 'hello'"]

FROM test-install as after-install

COPY


#&& yarn cache clean

#COPY tsconfig.json jest.config.js ./

#COPY ./@types ./@types

#COPY ./src ./src

#COPY ./tests-fake ./tests-fake


#CMD ["yarn","run","test"]
