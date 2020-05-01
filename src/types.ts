export type AuthorizationStatus =
  | "authorized"
  | "notAuthorized"
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
  transmissionRiskLevel: number;
  keyData: object;
  rollingStartNumber: number;
  intervalNumber: number;
};

export type ExposureConfiguration = {
  /**
   * It must contain 8 scores, one for each bucket, as defined here:
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
   * It must be in the range 0-100.
   */
  attenuationWeight: number;

  /**
   * It must contain 8 scores, one for each bucket, as defined here:
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
   * It must be in the range 0-100.
   */
  daysSinceLastExposureWeight: number;

  /**
   * It must contain 8 scores, one for each bucket, as defined here:
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
   * It must be in the range 0-100.
   */
  durationWeight: number;

  /**
   * It must contain 8 scores, one for each bucket, as defined here:
   * transmissionRiskScores[0] for ENRiskLevelLowest.
   * transmissionRiskScores[1] for ENRiskLevelLow.
   * transmissionRiskScores[2] for ENRiskLevelLowMedium.
   * transmissionRiskScores[3] for ENRiskLevelMedium.
   * transmissionRiskScores[4] for ENRiskLevelMediumHigh.
   * transmissionRiskScores[5] for ENRiskLevelHigh.
   * transmissionRiskScores[6] for ENRiskLevelVeryHigh.
   * transmissionRiskScores[7] for ENRiskLevelHighest.
   */
  transitionRiskScores: number[];

  /**
   * It must be in the range 0-100.
   */
  transmissionRiskWeight: number;
};
