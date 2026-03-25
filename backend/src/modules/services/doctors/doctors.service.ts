import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../../common/types/user-role.enum';
import { UploadsService } from '../../../uploads/uploads.service';
import { DivisionsService } from '../divisions/divisions.service';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly divisionsService: DivisionsService,
    private readonly uploadsService: UploadsService,
  ) {}

  async create(
    divisionId: string,
    createDto: CreateDoctorDto,
    performedBy: string,
    callerRole?: UserRole,
    callerDivisionId?: string | null,
  ): Promise<Doctor> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      createDto,
      'doctor',
      async () => {
        if (
          callerRole === UserRole.DIVISION_MANAGER &&
          callerDivisionId !== divisionId
        ) {
          throw new ForbiddenException(
            'Division managers can only manage doctors in their own division',
          );
        }

        const division = await this.divisionsService.findOne(divisionId);
        if (!division.requiresMedicalTeam) {
          throw new BadRequestException(
            'This division does not have a medical team. Enable requiresMedicalTeam first.',
          );
        }

        const doctor = this.doctorRepository.create({
          ...createDto,
          divisionId: division.id,
        });

        return this.doctorRepository.save(doctor);
      },
    );
  }

  async update(
    divisionId: string,
    id: string,
    updateDto: UpdateDoctorDto,
    performedBy: string,
    callerRole?: UserRole,
    callerDivisionId?: string | null,
  ): Promise<Doctor> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      updateDto,
      'doctor',
      async () => {
        if (
          callerRole === UserRole.DIVISION_MANAGER &&
          callerDivisionId !== divisionId
        ) {
          throw new ForbiddenException(
            'Division managers can only manage doctors in their own division',
          );
        }

        await this.divisionsService.findOne(divisionId);

        const doctor = await this.doctorRepository.findOne({
          where: { id, divisionId },
        });

        if (!doctor) {
          throw new NotFoundException('Doctor not found in this division');
        }

        const previousImage =
          updateDto.image && doctor.image && updateDto.image !== doctor.image
            ? doctor.image
            : null;

        this.doctorRepository.merge(doctor, updateDto);
        const saved = await this.doctorRepository.save(doctor);

        if (previousImage) {
          await this.uploadsService.cleanup(previousImage);
        }

        return saved;
      },
    );
  }

  async remove(
    divisionId: string,
    id: string,
    callerRole?: UserRole,
    callerDivisionId?: string | null,
  ): Promise<{ message: string }> {
    if (
      callerRole === UserRole.DIVISION_MANAGER &&
      callerDivisionId !== divisionId
    ) {
      throw new ForbiddenException(
        'Division managers can only manage doctors in their own division',
      );
    }

    await this.divisionsService.findOne(divisionId);

    const doctor = await this.doctorRepository.findOne({
      where: { id, divisionId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found in this division');
    }

    if (doctor.image) {
      await this.uploadsService.cleanup(doctor.image);
    }

    await this.doctorRepository.remove(doctor);

    return { message: 'Doctor deleted successfully' };
  }
}
