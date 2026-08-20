import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Obtener dashboard general con KPIs del sistema' })
    @ApiResponse({ status: 200, description: 'Dashboard con estadísticas generales' })
    getDashboard() {
        return this.reportsService.getGeneralDashboard();
    }

    @Get('project/:id')
    @ApiOperation({ summary: 'Obtener reporte detallado de un proyecto' })
    @ApiResponse({ status: 200, description: 'Reporte del proyecto con tareas y presupuesto' })
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    getProjectReport(@Param('id') id: string) {
        return this.reportsService.getProjectSummary(id);
    }
}