import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from '../../shared/DTO/pagination.dto';

export class CreateActivityDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly _comment: string;
}

export class UpdateActivityDTO extends PartialType(CreateActivityDTO) {}

export class QueryActivityDTO extends PaginationDTO {
  @IsEmail()
  @IsOptional()
  email: string;
}
