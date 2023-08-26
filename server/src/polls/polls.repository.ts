import {
    BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis, RedisKey } from "ioredis";
import { IO_REDIS_KEY } from "src/redis/redis.module";
import { AddVoterData, CreatePollData } from "./types";
import { Poll } from "shared";

@Injectable()
export class PollsRepository {
  // to use time to live
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
    };

    this.logger.log(
      `Creating new Poll: ${JSON.stringify(initialPoll, null, 2)} with TTL: ${
        this.ttl
      }`
    );

    const key: RedisKey = `polls:${pollID}`;

    try {
      await this.redisClient.set(key, JSON.stringify(initialPoll), "EX", this.ttl);
      
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
    
    //   if(currentPoll?.hasStarted){
    //     throw new BadRequestException('Poll has already started');
    //   }

      return JSON.parse(currentPoll) as Poll;
    } catch (e) {
        this.logger.error(`Error getting poll: ${e}`);
        throw e;
    }
  }

  async addVoter({pollID, voterID, name}: AddVoterData): Promise<Poll> {
    this.logger.log(`Adding voter with ID: ${voterID}-${name} to poll with ID: ${pollID}`);

    const key = `polls:${pollID}`;
    const voterPath = `.voters.${voterID}`;

    try {
        await this.redisClient.multi([['send_command', 'JSON.SET', key, voterPath, JSON.stringify(name)]]);

        const pollJSON = await this.redisClient.get(key);

        const poll = JSON.parse(pollJSON) as Poll;

        this.logger.debug(
            `current poll: ${JSON.stringify(poll, null, 2)}`,
            poll.voters
        )

        return poll;
    } catch (e) {
        this.logger.error(`Error adding voter: ${voterID}-${name} to poll: ${pollID}`);
        throw e;
    }
  }
}
