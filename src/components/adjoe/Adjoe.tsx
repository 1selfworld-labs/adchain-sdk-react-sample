import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdchainSdk from "@1selfworld/adchain-sdk-react-native";

interface AdjoeProps {
  isSkipMode?: boolean;
}

const Adjoe: React.FC<AdjoeProps> = ({ isSkipMode = false }) => {
  const [testResult, setTestResult] = useState<string>("");

  const handleOpenAdjoe = async () => {
    try {
      setTestResult("Opening Adjoe Offerwall...");
      console.log("Attempting to open Adjoe Offerwall");

      const result = await AdchainSdk.openAdjoeOfferwall("main_adjoe_test");

      console.log("Adjoe Offerwall result:", result);
      setTestResult("✅ Adjoe Offerwall opened successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Adjoe Offerwall error:", errorMessage);
      setTestResult(`❌ Error: ${errorMessage}`);

      Alert.alert(
        "Adjoe Offerwall Error",
        errorMessage,
        [{ text: "OK" }]
      );
    }
  };

  const handleWebviewTest1 = async () => {
    try {
      setTestResult("Opening Webview Test #1...");
      console.log("Attempting to open Webview Test #1");

      const url = "https://adchain-offerwall.1self.world/?placement=adjoe";
      const result = await AdchainSdk.openOfferwallWithUrl(url, "webview_test_1");

      console.log("Webview Test #1 result:", result);
      setTestResult("✅ Webview Test #1 opened successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Webview Test #1 error:", errorMessage);
      setTestResult(`❌ Error: ${errorMessage}`);

      Alert.alert(
        "Webview Test #1 Error",
        errorMessage,
        [{ text: "OK" }]
      );
    }
  };

  const handleWebviewTest2 = async () => {
    try {
      setTestResult("Opening Webview Test #2...");
      console.log("Attempting to open Webview Test #2");

      const url = "https://adchain-offerwall-adjoe.1self.world";
      const result = await AdchainSdk.openOfferwallWithUrl(url, "webview_test_2");

      console.log("Webview Test #2 result:", result);
      setTestResult("✅ Webview Test #2 opened successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Webview Test #2 error:", errorMessage);
      setTestResult(`❌ Error: ${errorMessage}`);

      Alert.alert(
        "Webview Test #2 Error",
        errorMessage,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adjoe Offerwall Test</Text>
        <Text style={styles.subtitle}>
          Test the Adjoe SDK integration and error handling
        </Text>
      </View>

      {isSkipMode && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠️ Test Mode Active
          </Text>
          <Text style={styles.warningSubtext}>
            SDK not initialized - Testing graceful error handling
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Adjoe Integration</Text>
        <Text style={styles.sectionDescription}>
          This button will attempt to open the Adjoe Offerwall.
          {"\n\n"}
          Expected behavior:
          {"\n"}• With SDK initialized + logged in: Opens Adjoe catalog
          {"\n"}• Without SDK init: Shows error message
          {"\n"}• Without login: Shows "User not logged in" error
        </Text>

        <TouchableOpacity
          style={styles.testButton}
          onPress={handleOpenAdjoe}>
          <Text style={styles.testButtonText}>Open Adjoe Offerwall</Text>
        </TouchableOpacity>

        {testResult !== "" && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Test Result:</Text>
            <Text style={styles.resultText}>{testResult}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Webview Integration</Text>
        <Text style={styles.sectionDescription}>
          Test opening custom URLs using openOfferwallWithUrl SDK method.
          {"\n\n"}
          These buttons open predefined URLs in the SDK's webview:
        </Text>

        <View style={styles.urlInfo}>
          <Text style={styles.urlLabel}>WEBVIEW TEST #1:</Text>
          <Text style={styles.urlText}>
            https://adchain-offerwall.1self.world/?placement=adjoe
          </Text>
        </View>

        <TouchableOpacity
          style={styles.testButton}
          onPress={handleWebviewTest1}>
          <Text style={styles.testButtonText}>WEBVIEW TEST #1</Text>
        </TouchableOpacity>

        <View style={[styles.urlInfo, { marginTop: 16 }]}>
          <Text style={styles.urlLabel}>WEBVIEW TEST #2:</Text>
          <Text style={styles.urlText}>
            https://adchain-offerwall-adjoe.1self.world
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.testButton, { marginTop: 12 }]}
          onPress={handleWebviewTest2}>
          <Text style={styles.testButtonText}>WEBVIEW TEST #2</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📝 Integration Notes</Text>
        <Text style={styles.infoText}>
          • Adjoe SDK is embedded in AdChain SDK
          {"\n"}• Initialized automatically after user login
          {"\n"}• Server configuration controls Adjoe availability
          {"\n"}• No direct Adjoe SDK dependency needed in app
          {"\n"}• Error handling ensures graceful failures
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🧪 Test Scenarios</Text>
        <Text style={styles.infoText}>
          1. Normal Flow:
          {"\n"}   Initialize SDK → Login → Open Adjoe ✅
          {"\n\n"}
          2. Skip Login:
          {"\n"}   Skip Login → Open Adjoe ⚠️ Error Expected
          {"\n\n"}
          3. Init without Login:
          {"\n"}   Initialize SDK → Skip Login → Open Adjoe ⚠️ Error Expected
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  warningBanner: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  warningText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E65100",
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 14,
    color: "#E65100",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  testButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 22,
  },
  urlInfo: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  urlLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 6,
  },
  urlText: {
    fontSize: 12,
    color: "#424242",
    lineHeight: 18,
    fontFamily: "monospace",
  },
});

export default Adjoe;
