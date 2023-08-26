import { Controller, Logger, Post, Body } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './polls.dtos';
import { PollsService } from './polls.service';

@Controller('polls')
export class PollsController {

    constructor(private pollsService: PollsService) {}

    @Post()
    async createPoll(@Body() createPollDto: CreatePollDto) {
        const result = await this.pollsService.createPoll(createPollDto);
        Logger.log("Creating new poll...")
        return result;
    }

    @Post("/join")
    async joinPoll(@Body() joinPollDto: JoinPollDto) {
        const result = await this.pollsService.joinPoll(joinPollDto);
        Logger.log("Joining poll...")
        return result;
    }

    @Post("/rejoin")
    async rejoinPoll() {
        const result = await this.pollsService.rejoinPoll(
            {
                pollID: "C70KUB",
                voterID: "O6vE9Fq6XvzQy9Rq0EvRz",
                name: "Yahia",
            }
        );
        Logger.log("Rejoining poll...")
        return result;
    }
}