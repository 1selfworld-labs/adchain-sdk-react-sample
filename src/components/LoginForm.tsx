import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

interface LoginFormProps {
  onLogin: (userId: string, gender: "MALE" | "FEMALE", birthYear: number) => void;
  isLoading?: boolean;
}

interface LoginData {
  userId: string;
  gender: "MALE" | "FEMALE";
  birthYear: number;
}

const STORAGE_KEY = "ADCHAIN_LOGIN_DATA";

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [userId, setUserId] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [birthYear, setBirthYear] = useState("1990");

  useEffect(() => {
    loadSavedLoginData();
  }, []);

  const loadSavedLoginData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const loginData: LoginData = JSON.parse(savedData);
        setUserId(loginData.userId);
        setGender(loginData.gender);
        setBirthYear(loginData.birthYear.toString());
      }
    } catch (error) {
      console.error("Failed to load saved login data:", error);
    }
  };

  const saveLoginData = async (data: LoginData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save login data:", error);
    }
  };

  const handleLogin = () => {
    if (!userId.trim()) {
      Alert.alert("오류", "User ID를 입력해주세요.");
      return;
    }

    const year = parseInt(birthYear, 10);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      Alert.alert("오류", "올바른 출생년도를 입력해주세요.");
      return;
    }

    const loginData: LoginData = {
      userId: userId.trim(),
      gender,
      birthYear: year,
    };

    saveLoginData(loginData);
    onLogin(loginData.userId, loginData.gender, loginData.birthYear);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdChain SDK 로그인</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>User ID</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="사용자 ID를 입력하세요"
          placeholderTextColor="#999"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>MALE</Text>
          <Switch
            value={gender === "FEMALE"}
            onValueChange={(value) => setGender(value ? "FEMALE" : "MALE")}
            disabled={isLoading}
            trackColor={{ false: "#007AFF", true: "#FF69B4" }}
            thumbColor={gender === "FEMALE" ? "#FFF" : "#FFF"}
          />
          <Text style={styles.genderLabel}>FEMALE</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birth Year</Text>
        <TextInput
          style={styles.input}
          value={birthYear}
          onChangeText={setBirthYear}
          placeholder="출생년도 (예: 1990)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={4}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>로그인</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    width: "30%",
    fontWeight: "600",
    color: "#666",
  },
  input: {
    width: "70%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  genderContainer: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: "#CCC",
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoginForm;
