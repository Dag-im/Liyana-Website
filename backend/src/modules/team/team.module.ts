import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadsModule } from 'src/uploads/uploads.module';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../services/services.module';
import { TeamMember } from './entity/team-member.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamMember]),
    CommonModule,
    ServicesModule,
    UploadsModule
  ],
  providers: [TeamService],
  controllers: [TeamController],
  exports: [TeamService],
})
export class TeamModule {}
