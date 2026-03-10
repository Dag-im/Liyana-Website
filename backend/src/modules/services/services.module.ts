import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { Booking } from '../bookings/entity/booking.entity';
import { User } from '../users/entity/user.entity';
import { DivisionCategoriesController } from './division-categories/division-categories.controller';
import { DivisionCategoriesService } from './division-categories/division-categories.service';
import { DivisionsController } from './divisions/divisions.controller';
import { DivisionsService } from './divisions/divisions.service';
import { DoctorsController } from './doctors/doctors.controller';
import { DoctorsService } from './doctors/doctors.service';
import { DivisionCategory } from './entities/division-category.entity';
import { DivisionContact } from './entities/division-contact.entity';
import { DivisionCoreService } from './entities/division-core-service.entity';
import { DivisionImage } from './entities/division-image.entity';
import { DivisionStat } from './entities/division-stat.entity';
import { Division } from './entities/division.entity';
import { Doctor } from './entities/doctor.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceCategoriesController } from './service-categories/service-categories.controller';
import { ServiceCategoriesService } from './service-categories/service-categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Division,
      DivisionCategory,
      ServiceCategory,
      Doctor,
      DivisionStat,
      DivisionImage,
      DivisionCoreService,
      DivisionContact,
      Booking,
      User,
    ]),
    CommonModule,
    UploadsModule,
  ],
  controllers: [
    DivisionCategoriesController,
    ServiceCategoriesController,
    DivisionsController,
    DoctorsController,
  ],
  providers: [
    DivisionCategoriesService,
    ServiceCategoriesService,
    DivisionsService,
    DoctorsService,
  ],
  exports: [
    DivisionCategoriesService,
    ServiceCategoriesService,
    DivisionsService,
  ],
})
export class ServicesModule {}
