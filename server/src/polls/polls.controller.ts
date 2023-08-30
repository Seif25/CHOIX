import { Controller, Logger, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './polls.dtos';
import { PollsService } from './polls.service';
import { ControllerAuthGuard } from './controller-auth.guard';
import { RequestWithAuth } from './types';

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

    @UseGuards(ControllerAuthGuard)
    @Post("/rejoin")
    async rejoinPoll(@Req() request: RequestWithAuth) {
        const { pollID, voterID, name } = request;
        const result = await this.pollsService.rejoinPoll(
            {
                pollID,
                voterID,
                name
            }
        );
        Logger.log("Rejoining poll...")
        return result;
    }
}