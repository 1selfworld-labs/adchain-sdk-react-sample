#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AdchainOfferwallViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(placementId, NSString)
RCT_EXPORT_VIEW_PROPERTY(onOfferwallOpened, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onOfferwallClosed, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onOfferwallError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRewardEarned, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCustomEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDataRequest, RCTDirectEventBlock)

// Export sendDataResponse method for handling data request responses
RCT_EXTERN_METHOD(sendDataResponse:(nonnull NSNumber *)reactTag requestId:(NSString *)requestId responseData:(NSDictionary *)responseData)

@end
