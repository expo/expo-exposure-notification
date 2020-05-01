#import "ExExposureNotification.h"

@implementation ExExposureNotification

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument
                  numberParameter:(nonnull NSNumber *)numberArgument
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // TODO: Implement some actually useful functionality
  NSString *res = [NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@", numberArgument, stringArgument];
  resolve(res);
}

@end
