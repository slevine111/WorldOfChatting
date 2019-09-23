import { Connection } from 'typeorm'

declare global {
  namespace NodeJS {
    interface Global {
      __POSTGRES__: Connection
    }
  }
}

export default async () => {
  await global.__POSTGRES__.close()
}
