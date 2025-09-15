# AdChain SDK 네이티브 모듈 설정 가이드

React Native 앱에서 **AdChain SDK**를 사용하기 위해 Android와 iOS 각각에
네이티브 모듈을 설정해야 합니다. 아래 단계에 따라 프로젝트에 적용하세요.


## adchain-sdk-react-sample

해당 샘플의 경우, git clone 이후, 
- npx react-native run-android
- npx react-native run-ios

로 실행이 가능합니다.

다만 ios의 경우에만 실행되지 않을 경우 다음의 명령어를 통해 빌드가 정상적으로 진행될 수 있습니다.

1. 기존 Pod 관련 파일 삭제

```
  cd ios
  rm -rf Pods
  rm -rf Podfile.lock
  rm -rf ~/Library/Caches/CocoaPods
  rm -rf ~/Library/Developer/Xcode/DerivedData/*

  2. Pod 캐시 정리
  pod cache clean --all
  
  3. Pod 재설치
  pod install

```

------------------------------------------------------------------------
# 아래부터는 react-native 프로젝트에 SDK와 관련된 코드를 이식하는 방법을 설명합니다.

## 📱 Android 설정

### 1. 필수 파일 추가

프로젝트에 다음 두 파일을 추가합니다:

-   `android/app/src/main/java/com/PROJECT/AdchainSdkModule.kt`\
    → AdChain SDK 기능을 React Native로 브리지하는 메인 모듈

-   `android/app/src/main/java/com/PROJECT/AdchainSdkPackage.kt`\
    → React Native에 네이티브 모듈을 등록하는 패키지

------------------------------------------------------------------------

### 2. 패키지 등록

`MainApplication.kt` 또는 `MainApplication.java`에 `AdchainSdkPackage`를
등록합니다:

``` kotlin
// MainApplication.kt
override fun getReactNativeHost(): ReactNativeHost {
  return object : ReactNativeHost(this) {
    override fun getPackages(): List<ReactPackage> =
      PackageList(this).packages.apply {
        add(AdchainSdkPackage()) // 추가
      }
  }
}
```

------------------------------------------------------------------------

## 🍏 iOS 설정

### 1. 필수 파일 추가

iOS 프로젝트에 다음 두 파일을 추가합니다:

-   `ios/TreasurerRN/AdchainSdk.swift`\
    → AdChain SDK 기능을 React Native로 브리지하는 Swift 모듈

-   `ios/TreasurerRN/AdchainSdk.m`\
    → Swift 모듈을 React Native에서 인식할 수 있도록 연결하는
    Objective-C 브리지

------------------------------------------------------------------------

### 2. 프로젝트 설정

1.  Xcode에서 프로젝트 열기\
2.  해당 파일들을 프로젝트 네비게이터에 추가\
3.  "Add to target"에서 메인 앱 타겟 선택

> **Note**: Swift와 Objective-C를 함께 사용하므로 **Bridging Header**가
> 필요할 수 있습니다.

------------------------------------------------------------------------

### 3. 의존성 추가

`ios/Podfile`에 SDK를 추가합니다:

``` ruby
target 'PROJECT' do
  # 기존 pods ...
  pod 'AdChainSDK', :git => 'https://github.com/1selfworld-labs/adchain-sdk-ios-release.git', :tag => 'v1.0.9'
end
```

설치 실행:

``` bash
cd ios
pod install
```

------------------------------------------------------------------------

## ⚙️ 공통 설정 체크리스트

-   **패키지명/Bundle ID 확인**
    -   Android: `android/app/build.gradle` → `applicationId`\
    -   iOS: Xcode → Bundle Identifier
-   **네이티브 모듈명 일치**
    -   Android: `AdchainSdkModule.NAME = "AdchainSdk"`\
    -   iOS: `@objc(AdchainSdk)`
-   **API 일관성 유지**\
    Android와 iOS 모두 동일한 메서드 시그니처 제공:
    -   `initialize(appKey, appSecret, options)`
    -   `login(userId, userInfo)`
    -   `loadQuizList(unitId)`
    -   `clickQuiz(unitId, quizId)`
    -   `loadMissionList(unitId)`
    -   `clickMission(unitId, missionId)`
    -   `claimReward(unitId)`
    -   `openOfferwall()`

------------------------------------------------------------------------

## 💻 React Native 사용 예시

``` javascript
import { NativeModules } from "react-native";

const { AdchainSdk } = NativeModules;

// SDK 초기화
await AdchainSdk.initialize(appKey, appSecret, options);

// 사용자 로그인
await AdchainSdk.login(userId, userInfo);

// Quiz 목록 불러오기
const quizList = await AdchainSdk.loadQuizList(unitId);

// Mission 목록 불러오기
const response: any = await AdchainSdk.loadMissionList(MISSION_UNIT_ID);
```
------------------------------------------------------------------------
