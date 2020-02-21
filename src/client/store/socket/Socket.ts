import io from 'socket.io-client'

export default class MySocket {
  private socket: SocketIOClient.Socket
  constructor() {
    this.socket = {} as SocketIOClient.Socket
  }

  connect(): void {
    this.socket = io(window.location.origin)

    console.log('two-way connection has been made!')
  }
}
