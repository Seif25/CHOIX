import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { JWTModule, redisModule } from 'src/config/modules.config';
import { PollsRepository } from './polls.repository';
import { PollsGateway } from './polls.gateway';

@Module({
    imports: [ConfigModule.forRoot(), redisModule, JWTModule],
    controllers: [PollsController],
    providers: [PollsService, PollsRepository, PollsGateway],
})
export class PollsModule {}