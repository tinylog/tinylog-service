import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class ISimpleFilter {
  @IsDateString() from: string;
  @IsDateString() to: string;
  @IsOptional()
  @IsNumber()
  step: number = 1;
}

export class IHostOverviewItem {
  /** 页面访问数（网页浏览量） */
  pv: number;
  /** 独立访问数（用户数） */
  uv: number;
  /** 会话数 */
  vv: number;
  /** 平均访问时间 */
  avgVisitTime: number;
  /** 平均会话访问页面 */
  avgPageCount: number;
  date: Date;
}

export class IDistributionItem {
  referrer?: string;
  country?: string;
  lang?: string;
  region?: string;
  city?: string;
  osName?: string;
  browserName?: string;
  engineName?: string;
  hostname?: string;
  org?: string;
  count: number;
}

export class ISlowestAssetItem {
  avgDuration: number;
  avgRedirect: number;
  avgRequest: number;
  avgLookupDomain: number;
  name: string;
  entryType: string;
}
