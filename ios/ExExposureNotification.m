//#if __has_include(<ExposureNotification/ExposureNotification.h>)
#import <ExposureNotification/ExposureNotification.h>
//#endif

#import "ExExposureNotification.h"

API_AVAILABLE(ios(13.4))
@interface ExExposureNotification ()

@property (nonatomic, strong) NSMutableDictionary<NSString *, ENExposureDetectionSession *> *sessions;
@property (nonatomic, assign) NSInteger nextSessionId;

@end

@implementation ExExposureNotification

RCT_EXPORT_MODULE()

- (instancetype)init
{
  if (self = [super init]) {
    _sessions = [NSMutableDictionary new];
    _nextSessionId = 1;
  }
  return self;
}

- (void) dealloc
{
  if (@available(iOS 13.4, *)) {
    for(ENExposureDetectionSession *session in _sessions) {
      [session invalidate];
    }
    _sessions = nil;
  }
}

RCT_EXPORT_METHOD(getAuthorizationStatusAsync:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    switch ([ENExposureDetectionSession authorizationStatus]) {
      case ENAuthorizationStatusAuthorized: resolve(@"authorized"); break;
      case ENAuthorizationStatusNotAuthorized: resolve(@"notAuthorized"); break;
      case ENAuthorizationStatusRestricted: resolve(@"restricted"); break;
      default: resolve(@"unknown"); break;
    }
  } else {
    [ExExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(activateSessionAsync:(NSDictionary *)configuration
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [ENExposureDetectionSession new];
    session.configuration = [ExExposureNotification configurationWithJSON:configuration];
    
    __weak ExExposureNotification *weakSelf = self;
    [session activateWithCompletionHandler:^(NSError * _Nullable error) {
      __strong ExExposureNotification *strongSelf = weakSelf;
      if (error) {
        [session invalidate];
        [ExExposureNotification rejectWithError:reject error:error];
      } else {
        if (strongSelf) {
          NSString *sessionId = [NSString stringWithFormat:@"%li", strongSelf.nextSessionId++];
          [strongSelf.sessions setValue:session forKey:sessionId];
          resolve(sessionId);
        } else {
          [session invalidate];
          [ExExposureNotification rejectWithMessage:reject message:@"deallocated"];
        }
      }
    }];
  } else {
    [ExExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(invalidateSessionAsync:(NSString *)sessionId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [ExExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    
    // TODO: Handle any thrown errors here?
    [session invalidate];
    
    // Remove session
    [_sessions removeObjectForKey:sessionId];
    resolve(nil);
  } else {
    [ExExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(addSessionDiagnosisKeysAsync:(NSString *)sessionId
                  keys:(NSArray<NSDictionary *> *)keys
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [ExExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    
    NSMutableArray<ENTemporaryExposureKey *> *exposureKeys = [NSMutableArray arrayWithCapacity:keys.count];
    
    // TODO: Convert
    // TODO: Check for max-keys
    
    [session addDiagnosisKeys:exposureKeys completionHandler:^(NSError * _Nullable error) {
      if (error) {
        [ExExposureNotification rejectWithError:reject error:error];
      } else {
        resolve(nil);
      }
    }];
  } else {
    [ExExposureNotification rejectWithNotSupported:reject];
  }
}

#pragma mark Helper functions

- (nullable ENExposureDetectionSession *)getSession:(NSString *)sessionId
API_AVAILABLE(ios(13.4)){
  return [_sessions valueForKey:sessionId];
}

+ (void) rejectWithMessage:(RCTPromiseRejectBlock)reject message:(NSString *)message
{
  reject(@"ExpoExposureNotification", message, nil);
}

+ (void) rejectWithError:(RCTPromiseRejectBlock)reject error:(NSError *)error
{
  reject(@"ExpoExposureNotification", error.localizedDescription, error);
}

+ (void) rejectWithNotSupported:(RCTPromiseRejectBlock)reject
{
  reject(@"ExpoExposureNotification", @"Not supported", nil);
}

+ (void) rejectWithInvalidSession:(RCTPromiseRejectBlock)reject sessionId:(NSString *)sessionId
{
  reject(@"ExpoExposureNotification", @"invalid session-id", nil);
}

+ (ENExposureConfiguration *) configurationWithJSON:(NSDictionary *)json
API_AVAILABLE(ios(13.4)){
  ENExposureConfiguration *conf = [ENExposureConfiguration new];
  
  // TODO: Convert json to ENExposureConfiguration
  
  return conf;
}

@end
