import { Controller, UseGuards, Get, Param, Post, Body } from '@nestjs/common'
import NotificationService from './notifications.service'
import { INotificationPostDTO } from './notifications.dto'
import { Notification } from '../../entities'
import AuthGuard from '../auth/auth.guard'

@Controller('/api/notification')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private notificationService: NotificationService) {}

  @Get('/:targetUserId')
  getNotificationsSentToSingleUser(
    @Param('targetUserId') targetUserId: string
  ): Promise<Notification[]> {
    return this.notificationService.getNotificationsSentToSingleUser(
      targetUserId
    )
  }

  @Post()
  createNewNotification(
    @Body() newNotification: INotificationPostDTO
  ): Promise<Notification> {
    return this.notificationService.createNotification(newNotification)
  }
}
