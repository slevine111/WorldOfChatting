import { NestFactory } from '@nestjs/core'
import ApplicationModule from './app'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '.env') })

const bootstrap = async (): Promise<void> => {
  try {
    const app = await NestFactory.create(ApplicationModule)
    await app.listen(Number(process.env.PORT), () =>
      console.log(`listening on PORT ${process.env.PORT}`)
    )
  } catch (err) {
    console.log('app failed to connect for following reasons')
    console.error(err)
  }
}

bootstrap()
