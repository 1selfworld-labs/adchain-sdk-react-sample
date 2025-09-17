import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import Storage from "../Storage";

interface LoginFormProps {
  onLogin: (userId: string, gender?: "MALE" | "FEMALE", birthYear?: number) => void;
  isLoading?: boolean;
}

interface LoginData {
  userId: string;
  gender: "MALE" | "FEMALE";
  birthYear: number;
  useOptionalData: boolean;
}

const STORAGE_KEY = "ADCHAIN_LOGIN_DATA";

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [userId, setUserId] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [birthYear, setBirthYear] = useState("1990");
  const [useOptionalData, setUseOptionalData] = useState(false);

  useEffect(() => {
    loadSavedLoginData();
  }, []);

  const loadSavedLoginData = async () => {
    try {
      const savedData = await Storage.getItem(STORAGE_KEY);
      if (savedData) {
        const loginData: LoginData = JSON.parse(savedData);
        setUserId(loginData.userId);
        setGender(loginData.gender);
        setBirthYear(loginData.birthYear.toString());
        setUseOptionalData(loginData.useOptionalData);
        console.log("Loaded saved login data from Storage module:", loginData);
      }
    } catch (error) {
      console.error("Failed to load saved login data:", error);
    }
  };

  const saveLoginData = async (data: LoginData) => {
    try {
      await Storage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("Saved login data to Storage module:", data);
    } catch (error) {
      console.error("Failed to save login data:", error);
    }
  };

  const handleLogin = () => {
    if (!userId.trim()) {
      Alert.alert("오류", "User ID를 입력해주세요.");
      return;
    }

    let year: number | undefined;
    if (useOptionalData) {
      year = parseInt(birthYear, 10);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        Alert.alert("오류", "올바른 출생년도를 입력해주세요.");
        return;
      }
    }

    const loginData: LoginData = {
      userId: userId.trim(),
      gender,
      birthYear: parseInt(birthYear, 10),
      useOptionalData,
    };

    saveLoginData(loginData);
    onLogin(loginData.userId, useOptionalData ? loginData.gender : undefined, useOptionalData ? year : undefined);
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

      <View style={[styles.inputGroup, { paddingTop: 20 }]}>
        <Text style={[styles.label, { width: "50%" }]}>Use Optional Data</Text>
        <Switch
          value={useOptionalData}
          onValueChange={setUseOptionalData}
          disabled={isLoading}
          trackColor={{ false: "#CCC", true: "#007AFF" }}
          thumbColor="#FFF"
        />
      </View>

      <View style={[styles.inputGroup, !useOptionalData && styles.disabledGroup]}>
        <Text style={[styles.label, !useOptionalData && styles.disabledLabel]}>Gender</Text>
        <View style={[styles.genderContainer, !useOptionalData && styles.disabledInput]}>
          <Text style={[styles.genderLabel, !useOptionalData && styles.disabledLabel]}>MALE</Text>
          <Switch
            value={gender === "FEMALE"}
            onValueChange={(value) => setGender(value ? "FEMALE" : "MALE")}
            disabled={isLoading || !useOptionalData}
            trackColor={{ false: "#007AFF", true: "#FF69B4" }}
            thumbColor={gender === "FEMALE" ? "#FFF" : "#FFF"}
          />
          <Text style={[styles.genderLabel, !useOptionalData && styles.disabledLabel]}>FEMALE</Text>
        </View>
      </View>

      <View style={[styles.inputGroup, !useOptionalData && styles.disabledGroup]}>
        <Text style={[styles.label, !useOptionalData && styles.disabledLabel]}>Birth Year</Text>
        <TextInput
          style={[styles.input, !useOptionalData && styles.disabledInput]}
          value={birthYear}
          onChangeText={setBirthYear}
          placeholder="출생년도 (예: 1990)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={4}
          editable={!isLoading && useOptionalData}
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
  disabledGroup: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: "#999",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
});

export default LoginForm;
