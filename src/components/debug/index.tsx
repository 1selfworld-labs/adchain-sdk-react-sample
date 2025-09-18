import { Platform, StyleSheet, Text, View } from "react-native";
import { DebugInfo } from "../../interface/debug";

interface IProps {
  debugInfo: DebugInfo;
}

const Debug = ({ debugInfo }: IProps) => {
  return (
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
      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>Banner Info:</Text>
        <Text style={styles.debugValue}>{JSON.stringify(debugInfo.bannerInfo, null, 2)}</Text>
      </View>
      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>Quiz Info:</Text>
        <Text style={styles.debugValue}>{JSON.stringify(debugInfo.quizInfo, null, 2)}</Text>
      </View>
      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>Mission Info:</Text>
        <Text style={styles.debugValue}>{JSON.stringify(debugInfo.missionInfo, null, 2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Debug;
