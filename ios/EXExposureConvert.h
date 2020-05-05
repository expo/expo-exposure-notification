//#if __has_include(<ExposureNotification/ExposureNotification.h>)
#import <ExposureNotification/ExposureNotification.h>
//#endif

@interface EXExposureConvert : NSObject

+ (ENExposureConfiguration *) configurationWithJSON:(NSDictionary *)json;

@end
