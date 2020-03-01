import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Put
} from '@nestjs/common'
import NotificationService from './notifications.service'
import { INotificationReducerFields } from '../../types-for-both-server-and-client'
import { INotificationPostDTO } from './notifications.dto'
import { Notification, NotificationRecipient } from '../../entities'
import AuthGuard from '../auth/auth.guard'

@Controller('/api/notification')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private notificationService: NotificationService) {}

  @Get('/:targetUserId')
  getNotificationsSentToSingleUser(
    @Param('targetUserId') targetUserId: string
  ): Promise<INotificationReducerFields[]> {
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

  @Post('/notificationRecipient/single')
  createNewNotificationRecipient(
    @Body()
    newNotificationObject: {
      targetUserId: string
      newNotification: Notification
    }
  ): Promise<INotificationReducerFields> {
    const { targetUserId, newNotification } = newNotificationObject
    return this.notificationService.createNotificationRecipent(
      targetUserId,
      newNotification
    )
  }

  @Put('/notificationRecipient/:ntRecipientId')
  updateNotificationRecipent(
    @Param('ntRecipientId') ntRecipientId: string,
    @Body() updatedNTRecipientFields: Partial<NotificationRecipient>
  ): Promise<NotificationRecipient> {
    return this.notificationService.updateNotificationRecipent(
      ntRecipientId,
      updatedNTRecipientFields
    )
  }
}
