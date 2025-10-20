import React, { useEffect, useRef } from 'react';
import {
  requireNativeComponent,
  ViewStyle,
  UIManager,
  findNodeHandle,
  Platform,
  Dimensions
} from 'react-native';

/**
 * Event types for Offerwall callbacks
 */
interface OfferwallErrorEvent {
  nativeEvent: {
    error: string;
  };
}

interface OfferwallRewardEvent {
  nativeEvent: {
    amount: number;
  };
}

interface OfferwallHeightChangeEvent {
  nativeEvent: {
    height: number;
  };
}

/**
 * Custom event from WebView
 * @since 1.0.41
 */
interface OfferwallCustomEvent {
  nativeEvent: {
    eventType: string;
    payload: any;
  };
}

/**
 * Data request from WebView
 * @since 1.0.41
 */
interface OfferwallDataRequestEvent {
  nativeEvent: {
    requestId: string;
    requestType: string;
    params: any;
  };
}

/**
 * Props for AdchainOfferwallView component
 */
export interface AdchainOfferwallViewProps {
  /** Placement ID for tracking and analytics */
  placementId: string;
  /** View style */
  style?: ViewStyle;
  /** Callback when offerwall is opened */
  onOfferwallOpened?: () => void;
  /** Callback when offerwall is closed */
  onOfferwallClosed?: () => void;
  /** Callback when an error occurs */
  onOfferwallError?: (error: string) => void;
  /** Callback when user earns a reward */
  onRewardEarned?: (amount: number) => void;

  // ===== NEW: Event Bridge Callbacks (v1.0.41+) =====

  /**
   * Callback when WebView sends a custom event
   * @param eventType - Type of event (e.g., "navigate", "show_toast")
   * @param payload - Event data
   * @since 1.0.41
   */
  onCustomEvent?: (eventType: string, payload: any) => void;

  /**
   * Callback when WebView requests data from the app
   * @param requestType - Type of data requested (e.g., "user_points", "user_profile")
   * @param params - Request parameters
   * @returns Data to send back to WebView, or null/undefined if unavailable
   * @since 1.0.41
   */
  onDataRequest?: (requestType: string, params: any) => any;
}

/**
 * Native component interface
 */
interface NativeOfferwallViewProps {
  style?: ViewStyle;
  placementId?: string;  // iOS uses property, Android uses command
  onOfferwallOpened?: () => void;
  onOfferwallClosed?: () => void;
  onOfferwallError?: (event: OfferwallErrorEvent) => void;
  onRewardEarned?: (event: OfferwallRewardEvent) => void;
  onHeightChange?: (event: OfferwallHeightChangeEvent) => void;
  onCustomEvent?: (event: OfferwallCustomEvent) => void;  // NEW
  onDataRequest?: (event: OfferwallDataRequestEvent) => void;  // NEW
}

// Require native component
const NativeOfferwallView = requireNativeComponent<NativeOfferwallViewProps>('AdchainOfferwallView');

/**
 * AdChain Offerwall View Component
 *
 * This component embeds the AdChain Offerwall WebView in a React Native container.
 * It can be used in tabs, modals, or any other container.
 *
 * @example
 * ```tsx
 * <AdchainOfferwallView
 *   placementId="main_tab_offerwall"
 *   style={{ flex: 1 }}
 *   onOfferwallOpened={() => console.log('Offerwall opened')}
 *   onOfferwallError={(error) => console.error('Error:', error)}
 *   onRewardEarned={(amount) => console.log('Earned:', amount)}
 * />
 * ```
 */
export const AdchainOfferwallView = React.forwardRef<any, AdchainOfferwallViewProps>((
  {
    placementId,
    style,
    onOfferwallOpened,
    onOfferwallClosed,
    onOfferwallError,
    onRewardEarned,
    onCustomEvent,
    onDataRequest,
  },
  ref
) => {
  const viewRef = useRef(null);

  // Merge external ref with internal ref
  React.useImperativeHandle(ref, () => viewRef.current);

  // Load offerwall using UIManager command when placementId changes
  useEffect(() => {
    if (placementId && viewRef.current) {
      const viewId = findNodeHandle(viewRef.current);

      if (viewId) {
        if (Platform.OS === 'android') {
          try {
            // Use command name directly (React Native 0.74+ style)
            UIManager.dispatchViewManagerCommand(
              viewId,
              'loadOfferwall',
              [placementId]
            );
          } catch (error) {
            console.error('[OfferwallView] Failed to dispatch command:', error);
          }
        }
      }
    }
  }, [placementId]);

  // Handle native error events
  const handleOfferwallError = (event: OfferwallErrorEvent) => {
    if (onOfferwallError) {
      onOfferwallError(event.nativeEvent.error);
    }
  };

  // Handle native reward events
  const handleRewardEarned = (event: OfferwallRewardEvent) => {
    if (onRewardEarned) {
      onRewardEarned(event.nativeEvent.amount);
    }
  };

  // ===== NEW: Handle custom events from WebView =====
  const handleCustomEvent = (event: OfferwallCustomEvent) => {
    if (onCustomEvent) {
      onCustomEvent(event.nativeEvent.eventType, event.nativeEvent.payload);
    }
  };

  // ===== NEW: Handle data requests from WebView =====
  const handleDataRequest = (event: OfferwallDataRequestEvent) => {
    if (onDataRequest) {
      const { requestId, requestType, params } = event.nativeEvent;

      // Get data from parent app
      const responseData = onDataRequest(requestType, params);

      // Send response back to native (which will forward to WebView)
      if (responseData !== null && responseData !== undefined && viewRef.current) {
        const viewId = findNodeHandle(viewRef.current);
        if (viewId) {
          try {
            UIManager.dispatchViewManagerCommand(
              viewId,
              'sendDataResponse',
              [requestId, responseData]
            );
          } catch (error) {
            console.error('[OfferwallView] Failed to send data response:', error);
          }
        }
      }
    }
  };

  return (
    <NativeOfferwallView
      ref={viewRef}
      style={style}
      placementId={Platform.OS === 'ios' ? placementId : undefined}  // iOS uses property
      onOfferwallOpened={onOfferwallOpened}
      onOfferwallClosed={onOfferwallClosed}
      onOfferwallError={handleOfferwallError}
      onRewardEarned={handleRewardEarned}
      onCustomEvent={handleCustomEvent}  // NEW
      onDataRequest={handleDataRequest}  // NEW
    />
  );
});

export default AdchainOfferwallView;
