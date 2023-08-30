import { JwtService } from "@nestjs/jwt/dist";
import { Injectable, Logger } from "@nestjs/common";
import { CreatePollFields, JoinPollFields, RejoinPollFields } from "./types";
import { PollsRepository } from "./polls.repository";
import { createPollID, createVoterID } from "src/utils/id_generator";

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService
  ) {}
  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const voterID = createVoterID();

    const createPoll = await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      voterID,
    });

    this.logger.debug(
      `Creating token for poll with ID ${pollID} and voter with ID ${voterID}`
    );

    const signedToken = this.jwtService.sign(
      {
        pollID: createPoll.id,
        name: fields.name,
      },
      {
        subject: voterID,
      }
    );

    return {
        poll: createPoll,
        accessToken: signedToken,
    }
  }
  async joinPoll(fields: JoinPollFields) {
    const voterID = createVoterID();

    this.logger.debug(
      `Fetching poll with ID ${fields.pollID} to add voter with ID ${voterID}`
    );

    const joinPoll = await this.pollsRepository.getPoll(fields.pollID);

    this.logger.debug(
        `Creating token for poll with ID ${fields.pollID} and voter with ID ${voterID}`
    )

    const signedToken = this.jwtService.sign(
        {
            pollID: joinPoll.id,
            name: fields.name,
            voterID,
        },
        {
            subject: voterID,
        }
    )

    return {
      poll: joinPoll,
      accessToken: signedToken
    };
  }
  async rejoinPoll(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID ${fields.pollID} as voter with ID ${fields.voterID} and name ${fields.name}`
    );

    const joinPoll = await this.pollsRepository.addVoter(fields);

    return joinPoll;
  }
}
