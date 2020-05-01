import ExpoExposureNotification from "./ExpoExposureNotification";

export class ExposureSession {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  invalidateAsync(): Promise<void> {
    return ExpoExposureNotification.invalidateAsync(this.id);
  }
}
