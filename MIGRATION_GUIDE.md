# AdChain SDK 마이그레이션 가이드

> **Native SDK 복사 방식 → React Native NPM 패키지 방식으로 마이그레이션**

기존에 Native SDK 파일을 직접 복사하는 방식에서 React Native NPM 패키지(`@1selfworld/adchain-sdk-react-native`)를 사용하는 방식으로 변경되었습니다.

**업데이트 버전**: v1.0.17
**마지막 수정**: 2025-10-29

---

## 📋 목차

- [변경 사항 개요](#-변경-사항-개요)
- [마이그레이션 체크리스트](#-마이그레이션-체크리스트)
- [단계별 마이그레이션 가이드](#-단계별-마이그레이션-가이드)
  - [Step 1: Native 브릿지 파일 제거](#step-1-native-브릿지-파일-제거)
  - [Step 2: Native SDK 참조 제거](#step-2-native-sdk-참조-제거)
  - [Step 3: NPM 패키지 설치](#step-3-npm-패키지-설치)
  - [Step 4: Import 경로 변경](#step-4-import-경로-변경)
  - [Step 5: iOS Pod 재설치](#step-5-ios-pod-재설치)
  - [Step 6: 빌드 및 테스트](#step-6-빌드-및-테스트)
- [UI 컴포넌트 참조 경로 변경](#-ui-컴포넌트-참조-경로-변경)
- [문제 해결](#-문제-해결)
- [롤백 가이드](#-롤백-가이드)

---

## 🎯 변경 사항 개요

### Before (구 방식 - 복사 기반)

```
프로젝트/
├── android/
│   └── app/src/main/java/.../
│       ├── AdchainSdkModule.kt          ❌ 삭제 필요
│       ├── AdchainSdkPackage.kt         ❌ 삭제 필요
│       ├── AdchainOfferwallView.kt      ❌ 삭제 필요
│       └── (기타 브릿지 파일들...)
├── ios/
│   └── YourApp/
│       ├── AdchainSdk.swift             ❌ 삭제 필요
│       ├── AdchainSdk.m                 ❌ 삭제 필요
│       ├── AdchainOfferwallView.swift   ❌ 삭제 필요
│       └── (기타 브릿지 파일들...)
└── src/
    └── AdchainSdk.ts                    ❌ 삭제 필요 (직접 작성한 경우)
```

**문제점**:
- ❌ 매 버전 업데이트마다 파일을 수동으로 복사
- ❌ 파일 누락 가능성
- ❌ 패키지명/Bundle ID 변경 필요
- ❌ 업데이트 시 변경된 파일 추적 어려움

### After (신 방식 - NPM 패키지)

```
프로젝트/
├── package.json
│   └── "@1selfworld/adchain-sdk-react-native": "^1.0.17"  ✅ NPM 패키지
└── src/
    └── 기존 파일들 (import 경로만 변경)
```

**장점**:
- ✅ `npm install`로 설치 완료
- ✅ 버전 관리 간편 (`package.json`)
- ✅ 파일 복사 불필요
- ✅ 업데이트 시 `npm update`만 실행
- ✅ 네이티브 브릿지 코드 자동 포함

---

## ✅ 마이그레이션 체크리스트

### 사전 준비
- [ ] 현재 프로젝트 백업 (Git commit 또는 별도 복사)
- [ ] 기존 AdChain SDK 버전 확인
- [ ] 사용 중인 기능 목록 작성

### 필수 작업
- [ ] **Step 1**: Android Native 브릿지 파일 제거
- [ ] **Step 2**: iOS Native 브릿지 파일 제거
- [ ] **Step 3**: Native SDK 직접 참조 제거
- [ ] **Step 4**: NPM 패키지 설치
- [ ] **Step 5**: Import 경로 변경
- [ ] **Step 6**: iOS Pod 재설치
- [ ] **Step 7**: 빌드 테스트

### 선택 작업 (필요 시)
- [ ] UI 컴포넌트 import 경로 업데이트
- [ ] 타입 정의 확인 및 업데이트

---

## 📖 단계별 마이그레이션 가이드

### Step 1: Native 브릿지 파일 제거

#### 1-1. Android 브릿지 파일 삭제

다음 파일들을 **삭제**하세요:

```bash
# Android 브릿지 파일들
android/app/src/main/java/com/yourapp/
├── AdchainSdkModule.kt              ❌ 삭제
├── AdchainSdkPackage.kt             ❌ 삭제
├── AdchainOfferwallViewManager.kt   ❌ 삭제
├── AdchainOfferwallView.kt          ❌ 삭제
├── WebViewStackManager.kt           ❌ 삭제 (있는 경우)
└── JavaScriptBridge.kt              ❌ 삭제 (있는 경우)
```

**실행 명령**:
```bash
# 주의: 경로를 실제 패키지명으로 변경하세요
rm -f android/app/src/main/java/com/yourapp/AdchainSdkModule.kt
rm -f android/app/src/main/java/com/yourapp/AdchainSdkPackage.kt
rm -f android/app/src/main/java/com/yourapp/AdchainOfferwallViewManager.kt
rm -f android/app/src/main/java/com/yourapp/AdchainOfferwallView.kt
rm -f android/app/src/main/java/com/yourapp/WebViewStackManager.kt
rm -f android/app/src/main/java/com/yourapp/JavaScriptBridge.kt
```

#### 1-2. iOS 브릿지 파일 삭제

다음 파일들을 **삭제**하세요:

```bash
# iOS 브릿지 파일들
ios/YourApp/
├── AdchainSdk.swift                 ❌ 삭제
├── AdchainSdk.m                     ❌ 삭제
├── AdchainOfferwallView.swift       ❌ 삭제
├── AdchainOfferwallView.m           ❌ 삭제
├── WebViewStackManager.swift        ❌ 삭제 (있는 경우)
└── JavaScriptBridge.swift           ❌ 삭제 (있는 경우)
```

**실행 명령**:
```bash
# 주의: 경로를 실제 앱명으로 변경하세요
rm -f ios/YourApp/AdchainSdk.swift
rm -f ios/YourApp/AdchainSdk.m
rm -f ios/YourApp/AdchainOfferwallView.swift
rm -f ios/YourApp/AdchainOfferwallView.m
rm -f ios/YourApp/WebViewStackManager.swift
rm -f ios/YourApp/JavaScriptBridge.swift
```

**⚠️ 중요**: Xcode 프로젝트에서도 제거해야 합니다!

1. Xcode에서 프로젝트 열기
2. 왼쪽 파일 네비게이터에서 위 파일들 찾기
3. 파일 우클릭 → "Delete" → "Move to Trash" 선택

---

### Step 2: Native SDK 참조 제거

#### 2-1. Android - Native SDK 참조 제거

**`android/app/build.gradle`**에서 AdChain SDK 참조를 제거하세요:

```diff
dependencies {
-   // AdChain SDK (로컬 또는 원격)
-   implementation project(':adchain-sdk-android')
-   // 또는
-   implementation 'com.github.1selfworld-labs:adchain-sdk-android:v1.0.29'

    // 다른 의존성들...
}
```

**`android/settings.gradle`**에서도 제거:

```diff
-include ':adchain-sdk-android'
-project(':adchain-sdk-android').projectDir = new File(rootProject.projectDir, '../adchain-sdk-android')
```

#### 2-2. iOS - Native SDK 참조 제거

**`ios/Podfile`**에서 AdChain SDK 관련 참조를 **모두 제거**하세요:

```diff
target 'YourApp' do
  # ... 다른 설정들

-  # AdChain SDK (로컬)
-  pod 'AdChainSDK', :path => '../../adchain-sdk-ios'

-  # AdChain SDK (원격)
-  pod 'AdChainSDK', :git => 'https://github.com/1selfworld-labs/adchain-sdk-ios-release.git', :tag => 'v1.0.44'

  # ... 다른 pod들
end
```

**✅ 중요**:
- **모든** AdChain SDK pod 참조를 제거해야 합니다 (로컬/원격 모두)
- NPM 패키지(`@1selfworld/adchain-sdk-react-native`)의 **Podspec이 자동으로 처리**합니다
- `pod install` 실행 시 NPM 패키지가 자동으로 필요한 iOS SDK를 설치합니다

---

### Step 3: NPM 패키지 설치

#### 3-1. 기존 설정 제거 (혹시 있다면)

```bash
# package.json에 잘못된 참조가 있다면 제거
npm uninstall adchain-sdk-react-native
npm uninstall @adchain/react-native-sdk
```

#### 3-2. 공식 NPM 패키지 설치

```bash
npm install @1selfworld/adchain-sdk-react-native

# 또는 yarn
yarn add @1selfworld/adchain-sdk-react-native
```

#### 3-3. 설치 확인

```bash
# package.json에 추가되었는지 확인
cat package.json | grep adchain

# 출력 예시:
# "@1selfworld/adchain-sdk-react-native": "^1.0.17"
```

---

### Step 4: Import 경로 변경

#### 4-1. SDK 메인 Import 변경

**Before (구 방식)**:
```typescript
// ❌ 직접 복사한 파일에서 import
import AdchainSdk from './AdchainSdk';
import AdchainSdk from './native/AdchainSdk';
import AdchainSdk from './sdk/AdchainSdk';
```

**After (신 방식)**:
```typescript
// ✅ NPM 패키지에서 import
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';
```

#### 4-2. Offerwall View Import 변경

**Before (구 방식)**:
```typescript
// ❌ 직접 복사한 컴포넌트
import { AdchainOfferwallView } from './components/AdchainOfferwallView';
```

**After (신 방식)**:
```typescript
// ✅ NPM 패키지에서 import
import { AdchainOfferwallView } from '@1selfworld/adchain-sdk-react-native';
```

#### 4-3. 이벤트 리스너 Helper 사용 (선택)

**Before (구 방식)**:
```typescript
import { NativeEventEmitter } from 'react-native';
import AdchainSdk from './AdchainSdk';

const adchainEventEmitter = new NativeEventEmitter(AdchainSdk);
adchainEventEmitter.addListener('onMissionCompleted', ...);
```

**After (신 방식 - 더 간편)**:
```typescript
// ✅ Helper 함수 사용
import { addMissionCompletedListener } from '@1selfworld/adchain-sdk-react-native';

const subscription = addMissionCompletedListener((event) => {
  console.log('미션 완료:', event);
});

// 정리
subscription.remove();
```

#### 4-4. 전체 파일 찾기 및 교체

프로젝트에서 모든 AdChain SDK import를 찾아 변경하세요:

```bash
# import 구문 찾기
grep -r "import.*AdchainSdk" src/

# 또는 VSCode/IDE에서 전체 검색:
# 1. Cmd/Ctrl + Shift + F
# 2. 검색: import.*from.*Adchain
# 3. 하나씩 확인하며 변경
```

**변경 예시**:

```typescript
// ===== App.tsx =====
// Before
import AdchainSdk from './sdk/AdchainSdk';

// After
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';


// ===== OfferwallScreen.tsx =====
// Before
import { AdchainOfferwallView } from '../components/AdchainOfferwallView';

// After
import { AdchainOfferwallView } from '@1selfworld/adchain-sdk-react-native';


// ===== MissionScreen.tsx =====
// Before
import AdchainSdk from '../../native/AdchainSdk';

// After
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';
```

---

### Step 5: iOS Pod 재설치

iOS의 경우 Pod 의존성을 재설치해야 합니다.

```bash
# 1. 기존 Pods 제거
cd ios
rm -rf Pods Podfile.lock

# 2. Pod 재설치
pod install

# 3. 상위 디렉토리로 복귀
cd ..
```

**예상 출력**:
```
Analyzing dependencies
Downloading dependencies
Installing AdChainSDK (1.0.44)
...
Pod installation complete!
```

---

### Step 6: 빌드 및 테스트

#### 6-1. Android 빌드

```bash
# 캐시 정리 및 재빌드
cd android
./gradlew clean
cd ..

# 앱 실행
npx react-native run-android
```

#### 6-2. iOS 빌드

```bash
# 캐시 정리 (선택)
cd ios
xcodebuild clean -workspace YourApp.xcworkspace -scheme YourApp
cd ..

# 앱 실행
npx react-native run-ios
```

#### 6-3. Metro 번들러 재시작

```bash
# 기존 Metro 종료 후
npx react-native start --reset-cache
```

#### 6-4. 기능 테스트

**필수 테스트 항목**:

- [ ] SDK 초기화 (`AdchainSdk.initialize()`)
- [ ] 로그인 (`AdchainSdk.login()`)
- [ ] Quiz 로드 (`AdchainSdk.loadQuizList()`)
- [ ] Mission 로드 (`AdchainSdk.loadMissionList()`)
- [ ] Offerwall 열기 (`AdchainSdk.openOfferwall()`)
- [ ] Adjoe Offerwall (`AdchainSdk.openAdjoeOfferwall()`)
- [ ] NestAds Offerwall (`AdchainSdk.openOfferwallNestAds()`)
- [ ] 임베디드 Offerwall View (`<AdchainOfferwallView />`)
- [ ] 이벤트 리스너 (Mission/Quiz 완료)

---

## 🎨 UI 컴포넌트 참조 경로 변경

UI 컴포넌트(Quiz, Mission, Banner 등)는 여전히 **수동으로 복사**해야 합니다.
다만, **내부에서 SDK를 import하는 경로**를 변경해야 합니다.

### Quiz 컴포넌트 예시

**`src/components/quiz/QuizModule.tsx`**:

```diff
  import React from 'react';
  import { View, Text } from 'react-native';
- import AdchainSdk from '../../AdchainSdk';
+ import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

  export const QuizModule = () => {
    // ... 기존 코드
  };
```

### Mission 컴포넌트 예시

**`src/components/mission/MissionModule.tsx`**:

```diff
  import React from 'react';
  import { View, Text } from 'react-native';
- import AdchainSdk from '../../native/AdchainSdk';
+ import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

  export const MissionModule = () => {
    // ... 기존 코드
  };
```

### Banner 컴포넌트 예시

**`src/components/banner/index.tsx`**:

```diff
  import React from 'react';
  import { TouchableOpacity, Image } from 'react-native';
- import AdchainSdk from '../../sdk/AdchainSdk';
+ import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

  export const BannerAd = () => {
    // ... 기존 코드
  };
```

**⚠️ 체크 포인트**:

UI 컴포넌트 파일들에서 AdChain SDK를 import하는 모든 경로를 찾아 변경하세요:

```bash
# UI 컴포넌트 폴더에서 import 찾기
grep -r "import.*AdchainSdk" src/components/
```

---

## 🚨 문제 해결

### Q1: "Module not found: @1selfworld/adchain-sdk-react-native"

**원인**: NPM 패키지가 설치되지 않음

**해결**:
```bash
npm install @1selfworld/adchain-sdk-react-native
npx react-native start --reset-cache
```

---

### Q2: iOS 빌드 에러 - "AdChainSDK not found"

**원인**: Pod이 설치되지 않음

**해결**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

---

### Q3: Android 빌드 에러 - "Duplicate class AdchainSdkModule"

**원인**: 기존 Native 브릿지 파일이 남아있음

**해결**:
```bash
# 1. 기존 브릿지 파일 완전 삭제
rm -f android/app/src/main/java/com/yourapp/AdchainSdk*.kt

# 2. Clean build
cd android
./gradlew clean
cd ..

# 3. 재빌드
npx react-native run-android
```

---

### Q4: "Native module AdchainSdk tried to override..."

**원인**: `MainApplication.kt/java`에 중복 패키지 등록

**해결**:

**`android/app/src/main/java/.../MainApplication.kt`** 확인:

```kotlin
override fun getPackages(): List<ReactPackage> {
  return PackageList(this).packages.apply {
    // ❌ 이런 코드가 있다면 제거
    // add(AdchainSdkPackage())
  }
}
```

NPM 패키지가 자동으로 등록하므로 **수동 추가 불필요**합니다.

---

### Q5: TypeScript 에러 - "Cannot find module '@1selfworld/adchain-sdk-react-native'"

**원인**: TypeScript가 새 패키지를 인식하지 못함

**해결**:
```bash
# 1. node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 2. Metro 재시작
npx react-native start --reset-cache

# 3. TypeScript 서버 재시작 (VSCode)
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

### Q6: 이벤트 리스너가 작동하지 않음

**원인**: 이벤트명 오타 또는 잘못된 사용

**해결**:

올바른 이벤트명 사용:

```typescript
// ✅ 올바른 사용
import { addMissionCompletedListener, addQuizCompletedListener }
  from '@1selfworld/adchain-sdk-react-native';

const subscription = addMissionCompletedListener((event) => {
  console.log('미션 완료:', event.missionId);
});

// 정리
subscription.remove();
```

또는 NativeEventEmitter 직접 사용:

```typescript
import { NativeEventEmitter } from 'react-native';
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

const emitter = new NativeEventEmitter(AdchainSdk);

// ⚠️ 주의: 'onMissionCompleted' (끝에 'd' 있음)
const sub = emitter.addListener('onMissionCompleted', (event) => {
  console.log(event);
});
```

---

## 🔄 롤백 가이드

만약 마이그레이션 중 문제가 발생하여 구 버전으로 돌아가야 한다면:

### 1. Git으로 롤백 (권장)

```bash
# 변경 사항 취소
git reset --hard HEAD

# 또는 특정 커밋으로
git reset --hard <commit-hash>
```

### 2. 수동 롤백

```bash
# 1. NPM 패키지 제거
npm uninstall @1selfworld/adchain-sdk-react-native

# 2. 기존 Native 파일 복구 (백업에서)
# ...

# 3. 기존 설정 복구
# android/app/build.gradle, ios/Podfile 등

# 4. 빌드 재실행
```

---

## ✅ 마이그레이션 완료 확인

모든 단계를 완료했다면 다음을 확인하세요:

### 파일 시스템 체크

```bash
# ❌ 이 파일들이 없어야 함
ls android/app/src/main/java/*/AdchainSdk*.kt
ls ios/YourApp/AdchainSdk.*

# ✅ 이것만 있어야 함
cat package.json | grep "@1selfworld/adchain-sdk-react-native"
```

### 빌드 체크

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

### 기능 체크

앱을 실행하고 다음 기능들이 정상 작동하는지 확인:

- [x] SDK 초기화
- [x] 로그인
- [x] Quiz 로드 및 표시
- [x] Mission 로드 및 표시
- [x] Offerwall 열기
- [x] 이벤트 리스너 동작

---

## 📞 지원

마이그레이션 중 문제가 발생하면:

1. **문제 해결 섹션** 확인
2. **샘플 프로젝트** 참조: [adchain-sdk-react-native-sample](https://github.com/1selfworld-labs/adchain-sdk-react-sample)
3. **기술 지원**: contacts@1self.world
4. **GitHub Issues**: [Issues 페이지](https://github.com/1selfworld-labs/adchain-sdk-react-sample/issues)

---

## 📝 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2025-10-29 | 1.0.0 | 마이그레이션 가이드 최초 작성 |

---

**Happy Coding! 🚀**
