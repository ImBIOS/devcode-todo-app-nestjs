import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTodoDTO, QueryTodoDTO, UpdateTodoDTO } from './todo.dto';
import { TodoService } from './todo.service';

@Controller('todo-items')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(@Query() query: QueryTodoDTO) {
    const { limit = 10, skip = 0 } = query;
    const [data, total] = await this.todoService.findAll(query);
    return {
      total,
      limit,
      skip,
      data,
    };
  }

  @Post()
  async create(@Body() payload: CreateTodoDTO) {
    return await this.todoService.create(payload);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.todoService.findOne(id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return await this.todoService.deleteOne(id);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: number, @Body() payload: UpdateTodoDTO) {
    return await this.todoService.updateOne({
      id,
      payload,
    });
  }
}
