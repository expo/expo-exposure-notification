import ExpoExposureNotification from "./ExpoExposureNotification";
import { ExposureSession } from "./ExposureSession";
import {
  AuthorizationStatus,
  ExposureNotificationStatus,
  ExposureKey,
  ExposureRiskLevel,
  ExposureConfiguration,
  ExposureDetectionSummary,
  ExposureInfo,
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

/**
 * Enables or disables exposure notification.
 * If the user hasn’t authorized exposure notification,
 * this method displays a user dialog requesting consent.
 */
export function setExposureNotificationEnabledAsync(
  enabled: boolean
): Promise<void> {
  return ExpoExposureNotification.setExposureNotificationEnabledAsync(enabled);
}

/**
 * Gets the status of exposure notifications.
 */
export function getExposureNotificationStatusAsync(): Promise<
  ExposureNotificationStatus
> {
  return ExpoExposureNotification.getExposureNotificationStatusAsync();
}

export {
  AuthorizationStatus,
  ExposureNotificationStatus,
  ExposureKey,
  ExposureRiskLevel,
  ExposureSession,
  ExposureConfiguration,
  ExposureDetectionSummary,
  ExposureInfo,
};
