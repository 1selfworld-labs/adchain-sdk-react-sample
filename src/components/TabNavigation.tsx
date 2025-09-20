import React, { useEffect, useState } from "react";
import { AppState, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdchainSdk from "../../src/index";
import { DebugInfo } from "../interface/debug";
import Debug from "./debug";
import Mission from "./mission";
import Quiz from "./quiz";

interface TabNavigationProps {
  isLoggedIn: boolean;
}

const TabNavigation = ({ isLoggedIn }: TabNavigationProps) => {
  const [activeTab, setActiveTab] = useState<"quiz" | "mission">("quiz");
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

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "quiz" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("quiz")}>
          <Text style={[styles.tabText, activeTab === "quiz" ? styles.activeTabText : styles.inactiveTabText]}>
            데일리 1분 퀴즈
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "mission" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("mission")}>
          <Text style={[styles.tabText, activeTab === "mission" ? styles.activeTabText : styles.inactiveTabText]}>
            데일리 미션
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>{activeTab === "quiz" ? <Quiz isLoggedIn={isLoggedIn} /> : <Mission />}</View>
      <Debug debugInfo={debugInfo} onRefresh={fetchDebugInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#046BD5",
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  inactiveTabText: {
    color: "#666666",
  },
  contentContainer: {
    flex: 1,
  },
  missionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
  },
});

export default TabNavigation;
