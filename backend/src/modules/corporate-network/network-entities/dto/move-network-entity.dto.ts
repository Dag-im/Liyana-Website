import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class MoveNetworkEntityDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false, nullable: true })
  parentId: string | null;
}
