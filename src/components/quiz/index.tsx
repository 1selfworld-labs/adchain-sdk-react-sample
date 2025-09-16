import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdchainSdk, { addQuizCompletedListener } from "../../index";
import Banner from "../banner";
import QuizModule from "./QuizModule";
import QuizSkeleton from "./QuizSkeleton";

// SDK Quiz 타입
interface SdkQuizItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  point: string; // "1포인트" 형태로 오는 문자열
  isCompleted: boolean;
}

// UI Quiz 타입
interface QuizItem {
  id?: string;
  imageUrl: string;
  titleText: string;
  rewardsText: string;
  url: string;
  isCompleted?: boolean;
}

const QUIZ_UNIT_ID = "quiz_unit_001"; // Quiz Unit ID

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

interface QuizCache {
  data: QuizItem[];
  timestamp: number;
}

// Global cache store
let quizCache: QuizCache | null = null;

interface IProps {
  isLoggedIn: boolean;
}

const Quiz = ({ isLoggedIn }: IProps) => {
  const [networkError, setNetworkError] = useState(false);
  const [networkError2, setNetworkError2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Cache validation
  const isCacheValid = () => {
    return quizCache && Date.now() - quizCache.timestamp < CACHE_DURATION;
  };

  // Initial load with cache check
  useEffect(() => {
    if (isCacheValid() && quizCache) {
      // Use cached data immediately
      setQuizItems(quizCache.data);
      setLoading(false);
      setShowSkeleton(false);
      fadeAnim.setValue(1);

      // Background refresh if cache is getting old (>2 minutes)
      if (Date.now() - quizCache.timestamp > 2 * 60 * 1000) {
        loadQuizList(true); // Silent background refresh
      }
    }
    loadQuizList();
  }, []);

  useEffect(() => {
    // 퀴즈 완료 이벤트 리스너 등록
    const subscription = addQuizCompletedListener((event) => {
      console.log("📱 [React Native] Quiz completed event received:", event);

      // 해당 unit의 퀴즈인 경우 캐시 무효화 후 새로고침
      if (event.unitId === QUIZ_UNIT_ID) {
        console.log("🔄 Invalidating cache and refreshing quiz list");
        quizCache = null; // Invalidate cache
        loadQuizList(); // Force refresh
      }
    });

    // cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // SDK에서 퀴즈 리스트 로드 (캐싱 포함)
  const loadQuizList = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true);
        setShowSkeleton(true);
        setNetworkError(false);
        fadeAnim.setValue(0);
      }

      // SDK에서 실제 퀴즈 데이터 로드
      const sdkQuizList: any[] = await AdchainSdk.loadQuizList(QUIZ_UNIT_ID);

      // 디버깅: SDK 응답 확인
      console.log("SDK Quiz Response:", JSON.stringify(sdkQuizList, null, 2));

      // SDK 데이터를 UI 형식으로 변환
      const transformedQuizList: QuizItem[] = sdkQuizList.map((quiz: any) => {
        console.log("Quiz item:", quiz);
        return {
          id: quiz.id,
          imageUrl: quiz.imageUrl || "https://via.placeholder.com/240",
          titleText: quiz.title,
          rewardsText: quiz.point || "0 포인트", // point 필드 그대로 사용
          url: `https://quiz.adchain.com/${quiz.id}`, // 실제 URL은 SDK에서 제공될 예정
          isCompleted: quiz.isCompleted,
        };
      });

      // Update cache
      quizCache = {
        data: transformedQuizList,
        timestamp: Date.now(),
      };

      // Update UI
      setQuizItems(transformedQuizList);

      if (!isBackgroundRefresh) {
        // Smooth fade in animation
        setShowSkeleton(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error("Quiz load error:", error);
      setNetworkError(true);

      if (!isBackgroundRefresh) {
        setShowSkeleton(false);
        fadeAnim.setValue(1);
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      }
    }
  };

  // 퀴즈 클릭 처리
  const handleQuizClick = async (quiz: QuizItem) => {
    try {
      if (quiz.id) {
        // SDK를 통해 퀴즈 클릭 이벤트 전송
        const result = await AdchainSdk.clickQuiz(QUIZ_UNIT_ID, quiz.id);
        console.log("Quiz clicked:", result);

        // 이벤트 리스너가 자동으로 처리하므로 여기서는 새로고침 하지 않음
        // loadQuizList()는 이벤트 리스너에서 처리됨
      }
    } catch (error) {
      console.error("Quiz click error:", error);
    }
  };

  // Offerwall 열기
  const handleOpenOfferwall = async () => {
    try {
      const result = await AdchainSdk.openOfferwall();
      console.log("Offerwall opened:", result);
    } catch (error) {
      console.error("Offerwall error:", error);
    }
  };

  const handleRefresh = () => {
    quizCache = null; // Invalidate cache on manual refresh
    loadQuizList();
  };

  return (
    <View>
      {/* 개발자 컨트롤 패널 - jun 샘플과 동일 */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Network Error:</Text>
          <TouchableOpacity
            style={[styles.toggleButton, networkError ? styles.toggleActive : styles.toggleInactive]}
            onPress={() => setNetworkError(!networkError)}>
            <Text style={styles.toggleText}>{networkError ? "ON" : "OFF"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Network Error #2:</Text>
          <TouchableOpacity
            style={[styles.toggleButton, networkError2 ? styles.toggleActive : styles.toggleInactive]}
            onPress={() => setNetworkError2(!networkError2)}>
            <Text style={styles.toggleText}>{networkError2 ? "ON" : "OFF"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 퀴즈 모듈 */}
      <View style={styles.quizModuleContainer}>
        {showSkeleton ? (
          <QuizSkeleton count={2} />
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <QuizModule
              titleText="데일리 1분 퀴즈"
              quizItems={quizItems}
              networkError={networkError}
              networkError2={networkError2}
              onRefresh={handleRefresh}
              loading={loading}
              onQuizClick={handleQuizClick}
              onOpenOfferwall={handleOpenOfferwall}
            />
          </Animated.View>
        )}
        {isLoggedIn && <Banner imageUrl={""} onOpenBanner={handleOpenOfferwall} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quizModuleContainer: {
    paddingVertical: 20,
    gap: 50,
  },
  controlsContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  toggleButton: {
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#007AFF",
  },
  toggleInactive: {
    backgroundColor: "#E0E0E0",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  countButton: {
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default Quiz;
