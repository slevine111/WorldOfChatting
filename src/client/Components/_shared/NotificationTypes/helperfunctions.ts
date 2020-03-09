import {
  INotificationReducerFields,
  IReduxStoreUserFields
} from '../../../../types-for-both-server-and-client'

export const getNotificationAndSenderInfo = (
  notificationId: string,
  allNotifications: Record<string, INotificationReducerFields>,
  allUsers: Record<string, IReduxStoreUserFields>
): {
  notification: INotificationReducerFields
  user: IReduxStoreUserFields
} => {
  const notification = allNotifications[notificationId]
  return { notification, user: allUsers[notification.senderId] }
}
