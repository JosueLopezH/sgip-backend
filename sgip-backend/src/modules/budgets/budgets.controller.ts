import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.budgetsService.findByProject(projectId);
  }

  @Get('expense/:id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @Post('expense')
  create(@Body() dto: CreateExpenseDto) {
    return this.budgetsService.create(dto);
  }

  @Patch('expense/:id')
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.budgetsService.update(id, dto);
  }

  @Delete('expense/:id')
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}
