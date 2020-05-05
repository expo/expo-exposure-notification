#import "EXExposureConvert.h"

@implementation EXExposureConvert

+ (id)fieldWithJSON:(id)json key:(nonnull NSString *)key classType:(Class)classType
{
  id val = json[key];
  if (!val) {
    @throw [NSException
            exceptionWithName:@"FieldNotFoundException"
            reason:[NSString stringWithFormat:@"Field '%@' not found", key]
            userInfo:nil];
  }
  if (![val isKindOfClass:classType]) {
     @throw [NSException
             exceptionWithName:@"InvalidTypeException"
             reason:[NSString stringWithFormat:@"Field is not a %@ '%@'", NSStringFromClass(classType), key]
             userInfo:nil];
   }
  return val;
}

+ (nonnull NSArray<NSNumber *> *)numberArrayWithJSON:(id)json key:(nonnull NSString *)key count:(NSUInteger)count
{
  NSArray<NSNumber *> *array = [EXExposureConvert fieldWithJSON:json key:key classType:[NSArray class]];
  if (array.count != count) {
    @throw [NSException
    exceptionWithName:@"InvalidTypeException"
    reason:[NSString stringWithFormat:@"Field '%@' should be an array of exact %lu elements", key, count]
    userInfo:nil];
  }
  for (NSNumber *val in array) {
    if (![val isKindOfClass:[NSNumber class]]) {
      @throw [NSException
              exceptionWithName:@"InvalidTypeException"
              reason:[NSString stringWithFormat:@"Field '%@' should be an array of numbers", key]
              userInfo:nil];
    }
  }
  
  return array;
}

+ (double)doubleWithJSON:(id)json key:(nonnull NSString *)key
{
  NSNumber *num = [EXExposureConvert fieldWithJSON:json key:key classType:[NSNumber class]];
  return num.doubleValue;
}

+ (nonnull NSData *)dataWithJSON:(id)json key:(nonnull NSString *)key
{
  NSString *base64 = [EXExposureConvert fieldWithJSON:json key:key classType:[NSString class]];
  NSData *data = [[NSData alloc]initWithBase64EncodedString:base64 options:0];
  return data;
}

+ (nonnull ENExposureConfiguration *) configurationWithJSON:(nonnull id)json
{
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

+ (nonnull ENTemporaryExposureKey *) exposureKeyWithJSON:(nonnull id)json
{
  ENTemporaryExposureKey *exposureKey = [ENTemporaryExposureKey new];
  
  exposureKey.transmissionRiskLevel = (ENRiskLevel) [EXExposureConvert doubleWithJSON:json key:@"transmissionRiskLevel"];
  exposureKey.keyData = [EXExposureConvert dataWithJSON:json key:@"keyData"];
  exposureKey.rollingStartNumber = (ENIntervalNumber) [EXExposureConvert doubleWithJSON:json key:@"rollingStartNumber"];
  
  return exposureKey;
}

+ (nonnull NSArray<ENTemporaryExposureKey *> *) exposureKeysWithJSON:(nonnull id)json
{
  NSArray<NSDictionary *> *array = json;
  if (![array isKindOfClass:[NSArray class]]) {
    @throw [NSException
            exceptionWithName:@"InvalidTypeException"
            reason:[NSString stringWithFormat:@"Value is not a array"]
            userInfo:nil];
  }
  
  NSMutableArray<ENTemporaryExposureKey *> *exposureKeys = [NSMutableArray arrayWithCapacity:array.count];
  for (id val in array) {
    [exposureKeys addObject:[EXExposureConvert exposureKeyWithJSON:val]];
  }
  return exposureKeys;
}

+ (nonnull NSDictionary*) jsonWithDetectionSummary:(nonnull ENExposureDetectionSummary *)detectionSummary
{
  return @{
    @"daysSinceLastExposure": @(detectionSummary.daysSinceLastExposure),
    @"matchedKeyCount": @(detectionSummary.matchedKeyCount),
    @"maximumRiskScore": @(detectionSummary.maximumRiskScore),
  };
}

+ (nonnull NSDictionary*) jsonWithExposureInfo:(nonnull ENExposureInfo *)exposureInfo
{
  return @{
    @"attenuationValue": @(exposureInfo.attenuationValue),
    @"date": exposureInfo.date,
    @"duration": @(exposureInfo.duration),
    @"totalRiskScore": @(exposureInfo.totalRiskScore),
    @"transmissionRiskLevel": @(exposureInfo.transmissionRiskLevel),
  };
}

+ (nonnull NSArray<NSDictionary *> *) jsonWithExposureInfoArray:(nonnull NSArray<ENExposureInfo *> *)exposureInfoArray
{
  NSMutableArray<NSDictionary *> *jsonArray = [NSMutableArray arrayWithCapacity:exposureInfoArray.count];
  for (ENExposureInfo *exposureInfo in exposureInfoArray) {
    [jsonArray addObject:[EXExposureConvert jsonWithExposureInfo:exposureInfo]];
  }
  return jsonArray;
}

@end
