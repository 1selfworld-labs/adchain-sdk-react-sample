# AdChain SDK React Native 통합 가이드

> 💡 **이 가이드는 AdChain SDK 샘플 프로젝트의 파일을 복사하여 귀사의 React Native 프로젝트에 빠르게 통합하는 방법을 안내합니다.**

## 📂 샘플 프로젝트 구조

먼저 샘플 프로젝트의 구조를 이해하면 통합이 쉬워집니다:

```
adchain-sdk-react-sample/
├── android/
│   └── app/
│       └── src/main/java/com/treasurerrn/
│           ├── AdchainSdkModule.kt      ✅ 복사 필요 (Android Bridge)
│           ├── AdchainSdkPackage.kt     ✅ 복사 필요 (Android Package)
│           └── MainApplication.kt       ⚠️  수정 참고
├── ios/
│   └── TreasurerRN/
│       ├── AdchainSdk.swift            ✅ 복사 필요 (iOS Bridge)
│       └── AdchainSdk.m                ✅ 복사 필요 (iOS Objective-C Bridge)
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
│   │   └── debug/                      ⚠️  참고 (디버그 도구)
│   ├── navigation/                     ⚠️  참고 (네비게이션 설정)
│   ├── interface/                      ⚠️  참고 (TypeScript 인터페이스)
│   ├── types/                          ⚠️  참고 (타입 정의)
│   └── index.tsx                       ✅ 참고 필요 (SDK 래퍼)
└── App.tsx                             ⚠️  참고 필요 (초기화 및 사용 예시)
```

---

## 🚀 빠른 시작 (5분 안에 통합하기)

### Step 0: 샘플 프로젝트 다운로드

```bash
# 샘플 프로젝트를 클론하거나 다운로드
git clone https://github.com/1selfworld-labs/adchain-sdk-react-sample.git
```

### Step 1: SDK 설치 (2분)

#### Android SDK 설치
`android/app/build.gradle`에 다음 내용 추가:

```gradle
dependencies {
    // 기존 dependencies는 그대로 유지하고 아래 내용 추가

    // AdChain SDK - 아래 한 줄만 추가하면 됩니다!
    implementation 'com.github.1selfworld-labs:adchain-sdk-android:v1.0.15'

    // AdChain SDK가 필요로 하는 의존성들
    implementation "org.jetbrains.kotlin:kotlin-stdlib:1.9.21"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3"
    implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.7.0"
}
```

#### iOS SDK 설치
`ios/Podfile`에 다음 내용 추가:

```ruby
# use_frameworks 주석 해제 (중요!)
use_frameworks! :linkage => :static

target 'YourAppName' do
  # 기존 내용 유지...

  # AdChain SDK 추가 - 아래 한 줄만 추가!
  pod 'AdChainSDK', :git => 'https://github.com/1selfworld-labs/adchain-sdk-ios-release.git', :tag => 'v1.0.19'
end
```

```bash
# Pod 설치
cd ios && pod install && cd ..
```

---

## 📋 Step 2: Native Bridge 파일 복사 (3분)

### Android Bridge 파일 복사

#### 1️⃣ 파일 복사
샘플 프로젝트에서 다음 2개 파일을 복사합니다:

```bash
# 샘플 프로젝트에서
adchain-sdk-react-sample/android/app/src/main/java/com/treasurerrn/
├── AdchainSdkModule.kt     → 복사
└── AdchainSdkPackage.kt    → 복사

# 귀사 프로젝트로 (패키지명을 귀사 것으로 변경)
your-app/android/app/src/main/java/com/yourcompany/
├── AdchainSdkModule.kt     → 붙여넣기
└── AdchainSdkPackage.kt    → 붙여넣기
```

#### 2️⃣ 패키지명 변경
복사한 파일들의 첫 줄 package 선언을 귀사 패키지명으로 변경:

```kotlin
// 변경 전
package com.treasurerrn

// 변경 후 (귀사 패키지명으로)
package com.yourcompany
```

#### 3️⃣ MainApplication 수정
`MainApplication.kt` (또는 `.java`)에서 패키지 추가:

```kotlin
// MainApplication.kt 파일에서 getPackages() 함수 찾아서 수정

override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        // 아래 한 줄 추가
        add(AdchainSdkPackage())
    }
```

### iOS Bridge 파일 복사

#### 1️⃣ 파일 복사
샘플 프로젝트에서 다음 2개 파일을 복사합니다:

```bash
# 샘플 프로젝트에서
adchain-sdk-react-sample/ios/TreasurerRN/
├── AdchainSdk.swift    → 복사
└── AdchainSdk.m        → 복사

# 귀사 프로젝트로
your-app/ios/YourAppName/
├── AdchainSdk.swift    → 붙여넣기
└── AdchainSdk.m        → 붙여넣기
```

#### 2️⃣ Xcode에서 파일 추가
1. Xcode로 프로젝트 열기
2. 프로젝트 네비게이터에서 우클릭 → "Add Files to..."
3. 복사한 두 파일 선택
4. ✅ "Copy items if needed" 체크
5. ✅ 메인 앱 타겟 선택

> 💡 **Bridging Header 관련 팝업이 나타나면 "Create Bridging Header" 선택**

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

### Banner 컴포넌트 복사 (신규)

```bash
# 샘플에서 복사
adchain-sdk-react-sample/src/components/banner/
└── index.tsx

# 귀사 프로젝트로
your-app/src/components/banner/
```

---

## 🔧 Step 4: TypeScript 인터페이스 설정

### 방법 1: 파일 복사 (권장)
샘플의 `src/index.tsx` 파일을 복사하여 `src/services/AdchainSdk.ts`로 저장:

```bash
# 복사
cp adchain-sdk-react-sample/src/index.tsx your-app/src/services/AdchainSdk.ts
```

### 방법 2: 직접 작성
`src/services/AdchainSdk.ts` 파일 생성:

```typescript
import { NativeModules } from 'react-native';

// Native Module 가져오기
const { AdchainSdk } = NativeModules;

// 타입 정의
export interface AdchainConfig {
  appKey: string;
  appSecret: string;
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
}

// 내보내기
export default AdchainSdk as {
  initialize(appKey: string, appSecret: string, options: any): Promise<boolean>;
  login(userId: string, userInfo?: any): Promise<boolean>;
  logout(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  loadQuizList(unitId: string): Promise<any[]>;
  clickQuiz(unitId: string, quizId: string): Promise<void>;
  loadMissionList(unitId: string): Promise<any>;
  clickMission(unitId: string, missionId: string): Promise<void>;
  claimReward(unitId: string): Promise<any>;
  openOfferwall(): Promise<void>;
  openOfferwallWithUrl(url: string): Promise<void>;  // 신규
  openExternalBrowser(url: string): Promise<void>;   // 신규
  loadBannerInfo(unitId: string): Promise<any>;      // 신규
};
```

---

## 💻 Step 5: SDK 사용하기

### App.tsx에서 초기화 (샘플 코드 참고)

샘플의 `App.tsx`에서 다음 부분을 복사하여 귀사 앱에 적용:

```typescript
import AdchainSdk from './src/services/AdchainSdk';

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

    // SDK 초기화
    await AdchainSdk.initialize(
      config.APP_KEY,
      config.APP_SECRET,
      { environment: 'PRODUCTION' }
    );

    // 사용자 로그인
    await AdchainSdk.login('user123');

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

// 오퍼월 열기
const openOfferwall = async () => {
  await AdchainSdk.openOfferwall();
};
```

### Banner 광고 사용 예시 (신규)

```typescript
// 배너 정보 불러오기
const loadBanner = async () => {
  const bannerInfo = await AdchainSdk.loadBannerInfo('BANNER_UNIT_001');
  setBanner(bannerInfo);
};

// 배너 클릭 처리
const handleBannerClick = (banner: BannerInfo) => {
  if (banner.linkType === 'internal') {
    // SDK 내부 페이지로 이동
    AdchainSdk.openOfferwallWithUrl(banner.internalLinkUrl);
  } else {
    // 외부 브라우저로 이동
    AdchainSdk.openExternalBrowser(banner.externalLinkUrl);
  }
};
```

### 이벤트 리스너 설정 (신규)

```typescript
import { NativeEventEmitter } from 'react-native';

// 이벤트 에미터 생성
const adchainEventEmitter = new NativeEventEmitter(AdchainSdk);

// 이벤트 리스너 등록
useEffect(() => {
  const subscription = adchainEventEmitter.addListener(
    'onMissionComplete',
    (event) => {
      console.log('미션 완료:', event.missionId);
      // UI 업데이트 등
    }
  );

  return () => subscription.remove();
}, []);
```

---

## ✅ 체크리스트

### 필수 작업
- [ ] **Step 1**: SDK 의존성 추가 (Android: build.gradle, iOS: Podfile)
- [ ] **Step 2-Android**: AdchainSdkModule.kt, AdchainSdkPackage.kt 복사
- [ ] **Step 2-Android**: 패키지명 변경 및 MainApplication 수정
- [ ] **Step 2-iOS**: AdchainSdk.swift, AdchainSdk.m 복사
- [ ] **Step 2-iOS**: Xcode에서 파일 추가
- [ ] **Step 4**: TypeScript 인터페이스 설정
- [ ] **Step 5**: SDK_CONFIG에 실제 APP_KEY, APP_SECRET 입력

### 선택 작업
- [ ] Quiz/Mission UI 컴포넌트 복사
- [ ] Banner 컴포넌트 복사
- [ ] 샘플 앱 실행해보기
- [ ] 이벤트 리스너 설정

---

## 📚 API Reference

### 초기화 및 인증
| 메서드 | 설명 | 파라미터 | 반환값 |
|---------|------|----------|--------|
| `initialize()` | SDK 초기화 | `appKey`, `appSecret`, `options` | `Promise<SuccessResponse>` |
| `login()` | 사용자 로그인 | `user: AdchainUser` | `Promise<SuccessResponse>` |
| `logout()` | 로그아웃 | - | `Promise<void>` |
| `isLoggedIn()` | 로그인 상태 확인 | - | `Promise<boolean>` |

### 퀴즈 및 미션
| 메서드 | 설명 | 파라미터 | 반환값 |
|---------|------|----------|--------|
| `loadQuizList()` | 퀴즈 목록 불러오기 | `unitId: string` | `Promise<Quiz[]>` |
| `clickQuiz()` | 퀴즈 클릭 | `unitId`, `quizId` | `Promise<void>` |
| `loadMissionList()` | 미션 목록 불러오기 | `unitId: string` | `Promise<MissionListResponse>` |
| `clickMission()` | 미션 클릭 | `unitId`, `missionId` | `Promise<void>` |
| `claimReward()` | 보상 받기 | `unitId: string` | `Promise<any>` |

### 광고 및 브라우저
| 메서드 | 설명 | 파라미터 | 반환값 |
|---------|------|----------|--------|
| `openOfferwall()` | 오퍼월 열기 | - | `Promise<void>` |
| `openOfferwallWithUrl()` 🆕 | URL로 오퍼월 열기 | `url: string` | `Promise<void>` |
| `openExternalBrowser()` 🆕 | 외부 브라우저 열기 | `url: string` | `Promise<void>` |
| `loadBannerInfo()` 🆕 | 배너 정보 불러오기 | `unitId: string` | `Promise<BannerInfo>` |

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

| 원본 파일 (샘플) | 대상 파일 (귀사 프로젝트) | 필수/선택 | 수정 필요 |
|-----------------|------------------------|----------|-----------|
| `android/.../AdchainSdkModule.kt` | `android/.../AdchainSdkModule.kt` | ✅ 필수 | 패키지명만 |
| `android/.../AdchainSdkPackage.kt` | `android/.../AdchainSdkPackage.kt` | ✅ 필수 | 패키지명만 |
| `ios/.../AdchainSdk.swift` | `ios/.../AdchainSdk.swift` | ✅ 필수 | 없음 |
| `ios/.../AdchainSdk.m` | `ios/.../AdchainSdk.m` | ✅ 필수 | 없음 |
| `src/index.tsx` | `src/services/AdchainSdk.ts` | ✅ 필수 | 없음 |
| `src/components/quiz/*` | `src/components/quiz/*` | ⭕ 선택 | 스타일 |
| `src/components/mission/*` | `src/components/mission/*` | ⭕ 선택 | 스타일 |
| `src/components/banner/*` | `src/components/banner/*` | ⭕ 선택 | 스타일 |
| `App.tsx` | - | 참고용 | SDK_CONFIG |

---

## 🎯 5분 만에 연동 완료하기

1. **1분**: SDK 의존성 추가 (build.gradle, Podfile)
2. **2분**: Native Bridge 파일 4개 복사 (Android 2개, iOS 2개)
3. **1분**: TypeScript 인터페이스 파일 복사
4. **1분**: App.tsx에 초기화 코드 추가

**완료!** 🎉

---

## 📞 지원

통합 중 문제가 발생하면:

1. 먼저 샘플 앱이 정상 동작하는지 확인
2. 파일 복사가 올바르게 되었는지 확인
3. 패키지명/Bundle ID가 일치하는지 확인

기술 지원: contacts@1self.world

---

**Version**: 1.0.1
**Last Updated**: 2025-09-19
**Sample Project**: [adchain-sdk-react-sample](https://github.com/1selfworld-labs/adchain-sdk-react-sample)
