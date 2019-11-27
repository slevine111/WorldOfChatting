import { createConnection, Connection } from 'typeorm'
import refreshDBWithSeedData from './seed'

createConnection().then((connection: Connection) => {
  refreshDBWithSeedData(connection)
})
