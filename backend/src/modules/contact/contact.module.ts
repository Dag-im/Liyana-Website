import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../../common/common.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactSubmission } from './entity/contact-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission]), CommonModule],
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactService],
})
export class ContactModule {}
