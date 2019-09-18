const { resolve } = require('path')
const { config } = require('dotenv')

config()

const {
  DB_SERVICE_SERVICE_HOST,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  DATABASE,
  DATABASE_TEST,
  NODE_ENV
} = process.env
const commonFields = {
  type: 'postgres',
  host: DB_SERVICE_SERVICE_HOST,
  port: 5432,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD
}

module.exports = [
  {
    database: DATABASE,
    ...commonFields,
    entities: [resolve(__dirname, 'js', 'server', 'db', 'entity', '*.js')]
  },
  {
    name: 'test',
    ...commonFields,
    database: DATABASE_TEST,
    entities: [resolve(__dirname, 'src', 'server', 'db', 'entity', '*.ts')]
  }
]
