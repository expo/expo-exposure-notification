import ExpoExposureNotification from "./ExpoExposureNotification";
import { AuthorizationStatus } from "./types";

export async function sampleMethod(str: string, num: number): Promise<string> {
  return ExpoExposureNotification.sampleMethod(str, num);
}

export async function getAuthorizationStatusAsync(): Promise<
  AuthorizationStatus
> {
  return ExpoExposureNotification.getAuthorizationStatusAsync();
}

export { AuthorizationStatus };
