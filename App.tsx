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
    APP_KEY: "123456781",
    APP_SECRET: "abcdefghigjk",
  },
  ios: {
    APP_KEY: "123456782",
    APP_SECRET: "abcdefghigjk",
  },
};

function App(): React.JSX.Element {
  const isDarkMode = false; // 항상 라이트 모드 사용
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSkipMode, setIsSkipMode] = useState(false); // Skip Login mode for testing

  const backgroundStyle = {
    backgroundColor: Colors.lighter, // 항상 흰색 배경
  };

  // Auto SDK initialization removed - User must click "Initialize SDK" button

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
      setSdkError(null); // Clear any previous errors
      console.log(`AdchainSDK initialized successfully for ${Platform.OS}`);
    } catch (error) {
      console.error("AdchainSDK initialization error:", error);
      setSdkError(
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : "SDK 초기화 실패"
      );
      setSdkInitialized(false); // Keep SDK uninitialized on error
    }
  };

  const handleSkipLogin = () => {
    console.log("Skip Login - Testing without SDK initialization");
    setIsSkipMode(true);
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
      setIsSkipMode(false); // Clear skip mode on successful login
    } catch (error) {
      console.error("Login error:", error);
      setSdkError(
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : "로그인 실패"
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

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
            {!isLoggedIn && !isSkipMode ? (
              <LoginForm
                onLogin={handleLogin}
                onInitialize={initializeSDK}
                onSkipLogin={handleSkipLogin}
                isLoading={isLoggingIn}
                sdkInitialized={sdkInitialized}
              />
            ) : (
              <TabNavigation isLoggedIn={isLoggedIn} isSkipMode={isSkipMode} />
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
