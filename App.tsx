/**
 * AdChain SDK Sample App with Quiz and Mission
 */

import type {PropsWithChildren} from 'react';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import TabNavigation from './src/components/TabNavigation';

// SDK import
import AdchainSdk from './src/index';

// SDK 환경 설정
const SDK_CONFIG = {
  android: {
    APP_ID: '100000001',
    APP_SECRET: 'gjFs586lLuUweJRN',
  },
  ios: {
    APP_KEY: '100000002', 
    APP_SECRET: '3ANgfF9Zfbm79oa6',
  }
};

function App(): React.JSX.Element {
  const isDarkMode = false; // 항상 라이트 모드 사용
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

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
          appKey: SDK_CONFIG.android.APP_ID,
          appSecret: SDK_CONFIG.android.APP_SECRET,
          environment: 'PRODUCTION' as const
        },
        ios: {
          appKey: SDK_CONFIG.ios.APP_KEY,
          appSecret: SDK_CONFIG.ios.APP_SECRET,
          environment: 'PRODUCTION' as const
        },
        default: {
          appKey: 'test-app',
          appSecret: 'test-secret',
          environment: 'PRODUCTION' as const
        }
      });
      
      // SDK 초기화
      await AdchainSdk.initialize(sdkConfig);
      console.log(`AdchainSDK initialized for ${Platform.OS}`);

      // SDK 초기화 완료를 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 자동 로그인 처리
      const userId = 'test_user_' + Math.random().toString(36).substr(2, 9);
      const loggedIn = await AdchainSdk.isLoggedIn();
      
      if (!loggedIn) {
        await AdchainSdk.login({
          userId: userId,
          gender: 'MALE',
          birthYear: 1990
        });
        console.log('AdchainSDK logged in with userId:', userId);
      }
      
      setSdkInitialized(true);
    } catch (error) {
      console.error('AdchainSDK initialization error:', error);
      setSdkError(error?.message || 'SDK 초기화 실패');
      // UI는 계속 표시하되, SDK 기능은 비활성화
      setSdkInitialized(true);
    }
  };

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
        barStyle={'dark-content'} // 항상 어두운 아이콘 (흰 배경용)
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          {sdkError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {sdkError}</Text>
            </View>
          )}
          <TabNavigation />
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
    height: '100%',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;