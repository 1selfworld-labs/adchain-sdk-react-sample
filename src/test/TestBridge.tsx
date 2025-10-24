import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

const TestBridge: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testInitialize = async () => {
    try {
      const result = await AdchainSdk.initialize({
        appKey: 'test-app-key',
        appSecret: 'test-app-secret',
        environment: 'PRODUCTION',
        timeout: 30000,
      });
      addResult(`✅ Initialize: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ Initialize failed: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const result = await AdchainSdk.login({
        userId: 'test-user-123',
        gender: 'MALE',
        birthYear: 1990,
        customProperties: {
          region: 'Seoul',
        },
      });
      addResult(`✅ Login: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.message}`);
    }
  };

  const testIsLoggedIn = async () => {
    try {
      const result = await AdchainSdk.isLoggedIn();
      addResult(`✅ IsLoggedIn: ${result}`);
    } catch (error: any) {
      addResult(`❌ IsLoggedIn failed: ${error.message}`);
    }
  };

  const testGetCurrentUser = async () => {
    try {
      const result = await AdchainSdk.getCurrentUser();
      addResult(`✅ GetCurrentUser: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ GetCurrentUser failed: ${error.message}`);
    }
  };

  const testLoadQuizList = async () => {
    try {
      const result = await AdchainSdk.loadQuizList('quiz-unit-1');
      addResult(`✅ LoadQuizList: ${result.events?.length || 0} quizzes loaded`);
    } catch (error: any) {
      addResult(`❌ LoadQuizList failed: ${error.message}`);
    }
  };

  const testLoadMissionList = async () => {
    try {
      const result = await AdchainSdk.loadMissionList('mission-unit-1');
      addResult(`✅ LoadMissionList: ${result.missions.length} missions, ${result.completedCount}/${result.totalCount} completed`);
    } catch (error: any) {
      addResult(`❌ LoadMissionList failed: ${error.message}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>iOS Bridge Test</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="1. Initialize SDK" onPress={testInitialize} />
        <Button title="2. Login" onPress={testLogin} />
        <Button title="3. Check Login Status" onPress={testIsLoggedIn} />
        <Button title="4. Get Current User" onPress={testGetCurrentUser} />
        <Button title="5. Load Quiz List" onPress={testLoadQuizList} />
        <Button title="6. Load Mission List" onPress={testLoadMissionList} />
        <Button title="Clear Results" onPress={clearResults} color="red" />
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultItem}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 10,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 200,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
});

export default TestBridge;