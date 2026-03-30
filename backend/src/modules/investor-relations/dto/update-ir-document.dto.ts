import { PartialType } from '@nestjs/swagger';
import { CreateIrDocumentDto } from './create-ir-document.dto';

export class UpdateIrDocumentDto extends PartialType(CreateIrDocumentDto) {}
