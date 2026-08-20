import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { BudgetSummaryEntity, ExpenseEntity } from '../projects/entities/expense.entity';

@ApiTags('Budgets')
@ApiBearerAuth()
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Obtener resumen de presupuesto y gastos de un proyecto' })
  @ApiResponse({ status: 200, description: 'Resumen de presupuesto', type: BudgetSummaryEntity })
  findByProject(@Param('projectId') projectId: string) {
    return this.budgetsService.findByProject(projectId);
  }

  @Get('expense/:id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  @ApiResponse({ status: 200, description: 'Gasto encontrado', type: ExpenseEntity })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @Post('expense')
  @ApiOperation({ summary: 'Registrar un nuevo gasto en un proyecto' })
  @ApiResponse({ status: 201, description: 'Gasto registrado', type: ExpenseEntity })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateExpenseDto) {
    return this.budgetsService.create(dto);
  }

  @Patch('expense/:id')
  @ApiOperation({ summary: 'Actualizar un gasto existente' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado', type: ExpenseEntity })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.budgetsService.update(id, dto);
  }

  @Delete('expense/:id')
  @ApiOperation({ summary: 'Eliminar un gasto' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}