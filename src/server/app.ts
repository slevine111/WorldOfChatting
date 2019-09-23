import { join } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import UserModule from './users/users.module'
import LanguageModule from './languages/languages.module'
import UserLanguageModule from './userlanguages/userlanguages.module'
import WebpageController from './webpage.controller'

@Module({
  imports: [
    UserModule,
    LanguageModule,
    UserLanguageModule,
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      renderPath: '/public',
      serveStaticOptions: {
        index: false
      }
    })
  ],
  controllers: [WebpageController]
})
export default class ApplicationModule {}
