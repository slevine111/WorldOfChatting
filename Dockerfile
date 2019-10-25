FROM node:lts-alpine AS install-dependencies
RUN apk --no-cache add --virtual builds-deps build-base python
WORKDIR /user/src/app
COPY ./package*.json  ./
RUN npm audit
RUN npm ci --only=production

FROM node:lts-alpine AS build
WORKDIR /user/src/app
RUN mkdir node_modules js public
COPY --from=install-dependencies  /user/src/app/node_modules ./node_modules
COPY tsconfig.json webpack.config.js package.json ./
COPY ./@types ./@types
COPY ./src ./src
RUN npm run tsc
RUN npm run webpack

FROM node:lts-alpine
WORKDIR /user/src/app
COPY index.html ormconfig.js ./
RUN mkdir node_modules js public
RUN mkdir js/entities js/server
COPY --from=build  /user/src/app/node_modules ./node_modules
COPY --from=build  /user/src/app/public ./public
COPY --from=build  /user/src/app/js/entities ./js/entities
COPY --from=build  /user/src/app/js/server ./js/server
CMD ["node","./js/server"]



