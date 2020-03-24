import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Put,
  Body
} from '@nestjs/common'
import NotificationService from './notifications.service'
import { INotificationPostDTO } from './notifications.dto'
import { Notification } from '../../entities'
import { NotificationTypes } from '../../entities/Notification'
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

  @Get('/currentDate/:notificationType/:targetUserId')
  getNotificationsFromCurrentDate(
    @Param('notificationType') notificationType: NotificationTypes,
    @Param('targetUserId') targetUserId: string
  ): Promise<Notification[]> {
    return this.notificationService.getNotificationsFromCurrentDate(
      notificationType,
      targetUserId
    )
  }

  @Post()
  createNewNotification(
    @Body() newNotification: INotificationPostDTO
  ): Promise<Notification> {
    return this.notificationService.createNotification(newNotification)
  }

  @Put('/:notificationId')
  updateNotification(
    @Body()
    {
      currentNotification,
      updatedNotification
    }: {
      currentNotification: Notification
      updatedNotification: Partial<Notification>
    }
  ): Promise<Notification> {
    return this.notificationService.updateNotification(
      currentNotification,
      updatedNotification
    )
  }
}
