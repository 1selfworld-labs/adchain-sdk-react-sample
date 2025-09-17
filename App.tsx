/**
 * AdChain SDK Sample App with Quiz and Mission
 */

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import LoginForm from "./src/components/LoginForm";
import TabNavigation from "./src/components/TabNavigation";

// SDK import
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
  const [debugInfo, setDebugInfo] = useState({
    userId: "",
    ifa: "",
    isInitialized: false,
  });

  const backgroundStyle = {
    backgroundColor: Colors.lighter, // 항상 흰색 배경
  };

  useEffect(() => {
    // SDK 초기화
    initializeSDK();
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
      setSdkError(error?.message || "SDK 초기화 실패");
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

      // 로그인 후 디버그 정보 갱신
      await fetchDebugInfo();
    } catch (error) {
      console.error("Login error:", error);
      setSdkError(error?.message || "로그인 실패");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      // 디버깅 정보 수집
      const [userId, ifa, isInit] = await Promise.all([
        AdchainSdk.getUserId(),
        AdchainSdk.getIFA(),
        AdchainSdk.isInitialized(),
      ]);

      setDebugInfo({
        userId: userId || "Not logged in",
        ifa: ifa || "Not available",
        isInitialized: isInit,
      });
    } catch (error) {
      console.error("Error fetching debug info:", error);
    }
  };

  useEffect(() => {
    if (sdkInitialized) {
      fetchDebugInfo();
    }
  }, [sdkInitialized, isLoggedIn]);

  if (!sdkInitialized) {
    return (
      <SafeAreaView style={[backgroundStyle, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>SDK 초기화 중...</Text>
      </SafeAreaView>
    );
  }

  return (
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
          <View style={styles.debugPanel}>
            <Text style={styles.debugTitle}>🔧 Debug Info</Text>
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>User ID:</Text>
              <Text style={styles.debugValue}>{debugInfo.userId}</Text>
            </View>
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>IFA (Ad ID):</Text>
              <Text style={styles.debugValue}>{debugInfo.ifa}</Text>
            </View>
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>SDK Initialized:</Text>
              <Text style={[styles.debugValue, { color: debugInfo.isInitialized ? "#4CAF50" : "#F44336" }]}>
                {debugInfo.isInitialized ? "✓ Yes" : "✗ No"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  debugPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  debugRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  debugLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  debugValue: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});

export default App;
