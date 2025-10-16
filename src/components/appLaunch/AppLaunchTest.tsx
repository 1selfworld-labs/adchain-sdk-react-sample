import React, { useState } from "react";
import { Alert, Clipboard, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AdchainSdk from "../../index";

interface AppLaunchTestProps {
  isSkipMode?: boolean;
}

const AppLaunchTest: React.FC<AppLaunchTestProps> = ({ isSkipMode = false }) => {
  const [identifier, setIdentifier] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");

  const handleAddTestButton = async () => {
    if (!identifier.trim()) {
      Alert.alert(
        "입력 오류",
        Platform.OS === "android"
          ? "패키지명을 입력하세요 (예: com.instagram.android)"
          : "URL Scheme을 입력하세요 (예: instagram://)",
        [{ text: "OK" }]
      );
      return;
    }

    // 테스트 코드 생성
    const testCode = `window.AdchainBridge.checkAppInstalled('${identifier}');
window.onAppInstalledResult = function(result) { alert('설치: ' + result.installed + '\\n식별자: ' + result.identifier); };`;

    // 클립보드에 복사
    Clipboard.setString(testCode);

    // 안내 다이얼로그
    Alert.alert(
      "앱 실행 테스트 방법",
      `테스트 코드가 클립보드에 복사되었습니다!

테스트 방법:
1. "Offerwall 열기" 버튼을 눌러 Offerwall를 엽니다
2. ${Platform.OS === "android" ? "Chrome DevTools" : "Safari Web Inspector"}로 콘솔을 엽니다
3. 복사된 코드를 콘솔에 붙여넣고 실행합니다

테스트 ${Platform.OS === "android" ? "패키지" : "URL Scheme"}: ${identifier}`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "Offerwall 열기",
          onPress: handleOpenOfferwall,
        },
      ]
    );
  };

  const handleOpenOfferwall = async () => {
    try {
      setTestResult("Opening Offerwall for app launch test...");
      console.log("Opening Offerwall for app launch test");

      await AdchainSdk.openOfferwall("app_launch_test");

      setTestResult("✅ Offerwall opened - paste test code in console");
      Alert.alert("안내", "콘솔에서 테스트 코드를 실행하세요");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Offerwall error:", errorMessage);
      setTestResult(`❌ Error: ${errorMessage}`);

      Alert.alert("Offerwall Error", errorMessage, [{ text: "OK" }]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Launch Test</Text>
        <Text style={styles.subtitle}>
          Test app installation check and launch functionality
        </Text>
      </View>

      {isSkipMode && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ Test Mode Active</Text>
          <Text style={styles.warningSubtext}>
            SDK not initialized - Testing graceful error handling
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test App Launch</Text>
        <Text style={styles.sectionDescription}>
          Enter a {Platform.OS === "android" ? "package name" : "URL scheme"} to test if the app is installed and can be launched.
        </Text>

        <TextInput
          style={styles.input}
          placeholder={
            Platform.OS === "android"
              ? "Package Name (e.g., com.instagram.android)"
              : "URL Scheme (e.g., instagram://)"
          }
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.testButton} onPress={handleAddTestButton}>
          <Text style={styles.testButtonText}>Add Test Button to Offerwall</Text>
        </TouchableOpacity>

        {testResult !== "" && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Test Result:</Text>
            <Text style={styles.resultText}>{testResult}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📝 How It Works</Text>
        <Text style={styles.infoText}>
          • Enter app identifier ({Platform.OS === "android" ? "package name" : "URL scheme"})
          {"\n"}• Test code is copied to clipboard
          {"\n"}• Open Offerwall WebView
          {"\n"}• Paste code in {Platform.OS === "android" ? "Chrome DevTools" : "Safari Web Inspector"} console
          {"\n"}• JavaScript Bridge checks app and attempts launch
          {"\n"}• Result shown via JavaScript alert
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🧪 Test Examples</Text>
        <Text style={styles.infoText}>
          {Platform.OS === "android"
            ? `Android Package Names:
• com.instagram.android (Instagram)
• com.kakao.talk (KakaoTalk)
• com.nhn.android.search (Naver)
• com.spotify.music (Spotify)`
            : `iOS URL Schemes:
• instagram:// (Instagram)
• kakaotalk:// (KakaoTalk)
• naversearchapp:// (Naver)
• spotify:// (Spotify)`}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🔧 Debugging</Text>
        <Text style={styles.infoText}>
          {Platform.OS === "android"
            ? `Chrome DevTools:
1. Enable USB debugging on device
2. Open chrome://inspect in Chrome
3. Find WebView and click "inspect"
4. Paste test code in Console tab`
            : `Safari Web Inspector:
1. Enable Web Inspector in Settings → Safari → Advanced
2. Connect device to Mac
3. Open Safari → Develop → [Device] → [WebView]
4. Paste test code in Console tab`}
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
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  testButton: {
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 22,
  },
});

export default AppLaunchTest;
