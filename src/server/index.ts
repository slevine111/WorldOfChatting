import { NestFactory } from '@nestjs/core'
import {
  NestFastifyApplication,
  FastifyAdapter
} from '@nestjs/platform-fastify'
import { config } from 'dotenv'
import volleyball from 'volleyball'
import path from 'path'
import fastifycookie from 'fastify-cookie'
import fastifystatic from 'fastify-static'
import ApplicationModule from './app'
import GlobalHttpExceptionFilter from './GlobalExceptionFilter'

if (process.env.LOAD_CONFIG_FILE === 'true') {
  config()
}

const bootstrap = async (): Promise<void> => {
  try {
    const app: NestFastifyApplication = await NestFactory.create<
      NestFastifyApplication
    >(ApplicationModule, new FastifyAdapter())
    app.register(fastifystatic, {
      root: path.join(__dirname, '..', '..', 'public'),
      prefix: '/public/'
    })
    app.use(volleyball)
    app.register(fastifycookie)
    app.useGlobalFilters(new GlobalHttpExceptionFilter())
    await app.listen((process.env.APP_PORT as unknown) as number, () =>
      console.log(`listening on PORT ${process.env.APP_PORT}`)
    )
  } catch (err) {
    console.log('app failed to connect for following reasons')
    console.error(err)
  }
}

bootstrap()
