import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification, NotificationRecipient } from '../../entities'
import NotificationController from './notifications.controller'
import NotificationService from './notifications.service'

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationRecipient])],
  providers: [NotificationService],
  controllers: [NotificationController]
})
export default class NotificationModule {}
