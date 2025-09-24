/**
 * AdChain SDK Sample App with Quiz and Mission
 */

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import LoginForm from "./src/components/LoginForm";
import TabNavigation from "./src/components/TabNavigation";

// SDK import
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AdchainSdk from "./src/index";

// SDK 환경 설정
const SDK_CONFIG = {
  android: {
    APP_KEY: "100000001",
    APP_SECRET: "gjFs586lLuUweJRN",
  },
  ios: {
    APP_KEY: "100000002",
    APP_SECRET: "3ANgfF9Zfbm79oa6",
  },
};

function App(): React.JSX.Element {
  const isDarkMode = false; // 항상 라이트 모드 사용
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const backgroundStyle = {
    backgroundColor: Colors.lighter, // 항상 흰색 배경
  };

  useEffect(() => {
    // 3버튼 네비게이션 모드에서 Activity가 준비될 때까지 대기
    // SDK 초기화를 500ms 지연시켜 Activity가 완전히 준비되도록 함
    const initTimeout = setTimeout(() => {
      initializeSDK();
    }, 500);

    return () => clearTimeout(initTimeout);
  }, []);

  const initializeSDK = async () => {
    try {
      // 플랫폼별 SDK 설정
      const sdkConfig = Platform.select({
        android: {
          appKey: SDK_CONFIG.android.APP_KEY,
          appSecret: SDK_CONFIG.android.APP_SECRET,
          environment: "PRODUCTION" as const,
        },
        ios: {
          appKey: SDK_CONFIG.ios.APP_KEY,
          appSecret: SDK_CONFIG.ios.APP_SECRET,
          environment: "PRODUCTION" as const,
        },
        default: {
          appKey: "test-app",
          appSecret: "test-secret",
          environment: "DEVELOPMENT" as const,
        },
      });

      // SDK 초기화
      await AdchainSdk.initialize(sdkConfig);
      console.log(`AdchainSDK initialized for ${Platform.OS}`);

      // SDK 초기화 완료를 위해 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 로그인 상태 확인
      const loggedIn = await AdchainSdk.isLoggedIn();
      setIsLoggedIn(loggedIn);

      setSdkInitialized(true);
    } catch (error) {
      console.error("AdchainSDK initialization error:", error);
      setSdkError((error as string) || "SDK 초기화 실패");
      // UI는 계속 표시하되, SDK 기능은 비활성화
      setSdkInitialized(true);
    }
  };

  const handleLogin = async (userId: string, gender?: "MALE" | "FEMALE", birthYear?: number) => {
    setIsLoggingIn(true);
    try {
      const loginData: any = { userId };
      if (gender) loginData.gender = gender;
      if (birthYear) loginData.birthYear = birthYear;
      console.log("loginData", loginData);

      await AdchainSdk.login(loginData);
      console.log(
        "AdchainSDK logged in with userId:",
        userId,
        gender ? gender : undefined,
        birthYear ? birthYear : undefined
      );
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      setSdkError((error as string) || "로그인 실패");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!sdkInitialized) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[backgroundStyle, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>SDK 초기화 중...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={"dark-content"} // 항상 어두운 아이콘 (흰 배경용)
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {sdkError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {sdkError}</Text>
          </View>
        )}

        <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
          <View style={styles.container}>
            {!isLoggedIn ? (
              <LoginForm onLogin={handleLogin} isLoading={isLoggingIn} />
            ) : (
              <TabNavigation isLoggedIn={isLoggedIn} />
            )}
            {/* Debug Information Panel */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    height: "100%",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    textAlign: "center",
  },
});

export default App;
