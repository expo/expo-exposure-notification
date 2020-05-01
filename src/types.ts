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
