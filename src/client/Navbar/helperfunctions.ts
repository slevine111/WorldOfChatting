import moment, { Moment } from 'moment'
import { Notification } from '../../entities'
import { NotificationTypes } from '../../entities/Notification'

export enum TimeUnitsOptions {
  DAYS = 'days',
  HOURS = 'hours',
  WEEKS = 'weeks',
}

export const generateNotificationText = (
  nt: Notification,
  firstUserFullName: string
): string => {
  const { notificationType, sendersUserIds } = nt
  const { CHAT_GROUP_INVITE_ACCEPTED } = NotificationTypes
  const numUsersMinusOne: number = sendersUserIds.length - 1
  const stringStart: string = `${firstUserFullName} ${
    sendersUserIds.length > 1
      ? `and ${numUsersMinusOne} other ${
          numUsersMinusOne === 1 ? 'person' : 'people'
        } have`
      : 'has'
  }`
  if (notificationType == CHAT_GROUP_INVITE_ACCEPTED) {
    return `${stringStart}  accepted your invite${
      sendersUserIds.length > 1 ? 's' : ''
    } to chat!`
  } else {
    return `${stringStart}  declined your invite${
      sendersUserIds.length > 1 ? 's' : ''
    } to chat. But don't worry, there are still plenty of people to chat with!`
  }
}

export const getTimeDifferenceUnitDisplay = (
  currentDateTime: Moment,
  ntDateTime: Date
): TimeUnitsOptions => {
  const { HOURS, DAYS, WEEKS } = TimeUnitsOptions
  const ntMoment: Moment = moment(ntDateTime)
  if (currentDateTime.isSame(ntMoment, 'day')) {
    return HOURS
  } else if (
    currentDateTime.clone().subtract(1, 'weeks').isSameOrBefore(ntMoment)
  ) {
    return DAYS
  } else {
    return WEEKS
  }
}
