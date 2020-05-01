#if __has_include(<ExposureNotification/ExposureNotification.h>)
#import <ExposureNotification/ExposureNotification.h>
#endif

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

RCT_EXPORT_METHOD(getAuthorizationStatusAsync:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
#if __has_include(<ExposureNotification/ExposureNotification.h>)
  if (@available(iOS 13.4, *)) {
    switch ([ENExposureDetectionSession authorizationStatus]) {
      case ENAuthorizationStatusAuthorized: resolve(@"authorized"); break;
      case ENAuthorizationStatusNotAuthorized: resolve(@"notAuthorized"); break;
      case ENAuthorizationStatusRestricted: resolve(@"restricted"); break;
      default: resolve(@"unknown"); break;
    }
  } else {
    resolve(@"notSupported");
  }
#else
  resolve(@"notSupported");
#endif
}

@end
