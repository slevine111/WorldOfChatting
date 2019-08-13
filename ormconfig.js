const { resolve } = require('path')

const commonFields = {
  type: 'postgres',
  host: process.env.HOST,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD
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
