import ExpoExposureNotification from "./ExpoExposureNotification";
import {
  ExposureKey,
  ExposureConfiguration,
  ExposureDetectionSummary,
} from "./types";

export class ExposureSession {
  public readonly id: string;
  public readonly configuration: ExposureConfiguration;

  constructor(id: string, configuration: ExposureConfiguration) {
    this.id = id;
    this.configuration = configuration;
  }

  /**
   * Adds the specified keys to the session to allow them to be checked for exposure.
   *
   * It is allowed to add new diagnosis keys before the promise of the previous call to
   * `addDiagnosisKeysAsync` has completed. This makes it possible to add keys with a
   * higher fill rate. When doing so, make sure to call `getMaximumKeyCountAsync` prior
   * to adding new keys, in order to check how many new keys may be added.
   */
  addDiagnosisKeysAsync(keys: ExposureKey[]): Promise<void> {
    return ExpoExposureNotification.addSessionDiagnosisKeysAsync(this.id, keys);
  }

  /**
   * The maximum number of keys that can be outstanding.
   * The value of this property reflects the number of keys passed to addDiagnosisKeysAsync
   * but have not yet completed processing.
   */
  getMaximumKeyCountAsync(): Promise<number> {
    return ExpoExposureNotification.getSessionMaximumKeyCountAsync(this.id);
  }

  /**
   * Indicates that all of the available keys have been provided.
   */
  finishDiagnosisKeysAsync(): Promise<ExposureDetectionSummary | void> {
    return ExpoExposureNotification.finishSessionDiagnosisKeysAsync(this.id);
  }

  /**
   * Stops any outstanding operations and invalidates this object.
   */
  invalidateAsync(): Promise<void> {
    return ExpoExposureNotification.invalidateSessionAsync(this.id);
  }
}
