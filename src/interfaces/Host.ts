import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class ISimpleFilter {
  @IsDateString() from: string;
  @IsDateString() to: string;
  @IsOptional()
  @IsNumber()
  step: number = 1;
}

export class IHostOverviewItem {
  /** 页面访问数 */
  pv: number;
  /** 独立访问数 */
  uv: number;
  /** 会话数 */
  vv: number;
  /** 平均访问时间 */
  avgTime: number;
  date: Date;
}
