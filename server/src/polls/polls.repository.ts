import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis, RedisKey } from "ioredis";
import { AddRankingData, AddSuggestionData, AddVoterData, CreatePollData } from "./types/types";
import { Poll, Results } from "shared";
import { IO_REDIS_KEY } from "src/db/redis.module";

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IO_REDIS_KEY) private readonly redisClient: Redis
  ) {
    this.ttl = configService.get<string>("POLL_DURATION");
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    voterID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      voters: {},
      adminID: voterID,
      votingStarted: false,
      suggestions: {},
      rankings: {},
      results: [],
      ended: false
    };

    this.logger.log(
      `Creating new Poll: ${JSON.stringify(initialPoll, null, 2)} with TTL: ${
        this.ttl
      }`
    );

    const key: RedisKey = `polls:${pollID}`;

    try {
      await this.redisClient.set(
        key,
        JSON.stringify(initialPoll),
        "EX",
        this.ttl
      );

      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Error creating poll: ${e} :: ${JSON.stringify(initialPoll, null, 2)}`
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Getting poll with ID: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.get(key);

      this.logger.verbose(`Got poll: ${currentPoll}`);

      return JSON.parse(currentPoll) as Poll;
    } catch (e) {
      this.logger.error(`Error getting poll: ${e}`);
      throw new InternalServerErrorException(``);
    }
  }

  async addVoter({ pollID, voterID, name }: AddVoterData): Promise<Poll> {
    this.logger.log(
      `Adding voter with ID: ${voterID}-${name} to poll with ID: ${pollID}`
    );

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);

      if (poll) {
        let voters = poll.voters;
        voters = { ...voters, [voterID]: name };
        poll.voters = voters;
      }

      await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

      this.logger.debug(
        `current poll: ${JSON.stringify(poll, null, 2)}`,
        poll.voters
      );

      return poll;
    } catch (e) {
      this.logger.error(
        `Error adding voter: ${voterID}-${name} to poll: ${pollID}`
      );
      throw new InternalServerErrorException(`Error adding voter: ${voterID}-${name} to poll: ${pollID}`);
    }
  }

  async removeVoter(pollID: string, voterID: string): Promise<Poll> {
    this.logger.log(
      `Removing voter with ID: ${voterID} from poll with ID: ${pollID}`
    );

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);

      if (poll) {
        let voters = poll.voters;
        delete voters[voterID];
        poll.voters = voters;
      }

      await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

      this.logger.debug(
        `current poll: ${JSON.stringify(poll, null, 2)}`,
        poll.voters
      );

      return poll;
    } catch (e) {
      this.logger.error(
        `Error removing voter: ${voterID} from poll: ${pollID}`
      );
      throw new InternalServerErrorException(`Error removing voter: ${voterID} from poll: ${pollID}`);
    }
  }

  async addSuggestion({
    pollID,
    suggestionID,
    suggestion,
  }: AddSuggestionData): Promise<Poll> {
    this.logger.log(
      `Adding suggestion with ID: ${suggestionID} to poll with ID: ${pollID}`
    )

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);
      
      if (poll) {
        let suggestions = poll.suggestions;
        suggestions = { ...suggestions, [suggestionID]: suggestion };
        poll.suggestions = suggestions;
      }

      await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

      this.logger.log(
        `Added suggestion with ID: ${suggestionID} to poll with ID: ${pollID}`
      )

      return poll;
    } catch (error) {
      this.logger.error(`Error adding suggestion: ${suggestionID} to poll: ${pollID}`)
      throw new InternalServerErrorException(`Error adding suggestion: ${suggestionID} to poll: ${pollID}`)
    }
  }

  async removeSuggestion(pollID: string, suggestionID: string): Promise<Poll> {
    this.logger.log(`Removing suggestion with ID: ${suggestionID} from poll with ID: ${pollID}`)

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);

      if (poll) {
        let suggestions = poll.suggestions;
        delete suggestions[suggestionID];
        poll.suggestions = suggestions;
      }

      await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

      this.logger.log(`Removed suggestion with ID: ${suggestionID} from poll with ID: ${pollID}`)

      return poll;
    } catch (error) {
      this.logger.error(`Error removing suggestion: ${suggestionID} from poll: ${pollID}`)
      throw new InternalServerErrorException(`Error removing suggestion: ${suggestionID} from poll: ${pollID}`)
    }
  }

  async startVoting(pollID: string): Promise<Poll> {
    this.logger.log(`Starting poll with ID: ${pollID}`)

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);

      if (poll) {
        poll.votingStarted = true;

        await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

        this.logger.log(`Started poll with ID: ${pollID}`)

        return poll;
      }
    } catch (error) {
      this.logger.error(`Error starting poll: ${pollID}`)
      throw new InternalServerErrorException(`Error starting poll: ${pollID}`)
    }
  }

  async addRanking({pollID, voterID, rankings}: AddRankingData): Promise<Poll> {
    this.logger.log(`Adding ranking for voter with ID: ${voterID} to poll with ID: ${pollID}`)

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);

      if (poll) {
        let updated_rankings = poll.rankings;
        updated_rankings = { ...updated_rankings, [voterID]: rankings };
        poll.rankings = updated_rankings;

        await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

        this.logger.log(`Added ranking for voter with ID: ${voterID} to poll with ID: ${pollID}`)

        return poll;
      }
    } catch (error) {
      this.logger.error(`Error adding ranking for voter with ID: ${voterID} to poll with ID: ${pollID}`)
      throw new InternalServerErrorException(`Error adding ranking for voter with ID: ${voterID} to poll with ID: ${pollID}`)
    }
  }

  async addResults(pollID: string, results: Results): Promise<Poll>{
    this.logger.log(`Adding results to poll with ID: ${pollID}`)

    const key = `polls:${pollID}`;

    try {
      const poll = await this.getPoll(pollID);

      if (poll) {
        poll.results = results;
        poll.ended = true;

        await this.redisClient.set(key, JSON.stringify(poll), "KEEPTTL");

        this.logger.log(`Added results to poll with ID: ${pollID}`)

        return poll;
      }
    } catch (error) {
      this.logger.error(`Error adding results to poll with ID: ${pollID}`)
      this.logger.error(error)
      throw new InternalServerErrorException(`Error adding results to poll with ID: ${pollID}`)
    }
  }

  async deletePoll(pollID: string): Promise<void> {
    this.logger.log(`Deleting poll with ID: ${pollID}`)

    const key = `polls:${pollID}`;

    try {
      await this.redisClient.del([key]);
    } catch (error) {
      this.logger.error(`Error deleting poll with ID: ${pollID}`)
      throw new InternalServerErrorException(`Error deleting poll with ID: ${pollID}`)
    }
  }
}
