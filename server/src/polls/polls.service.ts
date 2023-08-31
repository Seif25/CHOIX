import { JwtService } from "@nestjs/jwt/dist";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import {
  AddSuggestionFields,
  AddVoterFields,
  CreatePollFields,
  JoinPollFields,
  RejoinPollFields,
  RemoveVoterFields,
  SubmitRankingsFields,
} from "./types/types";
import { PollsRepository } from "./polls.repository";
import { createPollID, createSuggestionID, createVoterID } from "src/utils/id-generator";
import { Poll } from "shared";
import getResults from "./getResults";

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
    };
  }

  async joinPoll(fields: JoinPollFields) {
    const voterID = createVoterID();

    this.logger.debug(
      `Fetching poll with ID ${fields.pollID} to add voter with ID ${voterID}`
    );

    const joinPoll = await this.pollsRepository.getPoll(fields.pollID);

    this.logger.debug(
      `Creating token for poll with ID ${fields.pollID} and voter with ID ${voterID}`
    );

    const signedToken = this.jwtService.sign(
      {
        pollID: joinPoll.id,
        name: fields.name,
        voterID,
      },
      {
        subject: voterID,
      }
    );

    return {
      poll: joinPoll,
      accessToken: signedToken,
    };
  }

  async rejoinPoll(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID ${fields.pollID} as voter with ID ${fields.voterID} and name ${fields.name}`
    );

    const joinPoll = await this.pollsRepository.addVoter(fields);

    return joinPoll;
  }

  async getPoll(pollID: string): Promise<Poll> {
    return this.pollsRepository.getPoll(pollID);
  }

  async addVoter(fields: AddVoterFields): Promise<Poll> {
    return this.pollsRepository.addVoter(fields);
  }

  async removeVoter(pollID: string, voterID: string): Promise<Poll | void> {
    const poll = await this.pollsRepository.getPoll(pollID);

    if (!poll.votingStarted) {
      const updatedPoll = await this.pollsRepository.removeVoter(
        pollID,
        voterID
      );
      return updatedPoll;
    }
  }

  async addSuggestion({pollID, voterID, text}: AddSuggestionFields): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(pollID)

    if (poll.votingStarted) {
      throw new BadRequestException("Voting has already started")
    }

    return this.pollsRepository.addSuggestion(
      {
        pollID,
        suggestionID: createSuggestionID(),
        suggestion: {
          voterID,
          text
        }
      }
    )
  }

  async removeSuggestion(pollID: string, suggestionID: string): Promise<Poll> {
    return this.pollsRepository.removeSuggestion(pollID, suggestionID)
  }

  async startVoting(pollID: string): Promise<Poll> {
    return this.pollsRepository.startVoting(pollID)
  }

  async submitRankings({pollID, voterID, rankings}: SubmitRankingsFields): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(pollID)

    if (!poll.votingStarted) {
      throw new BadRequestException("Voting has not started yet")
    }

    return this.pollsRepository.addRanking({pollID, voterID, rankings})
  }

  async computeResults(pollID: string): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(pollID)

    const results = getResults(poll.rankings, poll.suggestions, poll.votesPerVoter)

    this.logger.verbose(`Computed results for poll with ID ${pollID}: ${JSON.stringify(results, null ,2)}`)

    return this.pollsRepository.addResults(
      pollID,
      results
    )
  }

  async deletePoll(pollID: string): Promise<void> {
    return this.pollsRepository.deletePoll(pollID)
  }
}
