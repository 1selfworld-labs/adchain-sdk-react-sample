# AdChain SDK React Native 샘플 앱

> 💡 **AdChain SDK를 React Native 프로젝트에 통합하는 완벽한 샘플 앱입니다. 이 샘플을 참고하여 귀사의 앱에 SDK를 빠르게 통합할 수 있습니다.**

[![SDK Version](https://img.shields.io/badge/React%20Native-v1.0.15-blue)](https://www.npmjs.com/package/@1selfworld/adchain-sdk-react-native)
[![SDK Version](https://img.shields.io/badge/Android-v1.0.29-blue)](https://github.com/1selfworld-labs/adchain-sdk-android)
[![SDK Version](https://img.shields.io/badge/iOS-v1.0.44-blue)](https://github.com/1selfworld-labs/adchain-sdk-ios-release)
[![React Native](https://img.shields.io/badge/React%20Native-%5E0.73.0-blue)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

## 📑 목차

- [🎯 AdChain SDK란?](#-adchain-sdk란)
- [📂 샘플 프로젝트 구조](#-샘플-프로젝트-구조)
- [🚀 빠른 시작 (3분 안에 통합하기)](#-빠른-시작-3분-안에-통합하기)
  - [Step 0: 샘플 프로젝트 다운로드](#step-0-샘플-프로젝트-다운로드)
  - [Step 1: NPM 패키지 설치 (1분)](#step-1-npm-패키지-설치-1분)
  - [Step 2: iOS Pod 설치 (1분)](#-step-2-ios-pod-설치-1분)
  - [Step 3: UI 컴포넌트 복사 (선택사항)](#-step-3-ui-컴포넌트-복사-선택사항)
  - [Step 4: SDK 사용하기 (1분)](#-step-4-sdk-사용하기-1분)
- [📘 타입 정의 참조](#-타입-정의-참조)
- [✅ 체크리스트](#-체크리스트)
- [📚 API Reference](#-api-reference)
- [⚠️ 주의사항](#️-주의사항)
- [🆘 문제 해결](#-문제-해결)
- [📁 파일별 복사 요약표](#-파일별-복사-요약표)
- [🎯 3분 만에 연동 완료하기](#-3분-만에-연동-완료하기)
- [🆕 최신 업데이트](#-최신-업데이트)
- [📞 지원](#-지원)

## 🔗 빠른 링크

- **📦 SDK Repository**
  - [Android SDK](https://github.com/1selfworld-labs/adchain-sdk-android)
  - [iOS SDK](https://github.com/1selfworld-labs/adchain-sdk-ios-release)
- **📖 문서**
  - [공식 문서](https://docs.1self.world)
  - [샘플 프로젝트](https://github.com/1selfworld-labs/adchain-sdk-react-sample)
- **💬 지원**
  - 이메일: contacts@1self.world
  - 이슈 트래커: [GitHub Issues](https://github.com/1selfworld-labs/adchain-sdk-react-sample/issues)

---

## 🎯 AdChain SDK란?

AdChain SDK는 앱에 광고 기반 리워드 시스템을 쉽게 통합할 수 있게 해주는 모바일 SDK입니다:

### 주요 기능
- **Quiz 모듈**: 사용자가 퀴즈를 풀고 리워드를 받을 수 있는 게이미피케이션 광고
- **Mission 모듈**: 특정 조건 달성 시 리워드를 제공하는 미션 시스템
- **Banner 광고**: 네이티브 배너 광고 표시
- **Offerwall**: 다양한 광고 상품을 한 곳에서 제공하는 오퍼월
- **ADJOE Offerwall**: 앱 설치/실행 기반 리워드 광고 플랫폼 (성별/나이 타겟팅 지원)
- **이벤트 트래킹**: 사용자 행동 분석 및 리워드 최적화

### SDK 내부 동작
- **자동 세션 관리**: 앱 실행/백그라운드 전환 시 자동으로 세션 관리
- **배치 이벤트 처리**: 이벤트를 큐에 모아 효율적으로 서버에 전송 (v1.0.16+)
- **오프라인 지원**: 네트워크가 없을 때도 이벤트를 로컬에 저장했다가 전송
- **광고 ID 자동 갱신**: iOS IFA, Android ADID 변경 시 자동 감지 및 갱신
- **보안 통신**: 모든 API 통신은 암호화되어 전송

## 📂 샘플 프로젝트 구조

먼저 샘플 프로젝트의 구조를 이해하면 통합이 쉬워집니다:

> 💡 **v1.0.11부터**: 네이티브 브릿지 코드가 NPM 패키지(`@1selfworld/adchain-sdk-react-native`)로 제공되어 파일 복사가 불필요합니다!

```
adchain-sdk-react-sample/
├── android/                            ⚠️  참고 (네이티브 설정)
│   └── app/
│       └── src/main/java/com/treasurerrn/
│           ├── StorageModule.kt        ⚠️  참고 (Storage 모듈)
│           ├── StoragePackage.kt       ⚠️  참고 (Storage 패키지)
│           ├── MainActivity.kt         ⚠️  참고 (메인 액티비티)
│           └── MainApplication.kt      ⚠️  참고 (앱 설정)
├── ios/                                ⚠️  참고 (네이티브 설정)
│   └── TreasurerRN/
│       ├── Storage.swift               ⚠️  참고 (Storage 모듈)
│       ├── Storage.m                   ⚠️  참고 (Storage Objective-C Bridge)
│       └── AppDelegate.mm              ⚠️  참고 (앱 델리게이트)
├── src/
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── QuizModule.tsx         ✅ 복사 가능 (Quiz UI 컴포넌트)
│   │   │   └── QuizSkeleton.tsx       ✅ 복사 가능 (로딩 스켈레톤)
│   │   ├── mission/
│   │   │   ├── MissionModule.tsx       ✅ 복사 가능 (Mission UI 컴포넌트)
│   │   │   └── MissionSkeleton.tsx     ✅ 복사 가능 (로딩 스켈레톤)
│   │   ├── banner/
│   │   │   └── index.tsx               ✅ 복사 가능 (Banner 광고 컴포넌트)
│   │   ├── adjoe/
│   │   │   ├── Adjoe.tsx               ✅ 복사 가능 (ADJOE Offerwall 컴포넌트)
│   │   │   └── index.tsx               ✅ 복사 가능 (내보내기)
│   │   ├── OfferwallView.tsx           ✅ 복사 가능 (Offerwall View 컴포넌트)
│   │   └── debug/                      ⚠️  참고 (디버그 도구)
│   ├── interface/                      ⚠️  참고 (TypeScript 인터페이스)
│   ├── types/                          ⚠️  참고 (타입 정의)
│   └── Storage.ts                      ⚠️  참고 (Storage 유틸리티)
└── App.tsx                             ⚠️  참고 필요 (초기화 및 사용 예시)
```

---

## 🚀 빠른 시작 (3분 안에 통합하기)

### Step 0: 샘플 프로젝트 다운로드

```bash
# 샘플 프로젝트를 클론하거나 다운로드
git clone https://github.com/1selfworld-labs/adchain-sdk-react-sample.git
```

### Step 1: NPM 패키지 설치 (1분)

#### React Native 패키지 설치

```bash
# AdChain SDK React Native 패키지 설치
npm install @1selfworld/adchain-sdk-react-native

# 또는 yarn 사용 시
yarn add @1selfworld/adchain-sdk-react-native
```

> 💡 **v1.0.11부터**: 네이티브 브릿지 코드가 NPM 패키지에 포함되어 있어 파일 복사가 불필요합니다!

---

## 📋 Step 2: iOS Pod 설치 (1분)

iOS의 경우 CocoaPods를 사용하여 네이티브 의존성을 설치합니다:

```bash
# iOS Pod 설치
cd ios && pod install && cd ..
```

> ⚠️ **중요**: `ios/Podfile`에 `use_frameworks! :linkage => :static` 설정이 필요합니다.
> NPM 패키지에 포함된 Podspec이 자동으로 네이티브 SDK를 설치합니다.

---

## 🎨 Step 3: UI 컴포넌트 복사 (선택사항)

샘플의 UI 컴포넌트를 그대로 사용하려면 복사하세요:

### Quiz 컴포넌트 복사

```bash
# 샘플에서 복사
adchain-sdk-react-sample/src/components/quiz/
├── QuizModule.tsx
├── QuizSkeleton.tsx
└── index.tsx

# 귀사 프로젝트로
your-app/src/components/quiz/
```

### Mission 컴포넌트 복사

```bash
# 샘플에서 복사
adchain-sdk-react-sample/src/components/mission/
├── MissionModule.tsx
├── MissionSkeleton.tsx
└── index.tsx

# 귀사 프로젝트로
your-app/src/components/mission/
```

### Banner 컴포넌트 복사

```bash
# 샘플에서 복사
adchain-sdk-react-sample/src/components/banner/
└── index.tsx

# 귀사 프로젝트로
your-app/src/components/banner/
```

### ADJOE 컴포넌트 복사

```bash
# 샘플에서 복사
adchain-sdk-react-sample/src/components/adjoe/
├── Adjoe.tsx
└── index.tsx

# 귀사 프로젝트로
your-app/src/components/adjoe/
```

---

## 💻 Step 4: SDK 사용하기 (1분)

### App.tsx에서 초기화

> 💡 NPM 패키지에서 SDK를 바로 import하여 사용할 수 있습니다!

```typescript
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

// SDK 설정 (귀사의 APP_KEY와 APP_SECRET으로 변경)
const SDK_CONFIG = {
  android: {
    APP_KEY: 'your-android-app-key',      // ← 변경 필요!
    APP_SECRET: 'your-android-app-secret', // ← 변경 필요!
  },
  ios: {
    APP_KEY: 'your-ios-app-key',          // ← 변경 필요!
    APP_SECRET: 'your-ios-app-secret',    // ← 변경 필요!
  }
};

// SDK 초기화 함수
const initializeSDK = async () => {
  try {
    const config = Platform.select({
      android: SDK_CONFIG.android,
      ios: SDK_CONFIG.ios,
    });

    if (!config) return;

    // SDK 초기화 (필수 + 선택 파라미터)
    await AdchainSdk.initialize({
      appKey: config.APP_KEY,        // 필수
      appSecret: config.APP_SECRET,   // 필수
      environment: 'PRODUCTION',      // 선택 (기본값: 'PRODUCTION')
      timeout: 60000                  // 선택 (기본값: 30000ms)
    });

    // 사용자 로그인 - 모든 옵션 포함
    await AdchainSdk.login({
      userId: 'user123',              // 필수
      gender: 'MALE',                 // 선택
      birthYear: 1990,                // 선택
      customProperties: {             // 선택
        plan: 'premium',
        level: '10'
      }
    });

    // 또는 최소 필수 파라미터만 사용
    // await AdchainSdk.login({ userId: 'user123' });

    console.log('AdChain SDK 초기화 성공!');
  } catch (error) {
    console.error('SDK 초기화 실패:', error);
  }
};

// 앱 시작 시 초기화
useEffect(() => {
  initializeSDK();
}, []);
```

### adjoe 통합 시 Gender/Age 전달

adjoe SDK는 사용자의 성별과 나이 정보를 활용하여 더 타겟팅된 광고를 제공합니다.
AdChain SDK는 로그인 시 제공된 사용자 정보를 자동으로 네이티브 SDK에 전달합니다.

#### 사용자 프로필 정보 설정

```typescript
// 모든 정보 포함
await AdchainSdk.login({
  userId: 'user123',              // 필수
  gender: 'MALE',                 // 선택 ('MALE' | 'FEMALE' | 'OTHER')
  birthYear: 1990,                // 선택 (출생년도)
});

// 필수 정보만 (gender/birthYear 없이)
await AdchainSdk.login({
  userId: 'user123'
});
```

#### 지원되는 값

| 속성 | 타입 | 설명 | 필수 여부 |
|------|------|------|-----------|
| `gender` | `'MALE' \| 'FEMALE' \| 'OTHER' \| 'M' \| 'F'` | 사용자 성별 | 선택 |
| `birthYear` | `number` | 출생년도 (예: 1990) | 선택 |

#### 중요 사항

1. **Optional 필드**: gender와 birthYear는 선택사항입니다
   - 정보가 없으면 undefined → adjoe는 정보 없이 동작
   - 정보가 있으면 자동으로 네이티브 SDK로 전달됩니다

2. **재초기화 불가**: adjoe SDK는 재초기화를 지원하지 않습니다
   - **로그인 시점에 모든 정보를 제공**해야 합니다
   - 나중에 정보를 얻은 경우: 로그아웃 후 재로그인 필요

3. **플랫폼별 자동 처리**:
   - **Android**: `PlaytimeUserProfile` 객체로 변환
   - **iOS**: PlaytimeWeb URL 파라미터로 변환 (gender → string, birthYear → age)

#### 예시 코드

**정보가 있는 경우:**
```typescript
const handleLogin = async (userId: string) => {
  try {
    // 사용자 정보를 모두 알고 있는 경우
    await AdchainSdk.login({
      userId: userId,
      gender: 'MALE',
      birthYear: 1990,
      customProperties: {
        plan: 'premium'
      }
    });

    console.log('로그인 성공!');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
```

**정보가 없는 경우:**
```typescript
const handleLogin = async (userId: string) => {
  try {
    // 사용자 정보를 모르는 경우 (adjoe는 정보 없이 동작)
    await AdchainSdk.login({
      userId: userId
      // gender, birthYear 생략
    });

    console.log('로그인 성공!');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
```

**나중에 정보를 얻은 경우:**
```typescript
const updateUserProfile = async () => {
  try {
    // 1. 로그아웃
    await AdchainSdk.logout();

    // 2. 새로운 정보로 재로그인
    await AdchainSdk.login({
      userId: 'user123',
      gender: 'FEMALE',
      birthYear: 1995
    });

    console.log('프로필 업데이트 성공!');
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
  }
};
```

### Quiz/Mission 사용 예시

```typescript
// Quiz 불러오기
const loadQuizzes = async () => {
  const quizList = await AdchainSdk.loadQuizList('QUIZ_UNIT_001');
  setQuizzes(quizList);
};

// Mission 불러오기
const loadMissions = async () => {
  const response = await AdchainSdk.loadMissionList('MISSION_UNIT_001');
  setMissions(response.missions);
};

// 오퍼월 열기 (placementId 선택적 사용)
const openOfferwall = async () => {
  // placementId 없이 호출
  await AdchainSdk.openOfferwall();

  // 또는 placementId와 함께 호출
  await AdchainSdk.openOfferwall("MAIN_OFFERWALL");
};

// ADJOE 오퍼월 열기
const openAdjoeOfferwall = async () => {
  try {
    // placementId와 함께 호출 (추적 및 분석용)
    await AdchainSdk.openAdjoeOfferwall("main_adjoe_offerwall");
    console.log('ADJOE Offerwall 열림');
  } catch (error) {
    console.error('ADJOE Offerwall 오류:', error);
  }
};

// NestAds 오퍼월 열기 (v1.0.15+)
const openNestAdsOfferwall = async () => {
  try {
    // placementId와 함께 호출 (추적 및 분석용)
    await AdchainSdk.openOfferwallNestAds("main_nestads_offerwall");
    console.log('NestAds Offerwall 열림');
  } catch (error) {
    console.error('NestAds Offerwall 오류:', error);
  }
};
```

### 임베디드 오퍼월 뷰 (v1.0.11+)

탭이나 화면에 직접 임베드할 수 있는 WebView 기반 오퍼월 컴포넌트입니다.

```typescript
import { AdchainOfferwallView } from '@1selfworld/adchain-sdk-react-native';

<AdchainOfferwallView
  placementId="tab_embedded_offerwall"
  style={{ flex: 1 }}
  onOfferwallOpened={() => console.log('Offerwall opened')}
  onOfferwallClosed={() => console.log('Offerwall closed')}
  onOfferwallError={(error) => console.error('Offerwall error:', error)}
  onRewardEarned={(amount) => console.log('Reward earned:', amount)}
  onCustomEvent={(eventType, payload) => {
    // WebView → App 커스텀 이벤트 처리
    console.log('Custom Event:', eventType, payload);
  }}
  onDataRequest={(requestType, params) => {
    // WebView → App 데이터 요청/응답
    if (requestType === 'user_points') {
      return { points: 12345, currency: 'KRW' };
    }
    return null;
  }}
  onBackPressOnFirstPage={() => {
    // Android 백버튼: WebView 첫 페이지에서 뒤로가기
    console.log('Back on first page');
  }}
  onBackNavigated={() => {
    // Android 백버튼: WebView 내부 네비게이션 성공
    console.log('Navigated back in WebView');
  }}
/>
```

### Android 백버튼 처리 (v1.0.15+)

임베디드 오퍼월 뷰에서 Android 백버튼 이벤트를 처리하는 방법:

```typescript
import { BackHandler, findNodeHandle, UIManager } from 'react-native';
import { AdchainOfferwallView } from '@1selfworld/adchain-sdk-react-native';

const [shouldAllowExit, setShouldAllowExit] = useState(false);
const offerwallViewRef = useRef(null);

// 백버튼 핸들러
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (activeTab === 'offerwallView' && offerwallViewRef.current) {
      const viewId = findNodeHandle(offerwallViewRef.current);
      if (viewId) {
        // 네이티브 뷰에 백버튼 이벤트 전달
        UIManager.dispatchViewManagerCommand(
          viewId,
          'handleBackPress',
          []
        );
        return true; // 기본 동작 차단
      }
    }
    return false;
  });

  return () => backHandler.remove();
}, [activeTab]);

// 앱 종료 처리
useEffect(() => {
  if (shouldAllowExit) {
    const timer = setTimeout(() => {
      BackHandler.exitApp();
    }, 100);
    return () => clearTimeout(timer);
  }
}, [shouldAllowExit]);

<AdchainOfferwallView
  ref={offerwallViewRef}
  placementId="tab_embedded_offerwall"
  style={{ flex: 1 }}
  onBackPressOnFirstPage={() => {
    // WebView가 첫 페이지 → 앱 종료 허용
    console.log('Back on first page, allowing app exit');
    setShouldAllowExit(true);
  }}
  onBackNavigated={() => {
    // WebView 내부 뒤로가기 성공 → 종료 취소
    console.log('Navigated back in WebView');
    setShouldAllowExit(false);
  }}
/>
```

**이벤트 설명**:
- `onBackPressOnFirstPage`: WebView 스택에 페이지가 1개만 있을 때 (더 이상 뒤로갈 수 없음)
- `onBackNavigated`: WebView 스택에서 성공적으로 뒤로 이동했을 때

### Banner 광고 사용 예시

```typescript
// 배너 정보 불러오기
const loadBanner = async () => {
  const bannerInfo = await AdchainSdk.getBannerInfo('BANNER_UNIT_001');
  setBanner(bannerInfo);
};

// 배너 클릭 처리 (placementId와 함께)
const handleBannerClick = (banner: BannerInfo, placementId: string) => {
  if (banner.linkType === 'internal') {
    // SDK 내부 페이지로 이동 (placementId 전달)
    AdchainSdk.openOfferwallWithUrl(banner.internalLinkUrl, placementId);
  } else {
    // 외부 브라우저로 이동
    AdchainSdk.openExternalBrowser(banner.externalLinkUrl);
  }
};
```

### 이벤트 리스너 설정

```typescript
import { NativeEventEmitter } from 'react-native';

// 방법 1: 헬퍼 함수 사용 (권장)
import AdchainSdk, {
  addMissionCompletedListener,
  addQuizCompletedListener
} from '@1selfworld/adchain-sdk-react-native';

useEffect(() => {
  const subscription = addMissionCompletedListener((event) => {
    console.log('미션 완료:', event.missionId);
    // UI 업데이트 등
  });

  return () => subscription.remove();
}, []);

// 방법 2: NativeEventEmitter 직접 사용
import { NativeEventEmitter } from 'react-native';
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

const adchainEventEmitter = new NativeEventEmitter(AdchainSdk);

useEffect(() => {
  const subscription = adchainEventEmitter.addListener(
    'onMissionCompleted', // 'onMissionComplete' 아님 주의!
    (event) => {
      console.log('미션 완료:', event.missionId);
    }
  );

  return () => subscription.remove();
}, []);
```

---

## 📘 타입 정의 참조

### 주요 인터페이스

```typescript
// SDK 설정 타입
interface AdchainConfig {
  appKey: string;                    // 필수
  appSecret: string;                 // 필수
  environment?: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'; // 선택 (기본: 'PRODUCTION')
  timeout?: number;                  // 선택 (기본: 30000ms)
}

// 사용자 정보 타입
interface AdchainUser {
  userId: string;                    // 필수
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'M' | 'F'; // 선택
  birthYear?: number;                // 선택 (1900-현재)
  customProperties?: Record<string, string>; // 선택 (추가 속성)
}

// 응답 타입
interface SuccessResponse {
  success: boolean;
  message?: string;
}

// 퀴즈 응답 타입
interface QuizResponse {
  success: boolean;
  titleText?: string;
  completedImageUrl?: string;
  events: Quiz[];
  message?: string;
}

// 미션 리스트 응답 타입
interface MissionListResponse {
  missions: Mission[];
  availableReward?: number;
}
```

---

## ✅ 체크리스트

### 필수 작업
- [ ] **Step 1**: NPM 패키지 설치 (`npm install @1selfworld/adchain-sdk-react-native`)
- [ ] **Step 2**: iOS Pod 설치 (`cd ios && pod install`)
- [ ] **Step 3**: Podfile에 `use_frameworks! :linkage => :static` 설정 확인
- [ ] **Step 4**: App.tsx에서 SDK import 및 초기화
- [ ] **Step 4**: SDK_CONFIG에 실제 APP_KEY, APP_SECRET 입력

### 선택 작업
- [ ] Quiz/Mission UI 컴포넌트 복사
- [ ] Banner 컴포넌트 복사
- [ ] Offerwall View 컴포넌트 복사
- [ ] 샘플 앱 실행해보기
- [ ] 이벤트 리스너 설정

---

## 📚 API Reference

### 초기화 및 인증
| 메서드 | 설명 | 파라미터 | 반환값 |
|---------|------|----------|--------|
| `initialize()` | SDK 초기화 | `config: {`<br>`  appKey: string,` 필수<br>`  appSecret: string,` 필수<br>`  environment?: string,` 선택<br>`  timeout?: number` 선택<br>`}` | `Promise<SuccessResponse>` |
| `login()` | 사용자 로그인 | `user: {`<br>`  userId: string,` 필수<br>`  gender?: string,` 선택<br>`  birthYear?: number,` 선택<br>`  customProperties?: object` 선택<br>`}` | `Promise<SuccessResponse>` |
| `logout()` | 로그아웃 | - | `Promise<SuccessResponse>` |
| `isLoggedIn()` | 로그인 상태 확인 | - | `Promise<boolean>` |
| `getCurrentUser()` | 현재 사용자 정보 | - | `Promise<AdchainUser \| null>` |

### 퀴즈 및 미션
| 메서드 | 설명 | 파라미터 | 반환값 |
|---------|------|----------|--------|
| `loadQuizList()` | 퀴즈 목록 불러오기 | `unitId: string` | `Promise<QuizResponse>` |
| `clickQuiz()` | 퀴즈 클릭 | `unitId: string`, `quizId: string` | `Promise<SuccessResponse>` |
| `loadMissionList()` | 미션 목록 불러오기 | `unitId: string` | `Promise<MissionListResponse>` |
| `clickMission()` | 미션 클릭 | `unitId: string`, `missionId: string` | `Promise<SuccessResponse>` |
| `claimReward()` | 보상 받기 | `unitId: string` | `Promise<any>` |

### 광고 및 브라우저
| 메서드 | 설명 | 파라미터 | 반환값 |
|---------|------|----------|--------|
| `openOfferwall()` | 오퍼월 열기 | `placementId?: string` 선택 | `Promise<SuccessResponse>` |
| `openAdjoeOfferwall()` | ADJOE 오퍼월 열기 | `placementId?: string` 선택 | `Promise<SuccessResponse>` |
| `openOfferwallNestAds()` | NestAds 오퍼월 열기 | `placementId: string` | `Promise<SuccessResponse>` |
| `openOfferwallWithUrl()` | URL로 오퍼월 열기 | `url: string,`<br>`placementId?: string` 선택 | `Promise<SuccessResponse>` |
| `openExternalBrowser()` | 외부 브라우저 열기 | `url: string` | `Promise<SuccessResponse>` |
| `getBannerInfo()` | 배너 정보 불러오기 | `placementId: string` | `Promise<any>` |
| `getIFA()` | 광고 ID 가져오기 | - | `Promise<string>` |

---

## ⚠️ 주의사항

### iOS 설정
- **필수**: `use_frameworks! :linkage => :static` 설정 필요
- **최소 버전**: iOS 14.0 이상 요구
- **Swift 브릿지**: Bridging Header 자동 생성 필요

### Android 설정
- **Kotlin 버전**: 1.9.21 이상 권장
- **Coroutines**: 1.7.3 이상 필요
- **androidx.core 충돌**: `implementation 'androidx.core:core:1.10.1'` 추가로 해결

### React Navigation 호환성
현재 샘플은 다음 버전을 사용:
- `@react-navigation/native`: ^6.1.18
- `@react-navigation/bottom-tabs`: ^6.6.1
- `react-native-screens`: 3.29.0

---

## 🆘 문제 해결

### Q: iOS 빌드 실패
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

### Q: Android에서 "Native module AdchainSdk tried to override..." 에러
MainApplication에서 AdchainSdkPackage()가 중복 추가되지 않았는지 확인

### Q: TypeScript에서 AdchainSdk를 찾을 수 없음
```bash
# 앱 재시작
npx react-native start --reset-cache
npx react-native run-android  # 또는 run-ios
```

### Q: "Module AdchainSdk is not available" 에러
Native 코드를 수정했으므로 앱을 완전히 재빌드해야 합니다:
```bash
# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 📁 파일별 복사 요약표

> 💡 **v1.0.11부터**: 네이티브 브릿지 코드는 NPM 패키지에 포함되어 복사가 불필요합니다!

| 원본 파일 (샘플) | 대상 파일 (귀사 프로젝트) | 필수/선택 | 수정 필요 |
|-----------------|------------------------|----------|-----------|
| NPM 패키지 | `npm install @1selfworld/adchain-sdk-react-native` | ✅ 필수 | 없음 |
| `src/components/quiz/*` | `src/components/quiz/*` | ⭕ 선택 | 스타일 |
| `src/components/mission/*` | `src/components/mission/*` | ⭕ 선택 | 스타일 |
| `src/components/banner/*` | `src/components/banner/*` | ⭕ 선택 | 스타일 |
| `src/components/adjoe/*` | `src/components/adjoe/*` | ⭕ 선택 | 스타일 |
| `src/components/OfferwallView.tsx` | `src/components/OfferwallView.tsx` | ⭕ 선택 | 없음 |
| `App.tsx` | - | 참고용 | SDK_CONFIG |

---

## 🎯 3분 만에 연동 완료하기

1. **1분**: NPM 패키지 설치 (`npm install @1selfworld/adchain-sdk-react-native`)
2. **1분**: iOS Pod 설치 (`cd ios && pod install`)
3. **1분**: App.tsx에서 SDK import 및 초기화 코드 추가

**완료!** 🎉

> 💡 **v1.0.11의 장점**: 네이티브 브릿지 파일 복사, 패키지명 변경 등의 번거로운 작업이 모두 사라졌습니다!

---

## 🆕 최신 업데이트

### v1.0.15 (React Native) - 2025-10-29
- 🎯 **Android 백버튼 이벤트 개선**: AdchainOfferwallView에 백버튼 처리 이벤트 추가
  - `onBackPressOnFirstPage`: WebView가 첫 페이지일 때 백버튼 이벤트
  - `onBackNavigated`: WebView 내부 네비게이션 성공 이벤트
- 🆕 **NestAds 오퍼월 지원**: `openOfferwallNestAds()` 메서드 추가
- 📦 **네이티브 SDK 업데이트**:
  - Android SDK: v1.0.29
  - iOS SDK: v1.0.44
- 🔧 **샘플 앱**: 백버튼으로 앱 종료 기능 구현 예시 추가

### v1.0.11 (React Native) - 2025-10-24
- 🎉 **NPM 패키지로 전환**: 네이티브 브릿지 파일 복사 불필요
- 📦 NPM 배포: `@1selfworld/adchain-sdk-react-native`
- ✨ 설치 시간 단축: 5분 → 3분
- 🔧 Import 경로 간소화: `@1selfworld/adchain-sdk-react-native`
- 📝 Metro 설정 추가: 로컬 SDK 개발을 위한 watchFolders
- 🎯 통합 간소화: 파일 복사, 패키지명 변경 등 번거로운 작업 제거
- ✅ 포함된 기능:
  - Offerwall View 컴포넌트 (`AdchainOfferwallView`)
  - WebView 이벤트 브릿지 (onCustomEvent, onDataRequest)
  - 모든 네이티브 SDK 기능 래핑

### v1.0.27 (Android) / v1.0.42 (iOS) - 2025-10-21
- ✨ WebView 양방향 이벤트 브릿지 기능 추가
  - onCustomEvent: WebView → App 커스텀 이벤트 수신 및 토스트 표시
  - onDataRequest: WebView → App 데이터 요청/응답 (포인트, 프로필, 앱 버전 등)
- 🔧 openOfferwall/openOfferwallWithUrl 메서드에 eventCallback 파라미터 추가
- 📦 iOS/Android SDK 버전 동기화

### v1.0.23 (Android) / v1.0.38 (iOS) - 2025-10-16
- ✨ adjoe SDK 통합 시 사용자 프로필(Gender/Age) 전달 기능 추가
- 🧪 App Launch Test 도구 추가 (앱 설치 확인 및 실행 테스트)
- 🧪 Webview 통합 테스트 도구 추가 (URL 파라미터 테스트)
- 🔄 SDK 버전 업데이트 및 안정성 개선
- 📚 adjoe 통합 가이드 추가 (성별/출생년도 전달 방법)
- 🔧 로컬 SDK 참조에서 원격 저장소 사용으로 전환 (Android)

### v1.0.21 (Android) / v1.0.33 (iOS) - 2025-09-26
- ✨ Offerwall 메서드에 선택적 placementId 파라미터 추가
  - `openOfferwall(placementId?: string)`
  - `openOfferwallWithUrl(url: string, placementId?: string)`
- 🎯 광고 위치별 추적 및 분석 기능 향상
- 🔧 iOS/Android 동작 일관성 개선

### v1.0.18 (Android) / v1.0.29 (iOS) - 2025-09-23
- 🔧 iOS PrivacyInfo.xcprivacy 중복 항목 제거 및 구조 정리
- 📦 Android/iOS SDK 버전 업데이트
- 🔄 네이티브 모듈 SDK 버전 참조 동기화

### v1.0.16 (Android) / v1.0.26 (iOS)
- ✨ 이벤트 큐 및 배치 처리 시스템 구현
- 🔄 iOS/Android SDK 동작 통일화
- 📊 오프라인 이벤트 처리 개선
- 🆔 광고 ID (IFA/ADID) 자동 갱신 기능 강화
- 🎭 WebView 전환 애니메이션 개선 (iOS)

### 샘플 앱 최신 기능
- 🔍 Debug 패널에 수동 새로고침 버튼 추가
- 🚀 탭 전환 시 중복 API 호출 제거 (3회→1회)
- 📱 iOS 추적 허용 후 IFA 실시간 갱신
- 🎨 미션 모듈 레이아웃 개선

---

## 📞 지원

통합 중 문제가 발생하면:

1. 먼저 샘플 앱이 정상 동작하는지 확인
2. 파일 복사가 올바르게 되었는지 확인
3. 패키지명/Bundle ID가 일치하는지 확인

기술 지원: contacts@1self.world

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2025-10-29 | 1.0.6 | 🎯 백버튼 이벤트 처리 가이드, NestAds 오퍼월, SDK v1.0.15 반영 |
| 2025-10-24 | 1.0.5 | 🎉 NPM 패키지 전환 문서화, 네이티브 브릿지 복사 과정 제거, 3분 통합 가이드 |
| 2025-10-20 | 1.0.4 | 📑 목차 및 빠른 링크 섹션 추가, 문서 가독성 개선 |
| 2025-10-16 | 1.0.3 | adjoe SDK 통합 가이드 추가, 사용자 프로필 전달 기능 문서화 |
| 2025-09-26 | 1.0.2 | Offerwall placementId 파라미터 문서 추가 |

---

**Version**: 1.0.6
**Last Updated**: 2025-10-29
**Sample Project**: [adchain-sdk-react-sample](https://github.com/1selfworld-labs/adchain-sdk-react-sample)