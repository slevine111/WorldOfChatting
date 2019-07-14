import { createConnection } from 'typeorm'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '..', '.env') })

export default createConnection({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORTDB),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [resolve(__dirname, 'entity/*.js')]
})
