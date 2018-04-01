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
  browserName: IPair[];
  deviceType: IPair[];
  city: IPair[];
}
