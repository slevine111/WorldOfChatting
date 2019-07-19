const { config } = require('dotenv')
const { resolve } = require('path')

config()

const commonFields = {
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT_DATABASE),
  username: process.env.USERNAME,
  password: process.env.PASSWORD
}

module.exports = [
  {
    database: process.env.DATABASE,
    ...commonFields,
    entities: [resolve(__dirname, 'js', 'server', 'db', 'entity', '*.js')]
  },
  {
    name: 'test',
    ...commonFields,
    database: process.env.DATABASE_TEST,
    entities: [resolve(__dirname, 'src', 'server', 'db', 'entity', '*.ts')]
  },
  {
    name: 'seed',
    ...commonFields,
    database: process.env.DATABASE,
    entities: [resolve(__dirname, 'src', 'server', 'db', 'entity', '*.ts')]
  }
]
