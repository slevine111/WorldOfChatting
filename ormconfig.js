const { resolve } = require('path')
const { config } = require('dotenv')

config()
console.log(process.env.TEST_VARIABLE)

const commonFields = {
  type: 'postgres',
  host: process.env.DB_SERVICE_SERVICE_HOST,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD
}

module.exports = [
  {
    database: process.env.DATABASE,
    ...commonFields,
    entities: [resolve(__dirname, 'js', 'entities', '*.js')]
  },
  {
    name: 'seed',
    ...commonFields,
    database: process.env.DATABASE,
    entities: [resolve(__dirname, 'src', 'entities', '*.ts')]
  },
  {
    name: 'test',
    ...commonFields,
    database: process.env.DATABASE_TEST,
    entities: [resolve(__dirname, 'src', 'entities', '*.ts')]
  }
]
