import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('dashboard')
    getDashboard() {
        return this.reportsService.getGeneralDashboard();
    }

    @Get('project/:id')
    getProjectReport(@Param('id') id: string) {
        return this.reportsService.getProjectSummary(id);
    }
}