import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

      // 디버깅 정보 수집
      const [userId, ifa, isInit] = await Promise.all([
        AdchainSdk.getUserId(),
        AdchainSdk.getIFA(),
        AdchainSdk.isInitialized(),
      ]);

      // getBannerInfo 호출
      let bannerInfo = null;
      try {
        bannerInfo = await AdchainSdk.getBannerInfo("test_banner_001");
      } catch (bannerError) {
        bannerInfo = { error: (bannerError as string) || "Failed to get banner info" };
      }

      // loadQuizList 호출 (전체 QuizResponse 반환)
      let quizInfo = null;
      try {
        quizInfo = await AdchainSdk.loadQuizList("quiz_unit_001");
      } catch (quizError) {
        quizInfo = { error: (quizError as string) || "Failed to get quiz info" };
      }

      // loadMissionList 호출
      let missionInfo = null;
      try {
        missionInfo = await AdchainSdk.loadMissionList("mission_unit_001");
      } catch (missionError) {
        missionInfo = { error: (missionError as string) || "Failed to get mission info" };
      }

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

  useEffect(() => {
    fetchDebugInfo();
  }, [activeTab]);

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
      <Debug debugInfo={debugInfo} />
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
