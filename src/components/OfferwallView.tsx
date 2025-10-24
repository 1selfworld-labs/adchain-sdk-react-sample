/**
 * AdChain Offerwall View Component (SDK Wrapper)
 *
 * This file re-exports the AdchainOfferwallView component from the SDK package.
 * Previously, this was a custom implementation with native bridges (230 lines).
 * Now it uses the official @1selfworld/adchain-sdk-react-native package.
 */

import { AdchainOfferwallView } from '@1selfworld/adchain-sdk-react-native';

export { AdchainOfferwallView };
export default AdchainOfferwallView;

// Export type for convenience
export type { AdchainOfferwallViewProps } from '@1selfworld/adchain-sdk-react-native';
