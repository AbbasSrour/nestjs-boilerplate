import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  HealthCheck,
  HealthCheckService,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

import { ServiceHealthIndicator } from './health-indicators/service.indicator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthCheckerController {
  constructor(
    private healthCheckService: HealthCheckService,
    private ormIndicator: MikroOrmHealthIndicator,
    private serviceIndicator: ServiceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
      () => this.serviceIndicator.isHealthy('search-service-health'),
    ]);
  }
}
