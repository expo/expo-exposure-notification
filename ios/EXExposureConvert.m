#import "EXExposureConvert.h"

@implementation EXExposureConvert

+ (nonnull NSArray<NSNumber *> *)numberArrayWithJSON:(nonnull NSDictionary *)json key:(nonnull NSString *)key count:(NSUInteger)count
{
  NSArray<NSNumber *> *array = json[key];
  if (!array) {
    @throw [NSException
            exceptionWithName:@"FieldNotFoundException"
            reason:[NSString stringWithFormat:@"Field '%@' not found", key]
            userInfo:nil];
  }
  if (array.count != count) {
    @throw [NSException
    exceptionWithName:@"InvalidFieldTypeException"
    reason:[NSString stringWithFormat:@"Field '%@' should be an array of exact %lu elements", key, count]
    userInfo:nil];
  }
  for (NSNumber *val in array) {
    if (![val isKindOfClass:[NSNumber class]]) {
      @throw [NSException
              exceptionWithName:@"InvalidFieldTypeException"
              reason:[NSString stringWithFormat:@"Field '%@' should be an array of numbers", key]
              userInfo:nil];
    }
  }
  
  return array;
}

+ (double)doubleWithJSON:(NSDictionary *)json key:(nonnull NSString *)key
{
  NSNumber *val = json[key];
  if (!val) {
    @throw [NSException
            exceptionWithName:@"FieldNotFoundException"
            reason:[NSString stringWithFormat:@"Field not found '%@'", key]
            userInfo:nil];
  }
  if (![val isKindOfClass:[NSNumber class]]) {
    @throw [NSException
            exceptionWithName:@"InvalidFieldTypeException"
            reason:[NSString stringWithFormat:@"Field is not a number '%@'", key]
            userInfo:nil];
  }
  return val.doubleValue;
}

+ (nonnull ENExposureConfiguration *) configurationWithJSON:(nonnull NSDictionary *)json
API_AVAILABLE(ios(13.4)){
  ENExposureConfiguration *conf = [ENExposureConfiguration new];
  
  conf.attenuationScores = [EXExposureConvert numberArrayWithJSON:json key:@"attenuationScores" count:8];
  conf.attenuationWeight = [EXExposureConvert doubleWithJSON:json key:@"attenuationWeight"];
  conf.daysSinceLastExposureScores = [EXExposureConvert numberArrayWithJSON:json key:@"daysSinceLastExposureScores" count:8];
  conf.daysSinceLastExposureWeight = [EXExposureConvert doubleWithJSON:json key:@"daysSinceLastExposureWeight"];
  conf.durationScores = [EXExposureConvert numberArrayWithJSON:json key:@"durationScores" count:8];
  conf.durationWeight = [EXExposureConvert doubleWithJSON:json key:@"durationWeight"];
  conf.transmissionRiskScores = [EXExposureConvert numberArrayWithJSON:json key:@"transmissionRiskScores" count:8];
  conf.transmissionRiskWeight = [EXExposureConvert doubleWithJSON:json key:@"transmissionRiskWeight"];
  
  if (json[@"minimumRiskScore"]) {
    conf.minimumRiskScore = (ENRiskScore) [EXExposureConvert doubleWithJSON:json key:@"minimumRiskScore"];
  }
  
  return conf;
}

@end
