import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdchainSdk from "@1selfworld/adchain-sdk-react-native";

// 전체화면 오퍼월 (AdchainSdk.openOfferwall)
const Offerwall = () => {
  // 가이드 헤드라인 예제: openOfferwall
  const openOfferwall = async () => {
    try {
      await AdchainSdk.openOfferwall("main_offerwall");
    } catch (error) {
      Alert.alert("오류", "오퍼월을 열 수 없습니다");
    }
  };

  // 커스텀 URL 오퍼월: openOfferwallWithUrl
  const openOfferwallWithUrl = async () => {
    try {
      await AdchainSdk.openOfferwallWithUrl(
        "https://reward.adchain.plus?test=offerwall",
        "CUSTOM_URL"
      );
    } catch (error) {
      Alert.alert("오류", "오퍼월을 열 수 없습니다");
    }
  };

  return (
    <View style={styles.container}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>전체화면 오퍼월</Text>
        <Text style={styles.sectionDescription}>AdchainSdk.openOfferwall</Text>
      </View>

      {/* 오퍼월 열기 버튼 (가이드 동일) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>기본 오퍼월</Text>
        <Text style={styles.cardDescription}>
          {"placementId: 'main_offerwall'"}
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={openOfferwall}>
          <Text style={styles.primaryButtonText}>오퍼월 열기</Text>
        </TouchableOpacity>
      </View>

      {/* 커스텀 URL 오퍼월 버튼 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>커스텀 URL 오퍼월</Text>
        <Text style={styles.cardDescription}>
          {"AdchainSdk.openOfferwallWithUrl(url, 'CUSTOM_URL')"}
        </Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={openOfferwallWithUrl}>
          <Text style={styles.secondaryButtonText}>커스텀 URL 오퍼월 열기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#046BD5",
    fontFamily: "monospace",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  cardDescription: {
    fontSize: 12,
    color: "#888888",
    fontFamily: "monospace",
  },
  primaryButton: {
    backgroundColor: "#046BD5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#FF9500",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default Offerwall;
