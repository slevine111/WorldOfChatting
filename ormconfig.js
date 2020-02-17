const { resolve } = require('path')
const { config } = require('dotenv')

if (process.env.LOAD_CONFIG_FILE === 'true') {
  config()
}

const commonFields = {
  type: 'postgres',
  host: process.env.DB_SERVICE_SERVICE_HOST,
  port: process.env.DB_SERVICE_SERVICE_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
}

module.exports = [
  {
    database: process.env.DATABASE_NAME,
    ...commonFields,
    entities: [resolve(__dirname, 'js', 'entities', '*.js')]
  },
  {
    name: 'test',
    ...commonFields,
    database: process.env.TEST_DATABASE_NAME,
    entities: [resolve(__dirname, 'src', 'entities', '*.ts')]
  }
]
