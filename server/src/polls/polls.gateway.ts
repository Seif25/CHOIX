import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Namespace } from "socket.io";
import { SocketWithAuth } from "./types/types";
import { WSCatchAllFilter } from "src/exceptions/ws-catch-all.filter";
import { GatewayAdminGuard } from "src/guards/gateway.guard";
import { SuggestionDto } from "src/validations/polls-dto.decorator";

@UsePipes(new ValidationPipe())
@UseFilters(new WSCatchAllFilter())
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

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(`
        Connected with voterID: ${client.voterID}, pollID: ${client.pollID}, and name: ${client.name}
    `);
    this.logger.log(`Total connected sockets, ${sockets.size}`);

    const room = client.pollID;
    await client.join(room);

    const connectedClients = this.io.adapter.rooms?.get(room)?.size ?? 0;
    this.logger.log(`Client ${client.voterID} joined room ${room}`);
    this.logger.log(
      `Total connected clients in room ${room} is ${connectedClients}`
    );

    const poll = await this.pollsService.addVoter({
      pollID: client.pollID,
      voterID: client.voterID,
      name: client.name,
    });

    this.io.to(room).emit("poll_updated", poll);
  }

  async handleDisconnect(client: SocketWithAuth) {
    const poll = await this.pollsService.removeVoter(
      client.pollID,
      client.voterID
    );

    const room = client.pollID;
    const connectedClients = this.io.adapter.rooms?.get(room)?.size ?? 0;

    this.logger.log(`Client ${client.voterID} left room ${room}`);
    this.logger.debug(
      `Total connected clients in room ${room} is ${connectedClients}`
    );

    if (poll) {
      this.io.to(room).emit("poll_updated", poll);
    }
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage("remove_voter")
  async removeVoter(
    @MessageBody("id") id: string,
    @ConnectedSocket() client: SocketWithAuth
  ) {
    this.logger.debug(
      `Removing voter with ID ${id} from poll with ID ${client.pollID}`
    );
    const poll = await this.pollsService.removeVoter(client.pollID, id);

    if (poll) {
      this.io.to(client.pollID).emit("poll_updated", poll);
    }
  }

  @SubscribeMessage("add_suggestion")
  async addSuggestion(
    @MessageBody() suggestion: SuggestionDto,
    @ConnectedSocket() client: SocketWithAuth
  ): Promise<void> {
    this.logger.debug(
      `Adding suggestion with text ${suggestion.text} to poll with ID ${client.pollID}`
    );

    const poll = await this.pollsService.addSuggestion({
      pollID: client.pollID,
      voterID: client.voterID,
      text: suggestion.text,
    });

    this.io.to(client.pollID).emit("poll_updated", poll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage("remove_suggestion")
  async removeSuggestion(
    @MessageBody("id") id: string,
    @ConnectedSocket() client: SocketWithAuth
  ): Promise<void> {
    this.logger.debug(
      `Removing suggestion with ID ${id} from poll with ID ${client.pollID}`
    );

    const poll = await this.pollsService.removeSuggestion(client.pollID, id);

    this.io.to(client.pollID).emit("poll_updated", poll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage("start_vote")
  async startVoting(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    this.logger.debug(`Starting voting for poll with ID ${client.pollID}`);

    const poll = await this.pollsService.startVoting(client.pollID);

    this.io.to(client.pollID).emit("poll_updated", poll);
  }

  @SubscribeMessage("submit_rankings")
  async submitRankings(
    @MessageBody("rankings") rankings: string[],
    @ConnectedSocket() client: SocketWithAuth
  ): Promise<void> {
    this.logger.debug(`Submitting rankings for poll with ID ${client.pollID}`);

    await this.pollsService.submitRankings(
      {
        pollID: client.pollID,
        voterID: client.voterID,
        rankings,
      }
    )
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage("end_poll")
  async endPoll(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    this.logger.debug(`Ending poll with ID ${client.pollID}`);

    const poll = await this.pollsService.computeResults(client.pollID);

    this.io.to(client.pollID).emit("poll_updated", poll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage("delete_poll")
  async deletePoll(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    this.logger.debug(`Deleting poll with ID ${client.pollID}`);

    await this.pollsService.deletePoll(client.pollID);

    this.io.to(client.pollID).emit("poll_deleted");
  }
}
