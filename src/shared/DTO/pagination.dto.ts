import { IsOptional, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @Min(0)
  limit: number;

  @IsOptional()
  @Min(0)
  skip: number;
}
