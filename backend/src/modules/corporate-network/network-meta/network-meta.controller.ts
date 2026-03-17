import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { NetworkMetaService } from './network-meta.service';

@ApiTags('Network Meta')
@Controller('network-meta')
export class NetworkMetaController {
  constructor(private readonly metaService: NetworkMetaService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get corporate network metadata' })
  getMeta() {
    return this.metaService.getMeta();
  }
}
