import { Injectable, Logger } from "@nestjs/common";
import { CreatePollFields, JoinPollFields, RejoinPollFields } from "./types";
import { createPollID, createVoterID } from "src/utils/id_generator";
import { PollsRepository } from "./polls.repository";

@Injectable()
export class PollsService {
    private readonly logger = new Logger(PollsService.name);
    constructor(private readonly pollsRepository: PollsRepository) {}
    async createPoll(fields: CreatePollFields) {
        const pollID = createPollID()
        const voterID = createVoterID()

        const createPoll = await this.pollsRepository.createPoll({
            ...fields,
            pollID,
            voterID,
        })

        return {
            poll: createPoll,
        }
    }
    async joinPoll(fields: JoinPollFields) {
        const voterID = createVoterID()

        this.logger.debug(
            `Fetching poll with ID ${fields.pollID} to add voter with ID ${voterID}`
        )

        const joinPoll = await this.pollsRepository.getPoll(fields.pollID)

        return {
            poll: joinPoll,
        }
    }
    async rejoinPoll(fields: RejoinPollFields) {
        this.logger.debug(
            `Rejoining poll with ID ${fields.pollID} as voter with ID ${fields.voterID} and name ${fields.name}`
        )

        const joinPoll = await this.pollsRepository.addVoter(fields)

        return joinPoll
    }
}