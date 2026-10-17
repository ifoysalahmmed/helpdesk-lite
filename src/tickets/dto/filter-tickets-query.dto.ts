import { IsIn, IsOptional } from 'class-validator';

export class FilterTicketsQueryDto {
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';
}
