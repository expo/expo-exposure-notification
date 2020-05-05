export type AuthorizationStatus =
  | "authorized"
  | "notAuthorized"
  | "restricted"
  | "unknown";

export type ExposureNotificationStatus =
  | "active"
  | "bluetoothOff"
  | "disabled"
  | "restricted"
  | "unknown";

// https://developer.apple.com/documentation/exposurenotification/enrisklevel?language=objc
export const ExposureRiskLevel = {
  INVALID: 0,
  LOWEST: 1,
  LOW: 10,
  LOW_MEDIUM: 25,
  MEDIUM: 50,
  MEDIUM_HIGH: 65,
  HIGH: 80,
  VERY_HIGH: 90,
  HIGHEST: 100,
};

export type ExposureKey = {
  /**
   * The risk of transmission associated with the person a key came from.
   */
  transmissionRiskLevel: number;

  /**
   * The temporary exposure key information.
   * Encoded as base-64.
   */
  keyData: string;

  /**
   * A number that indicates when a key’s rolling period started.
   */
  rollingStartNumber: number;
};

export type ExposureConfiguration = {
  /**
   * The user’s minimum risk score.
   * The framework excludes exposure incidents with scores lower
   * than the value of this property. The default is no minimum.
   */
  minimumRiskScore?: number;

  /**
   * Scores that indicate Bluetooth signal strength.
   * Must contain 8 scores, one for each category of signal:
   * attenuationScores[0] when Attenuation > 73.
   * attenuationScores[1] when 73 >= Attenuation > 63.
   * attenuationScores[2] when 63 >= Attenuation > 51.
   * attenuationScores[3] when 51 >= Attenuation > 33.
   * attenuationScores[4] when 33 >= Attenuation > 27.
   * attenuationScores[5] when 27 >= Attenuation > 15.
   * attenuationScores[6] when 15 >= Attenuation > 10.
   * attenuationScores[7] when 10 >= Attenuation.
   */
  attenuationScores: number[];

  /**
   * The weight applied to a Bluetooth signal strength score.
   * Must be in the range 0.001-100.
   */
  attenuationWeight: number;

  /**
   * Scores that indicate the days since the user’s last exposure.
   * Must contain 8 scores, one for each category of time:
   * daysSinceLastExposureScores[0] when Days >= 14.
   * daysSinceLastExposureScores[1] else Days >= 12.
   * daysSinceLastExposureScores[2] else Days >= 10.
   * daysSinceLastExposureScores[3] else Days >= 8.
   * daysSinceLastExposureScores[4] else Days >= 6.
   * daysSinceLastExposureScores[5] else Days >= 4.
   * daysSinceLastExposureScores[6] else Days >= 2.
   * daysSinceLastExposureScores[7] else Days >= 0.
   */
  daysSinceLastExposureScores: number[];

  /**
   * The weight assigned to a score applied to the days since the user’s exposure.
   * Must be in the range 0.001-100.
   */
  daysSinceLastExposureWeight: number;

  /**
   * Scores that indicate the duration of a user’s exposure.
   * Must contain 8 scores, one for each range of duration:
   * durationScores[0] when Duration == 0.
   * durationScores[1] else Duration <= 5.
   * durationScores[2] else Duration <= 10.
   * durationScores[3] else Duration <= 15.
   * durationScores[4] else Duration <= 20.
   * durationScores[5] else Duration <= 25.
   * durationScores[6] else Duration <= 30.
   * durationScores[7] else Duration > 30.
   */
  durationScores: number[];

  /**
   * The weight assigned to a score applied to the duration of the user’s exposure.
   * Must be in the range 0.001-100.
   */
  durationWeight: number;

  /**
   * Scores for the user’s estimated risk of transmission.
   * Must contain 8 scores, one for each category of risk:
   * transmissionRiskScores[0] for ExposureRiskLevel.LOWEST.
   * transmissionRiskScores[1] for ExposureRiskLevel.LOW.
   * transmissionRiskScores[2] for ExposureRiskLevel.LOW_MEDIUM.
   * transmissionRiskScores[3] for ExposureRiskLevel.MEDIUM.
   * transmissionRiskScores[4] for ExposureRiskLevel.MEDIUM_HIGH.
   * transmissionRiskScores[5] for ExposureRiskLevel.HIGH.
   * transmissionRiskScores[6] for ExposureRiskLevel.VERY_HIGH.
   * transmissionRiskScores[7] for ExposureRiskLevel.HIGHEST.
   */
  transmissionRiskScores: number[];

  /**
   * The weight assigned to a score applied to the user’s risk of transmission.
   * Must be in the range 0.001-100.
   */
  transmissionRiskWeight: number;
};

export type ExposureDetectionSummary = {
  /**
   * Number of days since the most recent exposure.
   */
  daysSinceLastExposure: number;

  /**
   * The number of keys that matched for an exposure detection.
   */
  matchedKeyCount: number;

  /**
   * The highest risk score of all exposure incidents.
   */
  maximumRiskScore: number;
};

/**
 * The risk of transmission associated with the person a key came from.
 */
export type ExposureInfo = {
  /**
   * The signal strength of the peer device at the time of the exposure.
   * The attenuation is the Reported Transmit Power - Measured RSSI.
   */
  attenuationValue: number;

  /**
   * The date the exposure occurred.
   */
  date: Date;

  /**
   * The length of time in minutes that the contact was in proximity to the user.
   * The minimum duration is 5 minutes. Other valid values are 10, 15, 20, 25,
   * and 30. A duration value caps at 30 minutes.
   */
  duration: number;

  /**
   * The total risk calculated for an exposure incident.
   */
  totalRiskScore: number;

  /**
   * The transmission risk associated with a diagnosis key.
   */
  transmissionRiskLevel: number;
};
