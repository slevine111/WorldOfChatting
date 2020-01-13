import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { config } from 'dotenv'
import volleyball from 'volleyball'
import cookieParser from 'cookie-parser'
import ApplicationModule from './app'
import GlobalHttpExceptionFilter from './GlobalExceptionFilter'

if (process.env.LOAD_CONFIG_FILE === 'true') {
  config()
}

const bootstrap = async (): Promise<void> => {
  try {
    const app: NestExpressApplication = await NestFactory.create<
      NestExpressApplication
    >(ApplicationModule)
    app.useStaticAssets(join(__dirname, 'public'))
    app.use(volleyball)
    app.use(cookieParser())
    app.useGlobalFilters(new GlobalHttpExceptionFilter())
    await app.listen(<string>process.env.APP_PORT, () =>
      console.log(`listening on PORT ${process.env.APP_PORT}`)
    )
  } catch (err) {
    console.log('app failed to connect for following reasons')
    console.error(err)
  }
}

bootstrap()
