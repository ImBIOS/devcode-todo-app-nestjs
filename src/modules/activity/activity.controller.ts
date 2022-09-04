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
import {
  CreateActivityDTO,
  QueryActivityDTO,
  UpdateActivityDTO,
} from './activity.dto';
import { ActivityService } from './activity.service';

@Controller('activity-groups')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async findAll(@Query() query: QueryActivityDTO) {
    const { limit = 1000, skip = 0 } = query;
    const [data, total] = await this.activityService.findAll(query);
    return {
      total,
      limit,
      skip,
      data,
    };
  }

  @Post()
  async create(@Body() payload: CreateActivityDTO) {
    return await this.activityService.create(payload);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.activityService.findOne(id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return await this.activityService.deleteOne(id);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: number, @Body() payload: UpdateActivityDTO) {
    return await this.activityService.updateOne({
      id,
      payload,
    });
  }
}
