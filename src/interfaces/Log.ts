import Session from '../entities/Session';
import Visiter from '../entities/Visiter';
import Page from '../entities/Page';
import Asset from '../entities/Asset';

export class IInitialize implements Partial<Session>, Partial<Visiter> {
  referer: string;
  lang: string;
  ua: string;
  os: string;
}

export class IPageInfo implements Partial<Page> {
  url: string;
  startTime: number;
  prePageId?: number;
  referrer: string;
  loadPage: number;
  domReady: number;
  redirect: number;
  lookupDomain: number;
  ttfb: number;
  request: number;
  tcp: number;
  loadEvent: number;
}

export class IAssetsInterface {
  assets: Array<Partial<Asset>>;
}

export class IExit {
  pageId: number;
  exitTime: number;
}

export class IAssetsInfo implements IAssetsInterface {
  pageId: number;
  assets: Array<{
    entryType: string;
    initiatorType: number;
    name: string;
    redirect: number;
    lookupDomain: number;
    request: number;
    duration: number;
  }>;
}
