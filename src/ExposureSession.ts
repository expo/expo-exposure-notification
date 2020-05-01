import ExpoExposureNotification from "./ExpoExposureNotification";
import { ExposureKey, ExposureConfiguration } from "./types";

export class ExposureSession {
  public readonly id: string;
  public readonly configuration: ExposureConfiguration;

  constructor(id: string, configuration: ExposureConfiguration) {
    this.id = id;
    this.configuration = configuration;
  }

  /**
   * Adds the specified keys to the session to allow them to be checked for exposure.
   */
  addDiagnosisKeysAsync(keys: ExposureKey[]): Promise<void> {
    const serializableKeys = keys.map((key) => {
      // TODO: verify and convert
      const {
        transmissionRiskLevel,
        keyData,
        rollingStartNumber,
        intervalNumber,
      } = key;
      return {
        transmissionRiskLevel,
        rollingStartNumber,
        intervalNumber,
        keyData,
      };
    });
    return ExpoExposureNotification.addSessionDiagnosisKeysAsync(
      this.id,
      serializableKeys
    );
  }

  /**
   * Stops any outstanding operations and invalidates this object.
   */
  invalidateAsync(): Promise<void> {
    return ExpoExposureNotification.invalidateSessionAsync(this.id);
  }
}
