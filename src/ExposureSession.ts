import ExpoExposureNotification from "./ExpoExposureNotification";
import { ExposureKey } from "./types";

export class ExposureSession {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
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
    return ExpoExposureNotification.addDiagnosisKeysAsync(
      this.id,
      serializableKeys
    );
  }

  /**
   * Stops any outstanding operations and invalidates this object.
   */
  invalidateAsync(): Promise<void> {
    return ExpoExposureNotification.invalidateAsync(this.id);
  }
}
