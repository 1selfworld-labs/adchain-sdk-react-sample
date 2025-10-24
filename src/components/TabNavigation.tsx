import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View, findNodeHandle } from "react-native";
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';
import { DebugInfo } from "../interface/debug";
import Adjoe from "./adjoe";
import AppLaunchTest from "./appLaunch";
import Debug from "./debug";
import Mission from "./mission";
import Quiz from "./quiz";
import { AdchainOfferwallView } from '@1selfworld/adchain-sdk-react-native';

interface TabNavigationProps {
  isLoggedIn: boolean;
  isSkipMode?: boolean;
}

const TabNavigation = ({ isLoggedIn, isSkipMode = false }: TabNavigationProps) => {
  const [activeTab, setActiveTab] = useState<"quiz" | "mission" | "adjoe" | "appLaunch" | "offerwallView">("quiz");
  const offerwallViewRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    userId: "",
    ifa: "",
    isInitialized: false,
    bannerInfo: "" as any,
    quizInfo: "" as any,
    missionInfo: "" as any,
  });

  const fetchDebugInfo = async () => {
    try {
      if (!isLoggedIn) {
        return;
      }
      setDebugInfo({
        userId: "",
        ifa: "",
        isInitialized: false,
        bannerInfo: "" as any,
        quizInfo: "" as any,
        missionInfo: "" as any,
      });

      // 디버깅 정보 수집 (SDK 상태 정보만)
      const [userId, ifa, isInit] = await Promise.all([
        AdchainSdk.getUserId(),
        AdchainSdk.getIFA(),
        AdchainSdk.isInitialized(),
      ]);

      // getBannerInfo 호출 (디버깅 용도)
      let bannerInfo = null;
      try {
        bannerInfo = await AdchainSdk.getBannerInfo("test_banner_001");
      } catch (bannerError) {
        bannerInfo = { error: (bannerError as string) || "Failed to get banner info" };
      }

      // Quiz와 Mission 데이터는 각 컴포넌트가 직접 관리하도록 변경
      // 중복 호출 방지를 위해 제거
      const quizInfo = { note: "Quiz data managed by Quiz component" };
      const missionInfo = { note: "Mission data managed by Mission component" };

      setDebugInfo({
        userId: userId || "Not logged in",
        ifa: ifa || "Not available",
        isInitialized: isInit,
        bannerInfo: bannerInfo,
        quizInfo: quizInfo,
        missionInfo: missionInfo,
      });
    } catch (error) {
      console.error("Error fetching debug info:", error);
    }
  };

  // 앱 포커스 이벤트 리스너 - iOS 추적 허용 후 IFA 갱신을 위해
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App became active, refreshing debug info...');
        fetchDebugInfo();
      }
    });

    // 초기 로드
    fetchDebugInfo();

    return () => {
      subscription?.remove();
    };
  }, []); // 한 번만 설정

  // 탭 변경 및 로그인 상태 변경 시 갱신
  useEffect(() => {
    fetchDebugInfo();
  }, [activeTab, isLoggedIn]);

  // Handle back button for Offerwall tab
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeTab === 'offerwallView' && offerwallViewRef.current) {
        const viewId = findNodeHandle(offerwallViewRef.current);
        if (viewId) {
          console.log('[TabNavigation] Back button pressed in Offerwall tab, calling handleBackPress');
          UIManager.dispatchViewManagerCommand(
            viewId,
            'handleBackPress',
            []
          );
          return true; // Prevent default back behavior
        }
      }
      return false; // Allow default back behavior for other tabs
    });

    return () => backHandler.remove();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* Offerwall 탭일 때는 ScrollView 없이 전체 화면 사용 */}
      {activeTab === "offerwallView" ? (
        <View style={styles.contentContainer} pointerEvents="box-none">
          <AdchainOfferwallView
            ref={offerwallViewRef}
            placementId="tab_embedded_offerwall"
            style={{ flex: 1, width: '100%' }}
            onOfferwallOpened={() => console.log('Offerwall opened in tab')}
            onOfferwallClosed={() => console.log('Offerwall closed in tab')}
            onOfferwallError={(error) => console.error('Offerwall error:', error)}
            onRewardEarned={(amount) => console.log('Reward earned:', amount)}
            onCustomEvent={(eventType, payload) => {
              console.log('[WebView → App] Custom Event:', eventType, payload);

              // 이벤트 타입별 처리
              if (eventType === 'show_toast') {
                Alert.alert('WebView Message', payload.message || JSON.stringify(payload));
              } else if (eventType === 'navigate') {
                Alert.alert('Navigation Request', `Target: ${payload.screen || 'unknown'}`);
              } else if (eventType === 'share') {
                Alert.alert('Share Request', `Title: ${payload.title || ''}\nURL: ${payload.url || ''}`);
              } else {
                Alert.alert('Custom Event', `Type: ${eventType}\n\n${JSON.stringify(payload, null, 2)}`);
              }
            }}
            onDataRequest={(requestType, params) => {
              console.log('[WebView → App] Data Request:', requestType, params);

              // 요청 타입별 응답 데이터
              const responses: Record<string, any> = {
                'user_points': { points: 12345, currency: 'KRW' },
                'user_profile': { userId: 'test_123', nickname: 'TestPlayer', level: 42 },
                'app_version': { version: '1.0.0', buildNumber: 100 }
              };

              const response = responses[requestType] || null;
              console.log('[App → WebView] Data Response:', response);

              return response;
            }}
          />
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {activeTab === "quiz" ? (
            <Quiz isLoggedIn={isLoggedIn} />
          ) : activeTab === "mission" ? (
            <Mission />
          ) : activeTab === "adjoe" ? (
            <Adjoe isSkipMode={isSkipMode} />
          ) : activeTab === "appLaunch" ? (
            <AppLaunchTest isSkipMode={isSkipMode} />
          ) : null}

          {/* Debug Info 표시 */}
          <Debug debugInfo={debugInfo} onRefresh={fetchDebugInfo} />
        </ScrollView>
      )}

      {/* 하단 탭 바 (고정) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "quiz" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("quiz")}>
          <Text style={[styles.tabText, activeTab === "quiz" ? styles.activeTabText : styles.inactiveTabText]}>
            퀴즈
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "mission" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("mission")}>
          <Text style={[styles.tabText, activeTab === "mission" ? styles.activeTabText : styles.inactiveTabText]}>
            미션
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "adjoe" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("adjoe")}>
          <Text style={[styles.tabText, activeTab === "adjoe" ? styles.activeTabText : styles.inactiveTabText]}>
            Adjoe
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "appLaunch" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("appLaunch")}>
          <Text style={[styles.tabText, activeTab === "appLaunch" ? styles.activeTabText : styles.inactiveTabText]}>
            Launch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "offerwallView" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("offerwallView")}>
          <Text style={[styles.tabText, activeTab === "offerwallView" ? styles.activeTabText : styles.inactiveTabText]}>
            Offerwall
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  tabContainer: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#046BD5",
  },
  inactiveTabText: {
    color: "#666666",
  },
  missionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
  },
});

export default TabNavigation;
