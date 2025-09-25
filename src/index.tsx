import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const LINKING_ERROR =
  `The package 'adchain-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AdchainSdk = NativeModules.AdchainSdk
  ? NativeModules.AdchainSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// Event Emitter 생성
const adchainEventEmitter = new NativeEventEmitter(AdchainSdk);

// ===== Type Definitions =====

export interface AdchainConfig {
  appKey: string;
  appSecret: string;
  environment?: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  timeout?: number;
}

export interface AdchainUser {
  userId: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'M' | 'F';
  birthYear?: number;
  customProperties?: Record<string, string>;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  reward: number;
  isCompleted: boolean;
}

export interface QuizResponse {
  success: boolean;
  titleText?: string;
  completedImageUrl?: string;
  completedImageWidth?: number;
  completedImageHeight?: number;
  events: Quiz[];
  message?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  reward: number;
  isCompleted: boolean;
  type: string;
  actionUrl: string;
}

export interface MissionListResponse {
  missions: Mission[];
  completedCount: number;
  totalCount: number;
  canClaimReward: boolean;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

// ===== SDK Class =====

class AdchainSDK {
  // 1. SDK 초기화
  async initialize(config: AdchainConfig): Promise<SuccessResponse> {
    // options 객체로 environment와 timeout 전달
    const options = {
      environment: config.environment,
      timeout: config.timeout
    };
    
    return AdchainSdk.initialize(
      config.appKey,
      config.appSecret,
      options
    );
  }

  // 2. 인증 관련 (4개)
  async login(user: AdchainUser): Promise<SuccessResponse> {
    // userInfo 객체로 모든 정보 전달
    const userInfo = {
      gender: user.gender,
      birthYear: user.birthYear,
      customProperties: user.customProperties
    };
    
    return AdchainSdk.login(
      user.userId,
      userInfo
    );
  }

  async logout(): Promise<SuccessResponse> {
    return AdchainSdk.logout();
  }

  async isLoggedIn(): Promise<boolean> {
    return AdchainSdk.isLoggedIn();
  }

  async getCurrentUser(): Promise<AdchainUser | null> {
    return AdchainSdk.getCurrentUser();
  }

  // 3. Quiz 관련 (2개)
  async loadQuizList(unitId: string): Promise<QuizResponse> {
    return AdchainSdk.loadQuizList(unitId);
  }

  async clickQuiz(unitId: string, quizId: string): Promise<SuccessResponse> {
    return AdchainSdk.clickQuiz(unitId, quizId);
  }

  // 4. Mission 관련 (3개)
  async loadMissionList(unitId: string): Promise<MissionListResponse> {
    return AdchainSdk.loadMissionList(unitId);
  }

  async clickMission(unitId: string, missionId: string): Promise<SuccessResponse> {
    return AdchainSdk.clickMission(unitId, missionId);
  }

  async claimReward(unitId: string): Promise<SuccessResponse> {
    return AdchainSdk.claimReward(unitId);
  }

  // 5. Offerwall (3개)
  async openOfferwall(placementId?: string): Promise<SuccessResponse> {
    // SDK requires placementId, use empty string if not provided
    return AdchainSdk.openOfferwall(placementId || "");
  }

  async openOfferwallWithUrl(url: string, placementId?: string): Promise<SuccessResponse> {
    // SDK requires placementId, use empty string if not provided
    return AdchainSdk.openOfferwallWithUrl(url, placementId || "");
  }

  async openExternalBrowser(url: string, placementId?: string): Promise<SuccessResponse> {
    // SDK requires placementId, use empty string if not provided
    return AdchainSdk.openExternalBrowser(url, placementId || "");
  }

  // 6. Debug/Utility Methods (3개)
  async isInitialized(): Promise<boolean> {
    return AdchainSdk.isInitialized();
  }

  async getUserId(): Promise<string> {
    return AdchainSdk.getUserId();
  }

  async getIFA(): Promise<string> {
    return AdchainSdk.getIFA();
  }

  // 7. Banner (1개)
  async getBannerInfo(placementId: string): Promise<any> {
    return AdchainSdk.getBannerInfo(placementId);
  }
}

// ===== Event Helper Functions =====

export function addQuizCompletedListener(callback: (event: { quizId: string; unitId: string }) => void) {
  return adchainEventEmitter.addListener('onQuizCompleted', callback);
}

export function addMissionCompletedListener(callback: (event: { missionId: string; unitId: string }) => void) {
  return adchainEventEmitter.addListener('onMissionCompleted', callback);
}

export function addMissionProgressedListener(callback: (event: { missionId: string; unitId: string }) => void) {
  return adchainEventEmitter.addListener('onMissionProgressed', callback);
}

export function addMissionRefreshedListener(callback: (event: { unitId: string }) => void) {
  return adchainEventEmitter.addListener('onMissionRefreshed', callback);
}

// ===== Export =====

const sdk = new AdchainSDK();
export default sdk;