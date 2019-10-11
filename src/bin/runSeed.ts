import { createConnection, Connection } from 'typeorm'
import refreshDBWithSeedData from './seed'

createConnection(
  process.env.SEED_LANGUAGE === 'typescript' ? 'seed' : 'default'
).then((connection: Connection) => {
  refreshDBWithSeedData(connection)
})
