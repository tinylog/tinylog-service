export class IPair {
  referrer?: string;
  browserName?: string;
  deviceType?: string;
  city?: string;
  count: number;
}
export class IActiveSession {
  count: number;
  referrer: IPair[];
  country: IPair[];
  org: IPair[];
  browserName: IPair[];
  deviceType: IPair[];
  city: IPair[];
}

export class IActivePage {
  count: number;
  url: string;
}
