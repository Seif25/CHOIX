import { Logger } from "@nestjs/common";
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Namespace } from "socket.io";
import { SocketWithAuth } from "./types";

@WebSocketGateway({
  namespace: "polls",
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger(PollsGateway.name);
  constructor(private pollsService: PollsService) {}

  @WebSocketServer() io: Namespace;

  afterInit(server: any): void {
    this.logger.log("Websocket gateway initialized");
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets

    this.logger.debug(`
        Connected with voterID: ${client.voterID}, pollID: ${client.pollID}, and name: ${client.name}
    `)
    this.logger.log(`Client connected ${client.id}`);
    this.logger.log(`Total connected clients, ${sockets.size }`);
    // throw new Error("Method not implemented.");
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets

    this.logger.debug(`
        Disconnected with voterID: ${client.voterID}, pollID: ${client.pollID}, and name: ${client.name}
    `)
    this.logger.log(`Client disconnected ${client.id}`);
    this.logger.log(`Total remaining clients, ${sockets.size }`);
    // throw new Error("Method not implemented.");
  }
}
