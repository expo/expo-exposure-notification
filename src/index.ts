import ExpoExposureNotification from "./ExpoExposureNotification";
import { ExposureSession } from "./ExposureSession";
import { AuthorizationStatus, ExposureKey, ExposureRiskLevel } from "./types";

/**
 * Retrieves the current authorization status of the app.
 */
export async function getAuthorizationStatusAsync(): Promise<
  AuthorizationStatus
> {
  return ExpoExposureNotification.getAuthorizationStatusAsync();
}

/**
 * Creates and activates a session.
 */
export async function activateAsync(): Promise<ExposureSession> {
  const id: string = await ExpoExposureNotification.activateAsync();
  return new ExposureSession(id);
}

export { AuthorizationStatus, ExposureKey, ExposureRiskLevel, ExposureSession };
