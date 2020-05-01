import ExpoExposureNotification from "./ExpoExposureNotification";
import { ExposureSession } from "./ExposureSession";
import {
  AuthorizationStatus,
  ExposureKey,
  ExposureRiskLevel,
  ExposureConfiguration,
} from "./types";

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
export async function activateSessionAsync(
  configuration: ExposureConfiguration
): Promise<ExposureSession> {
  const id: string = await ExpoExposureNotification.activateSessionAsync(
    configuration
  );
  return new ExposureSession(id, configuration);
}

export {
  AuthorizationStatus,
  ExposureKey,
  ExposureRiskLevel,
  ExposureSession,
  ExposureConfiguration,
};
