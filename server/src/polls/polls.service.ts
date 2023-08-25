import { Injectable } from "@nestjs/common";
import { CreatePollFields, JoinPollFields, RejoinPollFields } from "./types";
import { createPollID, createVoterID } from "src/utils/id_generator";

@Injectable()
export class PollsService {
    async createPoll(fields: CreatePollFields) {
        const pollID = createPollID()
        const voterID = createVoterID()

        return {
            ...fields,
            pollID,
            voterID,
        }
    }
    async joinPoll(fields: JoinPollFields) {
        const voterID = createVoterID()

        return {
            ...fields,
            voterID,
        }
    }
    async rejoinPoll(fields: RejoinPollFields) {
        return fields;
    }
}