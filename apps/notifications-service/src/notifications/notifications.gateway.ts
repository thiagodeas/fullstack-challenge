import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  emit(type: string, data: any) {
    this.server.emit(type, data);
  }
}
