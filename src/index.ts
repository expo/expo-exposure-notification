import ExpoExposureNotification from "./ExpoExposureNotification";
import { ExposureSession } from "./ExposureSession";
import { AuthorizationStatus } from "./types";

export async function sampleMethod(str: string, num: number): Promise<string> {
  return ExpoExposureNotification.sampleMethod(str, num);
}

export async function getAuthorizationStatusAsync(): Promise<
  AuthorizationStatus
> {
  return ExpoExposureNotification.getAuthorizationStatusAsync();
}

export async function activateAsync(): Promise<ExposureSession> {
  const id: string = await ExpoExposureNotification.activateAsync();
  return new ExposureSession(id);
}

export { AuthorizationStatus, ExposureSession };
