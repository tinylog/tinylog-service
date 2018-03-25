import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class ISimpleFilter {
  @IsDateString() from: string;
  @IsDateString() to: string;
  @IsOptional()
  @IsNumber()
  step: number = 1;
}

export class IHostPVUVItem {
  pv: number;
  uv: number;
  date: Date;
}
