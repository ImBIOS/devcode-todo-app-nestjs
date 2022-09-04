import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaginationDTO } from '../../shared/DTO/pagination.dto';

export class CreateTodoDTO {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  readonly activity_group_id: number;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsIn(['very-high', 'high', 'normal', 'low', 'very-low'])
  @IsString()
  @IsOptional()
  readonly priority: string = 'very-high';

  @IsBoolean()
  @IsOptional()
  readonly is_active: boolean = true;

  @IsString()
  @IsOptional()
  readonly _comment: string;
}

export class UpdateTodoDTO extends PartialType(CreateTodoDTO) {}

export class QueryTodoDTO extends PaginationDTO {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  activity_group_id: number;
}
