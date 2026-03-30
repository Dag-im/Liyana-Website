import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IrDocumentCategory } from '../entities/ir-document.entity';

export class CreateIrDocumentDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  year: string;

  @IsEnum(IrDocumentCategory)
  @ApiProperty({ enum: IrDocumentCategory })
  category: IrDocumentCategory;

  @IsString()
  @ApiProperty()
  filePath: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
