# TreasurerRN - React Native App

Treasurer 금융 앱의 React Native 버전입니다.

## 기술 스택
- React Native 0.74.0
- TypeScript
- React Navigation 6
- React Native Vector Icons
- React Native Reanimated

## 주요 기능
- 홈 화면: 자산 관리, 지식 퀴즈, 출석체크
- 혜택 화면: 포인트 시스템, 경제 레슨, 실물교환
- 하단 탭 네비게이션
- iOS/Android 크로스 플랫폼 지원

## 실행 방법

### 설치
```bash
yarn install
```

### iOS
```bash
cd ios && pod install
cd .. && yarn ios
```

### Android
```bash
yarn android
```

## 프로젝트 구조
```
src/
├── screens/        # 화면 컴포넌트
├── components/     # 재사용 컴포넌트  
├── navigation/     # 네비게이션 설정
├── styles/        # 스타일 테마
└── utils/         # 유틸리티
```
