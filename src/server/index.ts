import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import ApplicationModule from './app'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import GlobalHttpExceptionFilter from './GlobalExceptionFilter'

const bootstrap = async (): Promise<void> => {
  try {
    const app: NestExpressApplication = await NestFactory.create<
      NestExpressApplication
    >(ApplicationModule)
    app.useStaticAssets(join(__dirname, 'public'))
    app.use(cookieParser())
    app.useGlobalFilters(new GlobalHttpExceptionFilter())
    await app.listen(3000, () => console.log('listening on PORT 3000'))
  } catch (err) {
    console.log('app failed to connect for following reasons')
    console.error(err)
  }
}

bootstrap()
