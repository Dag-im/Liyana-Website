import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../../common/types/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ writeOnly: true, minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.BLOGGER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsUUID()
  divisionId?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Dr. Hanna Tesfaye',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  authorName?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Senior Medical Editor',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  authorRole?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
