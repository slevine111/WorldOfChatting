import { Module } from '@nestjs/common'
import EventGateway from './socket.gateway'

@Module({ providers: [EventGateway] })
export default class EventModule {}
