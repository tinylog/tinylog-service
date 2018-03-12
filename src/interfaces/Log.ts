import Session from '../entities/Session';
import Visiter from '../entities/Visiter';
import Page from '../entities/Page';
import Asset from '../entities/Asset';
import { IsString, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class IInitialize implements Partial<Session>, Partial<Visiter> {
  @IsString() referrer: string;
  @IsString() lang: string;
  @IsString() ua: string;
  @IsString() os: string;
}

export class IPageInfo implements Partial<Page> {
  @IsString() url: string;
  @IsDateString() startTime: Date;
  @IsOptional()
  @IsNumber()
  prePageId?: number;
  @IsString() referrer: string;
  @IsNumber() loadPage: number;
  @IsNumber() domReady: number;
  @IsNumber() redirect: number;
  @IsNumber() lookupDomain: number;
  @IsNumber() ttfb: number;
  @IsNumber() request: number;
  @IsNumber() tcp: number;
  @IsNumber() loadEvent: number;
}

export class IExit {
  @IsNumber() pageId: number;
  @IsDateString() exitTime: string;
}

export class IAsset implements Partial<Asset> {
  @IsString() entryType: string;
  @IsNumber() initiatorType: number;
  @IsString() name: string;
  @IsNumber() redirect: number;
  @IsNumber() lookupDomain: number;
  @IsNumber() request: number;
  @IsNumber() duration: number;
}

export class IAssetsInfo {
  @IsNumber() pageId: number;
  @IsArray()
  @Type(() => IAsset)
  assets: IAsset[];
}
