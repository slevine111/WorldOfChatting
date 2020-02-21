import socketio, { Server } from 'socket.io'
import { HttpServer } from '@nestjs/common'

const createSocketServer = (httpServer: HttpServer): void => {
  const io: Server = socketio(httpServer)
  io.on('connection', socket => {
    console.log('socket has been connected')
  })
}

export default createSocketServer
