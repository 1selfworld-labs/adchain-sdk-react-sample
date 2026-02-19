# AdChain SDK React Native CLI Sample - 워커 가이드

이 파일은 Claude Code가 `adchain-sdk-react-sample/` 디렉토리에서 작업할 때의 가이드입니다.

---

## ⚠️ 절대 원칙
- 이 워커는 `adchain-sdk-react-sample/` 디렉토리 내에서만 파일을 수정한다
- 다른 레포의 파일은 읽기만 가능하며, 수정이 필요하면 오케스트레이터에게 보고한다

## Team Context
- **Worker ID**: `react-sample`
- **Orchestrator**: 상위 디렉토리 (`adchain-sdk/`)
- **담당 범위**: `adchain-sdk-react-sample/` (전체)
- **Upstream**: `adchain-sdk-react-native` (npm 의존성)
- **Downstream**: 없음 (최종 소비자)

### Agent Teams 프로토콜
- 팀 설정 파일: `~/.claude/teams/adchain-sdk/config.json`에서 팀원 목록 확인
- 작업 확인: TaskList → TaskGet으로 할당된 작업의 상세 내용 확인
- 작업 시작: TaskUpdate(status: "in_progress") → 작업 수행
- 작업 완료: TaskUpdate(status: "completed") → TaskList로 다음 작업 확인
- 오케스트레이터 보고: SendMessage(type: "message", recipient: "team-lead", content: "...", summary: "...")
- 다른 워커 문의: SendMessage(type: "message", recipient: "{워커-name}", content: "...", summary: "...")
- 종료 요청 수신 시: SendMessage(type: "shutdown_response", request_id: "{id}", approve: true)

---

## 프로젝트 개요

React Native CLI 기반 AdChain SDK 샘플 애플리케이션입니다.
`@1selfworld/adchain-sdk-react-native` 패키지를 사용하여 SDK 통합 방법을 시연합니다.

**특징**: Expo가 아닌 순수 React Native CLI 프로젝트

---

## 프로젝트 구조

```
adchain-sdk-react-sample/
├── src/
│   └── screens/            # 화면 컴포넌트
├── android/                # Android 네이티브 프로젝트
├── ios/                    # iOS 네이티브 프로젝트
├── App.tsx                 # 앱 엔트리포인트
├── package.json            # 의존성 (RN SDK 버전 확인)
└── react-native.config.js  # RN 설정
```

---

## 빌드 및 실행 명령어

### 의존성 설치
```bash
npm install
```

### iOS 설정
```bash
cd ios && pod install && cd ..
```

### 실행

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Metro 번들러만 시작
npx react-native start
```

### 빌드

```bash
# Android APK
cd android && ./gradlew assembleRelease

# iOS Archive
# Xcode에서 Product → Archive
```

---

## SDK 버전 업데이트

```bash
# RN SDK 버전 업데이트
npm install @1selfworld/adchain-sdk-react-native@latest

# iOS Pod 재설치
cd ios && pod install && cd ..

# 빌드 확인
npx react-native run-ios
npx react-native run-android
```

---

## 주의사항

- iOS SDK는 `pod install` 시 자동으로 올바른 버전이 설치됨 (Config Plugin 처리)
- `android/` 디렉토리의 네이티브 코드는 일반적으로 수동 수정 불필요
- SDK API 변경 시 `src/` 내 화면 코드만 업데이트

---

## 연관 레포 참조 (읽기 전용)

- RN SDK 최신 버전: `../adchain-sdk-react-native/package.json`
- Expo 샘플 참고: `../adchain-sdk-react-native-expo-sample/src/`
