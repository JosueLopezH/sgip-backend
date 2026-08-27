import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectDto, Status } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar proyectos con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'managerId', required: false })
  @ApiResponse({ status: 200, description: 'Lista paginada de proyectos' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: Status,
    @Query('managerId') managerId?: string,
  ) {
    return this.projectsService.findAll({ page, limit, status, managerId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID con sus tareas' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado', type: ProjectEntity })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado', type: ProjectEntity })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto existente' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado', type: ProjectEntity })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}