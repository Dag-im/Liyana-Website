import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<Doctor> {
    const division = await this.divisionsService.findOne(divisionId);

    const doctor = this.doctorRepository.create({
      ...createDto,
      divisionId: division.id,
    });

    return this.doctorRepository.save(doctor);
  }

  async update(
    divisionId: string,
    id: string,
    updateDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    await this.divisionsService.findOne(divisionId);

    const doctor = await this.doctorRepository.findOne({
      where: { id, divisionId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found in this division');
    }

    if (updateDto.image && doctor.image && updateDto.image !== doctor.image) {
      await this.uploadsService.cleanup(doctor.image);
    }

    this.doctorRepository.merge(doctor, updateDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(divisionId: string, id: string): Promise<{ message: string }> {
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
