import { IsDateString, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Host } from '../entities/Host';

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

export class ISlowestPageItem {
  avgLoadPage: number;
  avgDomReady: number;
  avgRedirect: number;
  avgLookupDomain: number;
  avgTtfb: number;
  avgRequest: number;
  avgTcp: number;
  avgLoadEvent: number;
  url: string;
}

export class ICreateNewHost {
  @IsString() domain: string;
  @IsString() timezone: string;
}

export class IDeleteHost {
  @IsArray() list: number[];
}

export class IUpdateHost implements Partial<Host> {
  @IsString()
  @IsOptional()
  timezone?: string;
}
