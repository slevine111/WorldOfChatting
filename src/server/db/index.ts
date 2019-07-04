import connection from './connection'

function dbInit(refreshData: boolean): Promise<void> {
  return connection.then(async connection => {
    if (!connection.isConnected) {
      await connection.connect()
      if (!connection.isConnected) {
        throw new Error('connection failed')
      }
    }
    return connection.synchronize(refreshData)
  })
}

export default dbInit
