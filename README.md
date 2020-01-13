# World Of Chatting

World Of Chatting is an app for people to learn languages from each other. When you sign up, you pick languages that you want to learn and languages you are fluent in and want to help other people learn. After logging in, it will be a chat app with it only showing people from languages you either signed up to learn or teach.

Deployed app is at https://worldofchatting.devspace.host/#/

(App is still very much in development)

_Tech Stack_

- **backend**: Typescript, Node, NextJS, TypeORM, Redis, PostgreSQL
- **frontend**: Typescript, React, Redux, Redux-Thunk, Material-UI
- **tooling/deployment**: Docker, Kubernetes, CircleCI, Devspace Cloud, Jest (testing currently limited)

## Setup

**Install OS level dependencies**

- Node
- PostgreSQL
- Redis
  - Code proceeds with assumption that Redis is password-protected. If you don't change redis.conf file to add password (set to value you use for REDIS_PASSWORD environmnet variable), app will still work, you will just following line on terminal - "node_redis: Warning: Redis server does not require a password, but a password was supplied."

**Create .env file**

Create .env file using the sample.env file as a guide. Variables with values after equals sign are values believed likely to keep. Also keep name of file .env so works with dotenv package. Do this step before the next step so environment variables are in place for seeding the data.

**Install app requirements**

Run following on command line to install packages, create databases for running app and testing, seed data, and create js folder for compiled typescript to go into (tsconfig.json expects folder to be named js).

```
createdb [whatever you set environment variable DATABASE equal to]
createdb [whatever you set environment variable DATABASE_TEST equal to]
npm install
npm run initialize
```

## Running & Testing App

**Steps to start app locally**

1. Run one of two scripts
   - `npm run start:local:dev` - this script starts server, compiles typescript in watch mode, and watches for changes in resulting js frontend and backend code
   - `npm start:local` - this script compiles the typescript and then runs the server, both in non-watch mode
2. Go to http://localhost:[process.env.PORT]
3. Create account or login as user of seed data
   - login as email = 'manderson@gmail.com', password = '123' to best interact with app
4. Enjoy!

**Using Deployed App**

The deployed app also has been initialized with the seed data so it is best to use the deployed app if you just want to view the app

**Running Test**

Run `npm run test` to run tests for app. Command will seed data for tests.

**Other Scripts To Use**

- `npm run seed`: reseed data
