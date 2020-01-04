import { createConnection, Connection } from 'typeorm'
import refreshDBWithSeedData from './seed_all'

createConnection().then((connection: Connection) => {
  refreshDBWithSeedData(connection)
})
