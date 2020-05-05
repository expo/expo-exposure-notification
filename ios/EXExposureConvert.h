//#if __has_include(<ExposureNotification/ExposureNotification.h>)
#import <ExposureNotification/ExposureNotification.h>
//#endif

API_AVAILABLE(ios(13.4))
@interface EXExposureConvert : NSObject

+ (nonnull ENExposureConfiguration *) configurationWithJSON:(nonnull id)json;
+ (nonnull ENTemporaryExposureKey *) exposureKeyWithJSON:(nonnull id)json;
+ (nonnull NSArray<ENTemporaryExposureKey *> *) exposureKeysWithJSON:(nonnull id)json;
+ (nonnull NSDictionary*) jsonWithDetectionSummary:(nonnull ENExposureDetectionSummary *)detectionSummary;
+ (nonnull NSDictionary*) jsonWithExposureInfo:(nonnull ENExposureInfo *)exposureInfo;
+ (nonnull NSArray<NSDictionary *> *) jsonWithExposureInfoArray:(nonnull NSArray<ENExposureInfo *> *)exposureInfoArray;

@end
