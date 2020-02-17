import { Controller, UseGuards, Get, Param } from '@nestjs/common'
import NotificationService from './notifications.service'
import { INotificationReducerFields } from '../../types-for-both-server-and-client'
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
}
