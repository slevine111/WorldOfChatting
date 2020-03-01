export enum SocketEventsFromClient {
  CHAT_GROUP_INVITE_SENT = 'chatGroupInviteSent',
  CHAT_GROUP_INVITE_RESPONSE_SENT = 'chatGroupInviteResponseSent'
}

export enum SocketEventsFromServer {
  CHAT_GROUP_INVITE_RECEIVED = 'chatGroupInviteReceived',
  CHAT_GROUP_INVITE_RESPONSE_RECEIVED = 'chatGroupInviteResponseReceived'
}
