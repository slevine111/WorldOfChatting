FROM node:lts-alpine AS build
RUN apk --no-cache add --virtual builds-deps build-base python
WORKDIR /user/app
COPY ./package*.json  ./
#RUN npm audit
RUN npm ci
COPY tsconfig.json webpack.config.js package.json ./
COPY ./@types ./@types
COPY ./src ./src
RUN mkdir js public
RUN npm run tsc
RUN npm run webpack
RUN npm prune --production

FROM node:lts-alpine
WORKDIR /user/app
COPY index.html ormconfig.js package.json ./
RUN mkdir node_modules js public
RUN mkdir js/entities js/server js/bin
COPY --from=build  /user/app/node_modules ./node_modules
COPY --from=build  /user/app/public ./public
COPY --from=build  /user/app/js/entities ./js/entities
COPY --from=build  /user/app/js/server ./js/server
COPY --from=build  /user/app/js/bin ./js/bin
EXPOSE 3000
CMD ["node","./js/server"]



