Signaling Server
===

###### tags: `WebRTC`

- NestJS기반으로 구현 [Reference](https://docs.nestjs.com/)
- Socket.io를 사용해서 signaling server를 구축해 보았다.
  Signaling server란 WebRTC에서 Peer간 자신의 네트워크 정보 및 Communication에 필요한 각종 정보를 주고 받기 위한 코디네이터라 할 수 있다.
  
- Socket.io기반으로 채팅방을 채널별로 구분해 놓았고, Peer간의 정보를 해당 채팅방에 접속해 있는 모든 유저와 공유할 수 있도록 broadcasting 해주고 있다. [line 46]

- 미디어 데이터에 대한 정보는 offer SDP와 answer SDP로 구분되는데, offer는 전화를 시도한측 answer는 응답한 측이라고 이해하면 쉽다. [line 51, 61]

- Client에서 RTCPeerConnection을 통해 iceCandidate정보가 생성이 되면 peer간 send-candidate 채널을 통해 candidate정보를 넘겨주고 candidate정보에는 각 peer의 호스트 정보가 담겨있다. [line 21]

```javascript=
import {
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Server } from 'ws'
import { Logger } from '@nestjs/common'

@WebSocketGateway({ namespace: 'chat'})
export class MessageGateway implements OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    private activeSockets: { room: string; name: string, id: string }[] = []

    private logger: Logger = new Logger('MessageGateway')

    @SubscribeMessage('send-candidate')
    public sendCandidate(client: Socket, data: any): void {
        client.to(data.to).emit('receive-candidate', {
            candidate: data.candidate,
            socket: client.id,
            name: data.name
        })
    }

    @SubscribeMessage('joinRoom')
    public joinRoom(client: Socket, info: any): void {
        const existingSocket = this.activeSockets?.find(
            (socket) => socket.room === info.roomName && socket.id === client.id,
        )

        if (!existingSocket) {
            this.activeSockets = [...this.activeSockets, { id: client.id, name: info.name, room: info.roomName }]
        }

        this.logger.log(`Client ${client.id} joined ${info.roomName}`)

        client.join(info.roomName)

        const users = this.activeSockets
            .filter((socket) => socket.room === info.roomName)
            .map((existingSocket) => existingSocket.name)
        client.to(info.roomName).broadcast.emit('joined-users', users)
        client.emit('joined-users', users)
    }

    @SubscribeMessage('call-user')
    public callUser(client: Socket, data: any): void {
        console.log('calling users from ', data.name, ' to ', data.to)
        client.to(data.to).emit('call-made', {
            offer: data.offer,
            name: data.name,
            socket: client.id,
        })
    }

    @SubscribeMessage('make-answer')
    public makeAnswer(client: Socket, data: any): void {
        client.to(data.to).emit('answer-made', {
            answer: data.answer,
            name: data.name,
            socket: client.id,
        })
    }

    @SubscribeMessage('reject-call')
    public rejectCall(client: Socket, data: any): void {
        client.to(data.from).emit('call-rejected', {
            socket: client.id,
        })
    }

    public afterInit(server: Server): void {
        this.logger.log('Init')
    }

    public handleDisconnect(client: Socket): void {
        const existingSocket = this.activeSockets.find(
            (socket) => socket.id === client.id,
        )

        if (!existingSocket) return
        this.activeSockets = this.activeSockets.filter(
            (socket) => socket.id !== client.id,
        )

        client.to(existingSocket.room).emit('joined-users', {
            users: this.activeSockets
                .filter((socket) => socket.room === existingSocket.room)
                .map((existingSocket) => existingSocket.name),
        })

        this.logger.log(`Client disconnected: ${client.id}`)
    }
}

```