export type AuthorizationStatus =
  | "authorized"
  | "notAuthorized"
  | "restricted"
  | "unknown";

// TODO: The values of these constants are INCORRECT.
// I could not find the actual values online yet.
// https://developer.apple.com/documentation/exposurenotification/enrisklevel?language=objc
export const ExposureRiskLevel = {
  INVALID: -1,
  LOWEST: 0,
  LOW: 1,
  LOW_MEDIUM: 2,
  MEDIUM: 3,
  MEDIUM_HIGH: 4,
  HIGH: 5,
  VERY_HIGH: 6,
  HIGHEST: 7,
};

export type ExposureKey = {
  transmissionRiskLevel: number;
  keyData: object;
  rollingStartNumber: number;
  intervalNumber: number;
};
