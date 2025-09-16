import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Mission from "./mission";
import Quiz from "./quiz";

interface TabNavigationProps {
  isLoggedIn: boolean;
}

const TabNavigation = ({ isLoggedIn }: TabNavigationProps) => {
  const [activeTab, setActiveTab] = useState<"quiz" | "mission">("quiz");

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
