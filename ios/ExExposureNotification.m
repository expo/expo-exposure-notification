//#if __has_include(<ExposureNotification/ExposureNotification.h>)
#import <ExposureNotification/ExposureNotification.h>
//#endif

#import "EXExposureNotification.h"
#import "EXExposureConvert.h"

API_AVAILABLE(ios(13.4))
@interface EXExposureNotification ()

@property (nonatomic, strong) ENManager *manager;
@property (nonatomic, strong) NSMutableDictionary<NSString *, ENExposureDetectionSession *> *sessions;
@property (nonatomic, assign) NSInteger nextSessionId;

@end

@implementation EXExposureNotification

RCT_EXPORT_MODULE()

- (instancetype)init
{
  if (self = [super init]) {
    if (@available(iOS 13.4, *)) {
      _manager = [ENManager new];
    }
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
    if (_manager) {
      [_manager invalidate];
      _manager = nil;
    }
  }
}

+ (BOOL)requiresMainQueueSetup
{
  // Needed because we override init
  return YES;
}


# pragma mark Exposure Notification Manager

RCT_EXPORT_METHOD(setExposureNotificationEnabledAsync:(BOOL)enabled
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    [_manager setExposureNotificationEnabled:enabled completionHandler:^(NSError * _Nullable error) {
      if (error) {
        [EXExposureNotification rejectWithError:reject error:error];
      } else {
        resolve(nil);
      }
    }];
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(getExposureNotificationStatusAsync:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    switch (_manager.exposureNotificationStatus) {
      case ENStatusActive: resolve(@"active"); break;
      case ENStatusBluetoothOff: resolve(@"bluetoothOff"); break;
      case ENStatusDisabled: resolve(@"disabled"); break;
      case ENStatusRestricted: resolve(@"restricted"); break;
      case ENStatusUnknown:
      default: resolve(@"unknown"); break;
    }
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
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
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}


# pragma mark Exposure Notification Session

RCT_EXPORT_METHOD(activateSessionAsync:(NSDictionary *)jsonConfig
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    
    // Convert & validate configuration
    ENExposureConfiguration *exposureConfig;
    @try {
      exposureConfig = [EXExposureConvert configurationWithJSON:jsonConfig];
    } @catch (NSException *exception) {
      return [EXExposureNotification rejectWithException:reject exception:exception];
    }
    
    // Create session
    ENExposureDetectionSession *session = [ENExposureDetectionSession new];
    session.configuration = exposureConfig;
    
    // Activate session
    __weak EXExposureNotification *weakSelf = self;
    [session activateWithCompletionHandler:^(NSError * _Nullable error) {
      __strong EXExposureNotification *strongSelf = weakSelf;
      if (error) {
        [session invalidate];
        [EXExposureNotification rejectWithError:reject error:error];
      } else {
        if (strongSelf) {
          NSString *sessionId = [NSString stringWithFormat:@"%li", strongSelf.nextSessionId++];
          [strongSelf.sessions setValue:session forKey:sessionId];
          resolve(sessionId);
        } else {
          [session invalidate];
          [EXExposureNotification rejectWithMessage:reject message:@"deallocated"];
        }
      }
    }];
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(invalidateSessionAsync:(NSString *)sessionId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [EXExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    
    // TODO: Handle any thrown errors here?
    [session invalidate];
    
    // Remove session
    [_sessions removeObjectForKey:sessionId];
    resolve(nil);
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(addSessionDiagnosisKeysAsync:(NSString *)sessionId
                  keys:(NSArray<NSDictionary *> *)keys
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [EXExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    
    // Convert keys from json to ENTemporaryExposureKey
    NSArray<ENTemporaryExposureKey *> *exposureKeys = [EXExposureConvert exposureKeysWithJSON:keys];
    
    // Make sure the max-count is not exceeded
    if (exposureKeys.count > session.maximumKeyCount) {
      return [EXExposureNotification rejectWithMessage:reject message:@"Maximum key count reached"];
    }
    
    // Add diagnosis keys
    [session addDiagnosisKeys:exposureKeys completionHandler:^(NSError * _Nullable error) {
      if (error) {
        [EXExposureNotification rejectWithError:reject error:error];
      } else {
        resolve(nil);
      }
    }];
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(getSessionMaximumKeyCountAsync:(NSString *)sessionId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [EXExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    resolve(@(session.maximumKeyCount));
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(finishSessionDiagnosisKeysAsync:(NSString *)sessionId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [EXExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    
    [session finishedDiagnosisKeysWithCompletionHandler:^(ENExposureDetectionSummary * _Nullable summary, NSError * _Nullable error) {
      if (error) {
        [EXExposureNotification rejectWithError:reject error:error];
      } else if (summary) {
        resolve([EXExposureConvert jsonWithDetectionSummary:summary]);
      } else {
        resolve(nil);
      }
    }];
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
  }
}

RCT_EXPORT_METHOD(getSessionExposureInfoAsync:(NSString *)sessionId
                  maximumCount:(NSNumber *)maximumCount
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 13.4, *)) {
    ENExposureDetectionSession *session = [self getSession:sessionId];
    if (!session) return [EXExposureNotification rejectWithInvalidSession:reject sessionId:sessionId];
    
    [session getExposureInfoWithMaximumCount:maximumCount.unsignedIntegerValue completionHandler:^(NSArray<ENExposureInfo *> * _Nullable exposures, BOOL done, NSError * _Nullable error) {
      if (error) {
        [EXExposureNotification rejectWithError:reject error:error];
      } else {
        resolve(@{
          @"done": @(done),
          @"exposures": [EXExposureConvert jsonWithExposureInfoArray:exposures ?: @[]]
                });
      }
    }];
  } else {
    [EXExposureNotification rejectWithNotSupported:reject];
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

+ (void) rejectWithException:(RCTPromiseRejectBlock)reject exception:(NSException *)exception
{
  reject(@"ExpoExposureNotification", exception.reason ?: exception.name, nil);
}

+ (void) rejectWithNotSupported:(RCTPromiseRejectBlock)reject
{
  reject(@"ExpoExposureNotification", @"Not supported", nil);
}

+ (void) rejectWithInvalidSession:(RCTPromiseRejectBlock)reject sessionId:(NSString *)sessionId
{
  reject(@"ExpoExposureNotification", @"invalid session-id", nil);
}

@end
