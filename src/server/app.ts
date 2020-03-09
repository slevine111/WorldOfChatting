import { join } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import UserModule from './users/users.module'
import LanguageModule from './languages/languages.module'
import UserLanguageModule from './userlanguages/userlanguages.module'
import ChatGroupModule from './chatgroups/chatgroups.module'
import UserChatGroupModule from './userchatgroups/userchatgroups.module'
import AuthModule from './auth/auth.module'
import ChatGroupInviteModule from './chatgroupinvites/chatgroupinvites.module'
import NotificationModule from './notifications/notifications.module'
import MyJWTModule from './MyJWTModule'
import MyCacheModule from './MyCacheModule'
import WebpageController from './webpage.controller'
import EventModule from './socket/socket.module'

@Module({
  imports: [
    UserModule,
    LanguageModule,
    UserLanguageModule,
    ChatGroupModule,
    UserChatGroupModule,
    AuthModule,
    ChatGroupInviteModule,
    NotificationModule,
    MyJWTModule,
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      renderPath: '/public',
      serveStaticOptions: {
        index: false
      }
    }),
    MyCacheModule,
    EventModule
  ],
  controllers: [WebpageController]
})
export default class ApplicationModule {}
