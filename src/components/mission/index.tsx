import React, { useEffect, useState } from "react";
import { Alert, Animated, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import AdchainSdk, { addMissionCompletedListener, addMissionProgressedListener, addMissionRefreshedListener } from "../../index";
import { MissionItem } from "../../interface/mission";
import MissionModule from "./MissionModule";
import MissionSkeleton from "./MissionSkeleton";

const MISSION_UNIT_ID = "mission_unit_001"; // Mission Unit ID

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

interface MissionCache {
  data: MissionItem[];
  completedCount: number;
  totalCount: number;
  canClaimReward: boolean;
  timestamp: number;
  titleText?: string;
  descriptionText?: string;
  bottomText?: string;
  rewardIconUrl?: string;
  bottomIconUrl?: string;
}

// Global cache store
let missionCache: MissionCache | null = null;

const Mission = () => {
  const [networkError, setNetworkError] = useState(false);
  const [networkError2, setNetworkError2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [missionItems, setMissionItems] = useState<MissionItem[]>([]);
  const [currentMissionStep, setCurrentMissionStep] = useState(0);
  const [maxMissionStep, setMaxMissionStep] = useState(3);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [titleText, setTitleText] = useState("무료 포인트 모으기");
  const [descriptionText, setDescriptionText] = useState("간단 광고 참여하고 100 포인트 받기");
  const [bottomText, setBottomText] = useState("800만 포인트 받으러 가기");
  const [rewardIconUrl, setRewardIconUrl] = useState<string | undefined>();
  const [bottomIconUrl, setBottomIconUrl] = useState<string | undefined>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Cache validation
  const isCacheValid = () => {
    return missionCache && Date.now() - missionCache.timestamp < CACHE_DURATION;
  };

  // Initial load with cache check
  useEffect(() => {
    console.log("🔄 Mission useEffect");
    if (isCacheValid() && missionCache) {
      // Use cached data immediately
      setMissionItems(missionCache.data);
      setCanClaimReward(missionCache.canClaimReward);
      setCurrentMissionStep(missionCache.completedCount);
      setMaxMissionStep(missionCache.totalCount || 3);
      // 캐시에서 신규 필드도 복원
      setTitleText(missionCache.titleText || "무료 포인트 모으기");
      setDescriptionText(missionCache.descriptionText || "간단 광고 참여하고 100 포인트 받기");
      setBottomText(missionCache.bottomText || "800만 포인트 받으러 가기");
      setRewardIconUrl(missionCache.rewardIconUrl);
      setBottomIconUrl(missionCache.bottomIconUrl);
      setLoading(false);
      setShowSkeleton(false);
      fadeAnim.setValue(1);

      // Background refresh if cache is getting old (>2 minutes)
      if (Date.now() - missionCache.timestamp > 2 * 60 * 1000) {
        console.log("🔄 Background refresh if cache is getting old (>2 minutes)");
        loadMissionList(true); // Silent background refresh
      }
    }
    loadMissionList();
  }, []);

  // Toast 헬퍼 함수
  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // iOS는 Alert 사용 (자동으로 사라지는 타이머 추가)
      const alertController = Alert.alert("", message, [], { cancelable: true });

      // 2초 후 자동으로 닫기 (iOS는 프로그래밍적으로 Alert를 닫을 수 없으므로 참고용)
      setTimeout(() => {
        // iOS에서는 Alert를 프로그래밍적으로 닫을 수 없음
        // 사용자가 탭하거나 2초 정도 후 자연스럽게 무시됨
      }, 2000);
    }
  };

  useEffect(() => {
    // 미션 참여 이벤트 리스너 등록
    const subscription = addMissionCompletedListener((event) => {
      console.log("📱 [React Native] Mission completed event received:", event);

      // 해당 unit의 미션인 경우 캐시 무효화 후 새로고침
      if (event.unitId === MISSION_UNIT_ID) {
        console.log("🔄 Invalidating cache and refreshing mission list");

        missionCache = null; // Invalidate cache
        loadMissionList(); // Force refresh
      }
    });

    // cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // 미션 진행 이벤트 리스너 등록
    const subscription = addMissionProgressedListener((event) => {
      console.log("📱 [React Native] Mission progressed event received:", event);
      // 1) 함수형 setState로 최신 상태 기반 갱신
      setMissionItems((prev) => prev.map((item) => (item.id === event.missionId ? { ...item, isInprogress: true } : item)));

      // 2) 캐시까지 동기화(있을 때만)
      if (missionCache?.data) {
        missionCache = {
          ...missionCache,
          data: missionCache.data.map((item) => (item.id === event.missionId ? { ...item, isInprogress: true } : item)),
        };
      }
    });

    // cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // Mission refreshed 이벤트 리스너 (WebView에서 호출됨)
  useEffect(() => {
    const subscription = addMissionRefreshedListener((event) => {
      console.log(`[Mission Component] Mission refreshed event received for unitId: ${event.unitId}`);

      // 이 컴포넌트의 unitId와 일치하거나, unitId가 없는 경우 (전체 새로고침)
      if (!event.unitId || event.unitId === MISSION_UNIT_ID) {
        // 캐시 무효화
        missionCache = null;
        console.log("[Mission Component] Cache cleared due to refresh event");

        // 미션 리스트 즉시 재로드
        loadMissionList();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // SDK에서 미션 리스트 로드 (캐싱 포함)
  const loadMissionList = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true);
        setShowSkeleton(true);
        setNetworkError(false);
        fadeAnim.setValue(0);
      }

      // SDK에서 실제 미션 데이터 로드
      const response: any = await AdchainSdk.loadMissionList(MISSION_UNIT_ID);
      console.log("Mission SDK Response:", JSON.stringify(response, null, 2));

      // 신규 필드 저장 (캐시에도 포함)
      const titleText = response.titleText || "무료 포인트 모으기!";
      const descriptionText = response.descriptionText || "간단 광고 참여하고 100 포인트 받기";
      const bottomText = response.bottomText || "800만 포인트 받으러 가기";
      const rewardIconUrl = response.rewardIconUrl;
      const bottomIconUrl = response.bottomIconUrl;

      // SDK 데이터를 UI 형식으로 변환
      const transformedMissionList: MissionItem[] = response.missions.map((mission: any) => ({
        id: mission.id,
        imageUrl: mission.imageUrl || "https://via.placeholder.com/240",
        brandText: mission.description || "미션",
        titleText: mission.title,
        rewardsText: mission.point || "0 포인트", // point 필드 사용
        url: mission.actionUrl || `https://mission.adchain.com/${mission.id}`,
        isCompleted: mission.isCompleted,
        isInprogress: mission.isInprogress || false,
        type: mission.type,
      }));

      // Update cache (신규 필드 포함)
      missionCache = {
        data: transformedMissionList,
        completedCount: response.completedCount,
        totalCount: response.totalCount,
        canClaimReward: response.canClaimReward,
        timestamp: Date.now(),
        titleText: titleText,
        descriptionText: descriptionText,
        bottomText: bottomText,
        rewardIconUrl: rewardIconUrl,
        bottomIconUrl: bottomIconUrl,
      };

      // Update UI (신규 필드 포함)
      setMissionItems(transformedMissionList);
      setCanClaimReward(response.canClaimReward);
      setCurrentMissionStep(response.completedCount);
      setMaxMissionStep(response.totalCount || 3);
      setTitleText(titleText);
      setDescriptionText(descriptionText);
      setBottomText(bottomText);
      setRewardIconUrl(rewardIconUrl);
      setBottomIconUrl(bottomIconUrl);

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
      console.error("Mission load error:", error);
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

  // 미션 클릭 처리
  const handleMissionClick = async (mission: MissionItem) => {
    try {
      if (mission.id) {
        // SDK를 통해 미션 클릭 이벤트 전송
        const result = await AdchainSdk.clickMission(MISSION_UNIT_ID, mission.id);
        console.log("Mission clicked:", result);

        // 이벤트 리스너가 자동으로 처리하므로 여기서는 새로고침 하지 않음
        // loadMissionList()는 이벤트 리스너에서 처리됨
      }
    } catch (error) {
      console.error("Mission click error:", error);
    }
  };

  // 보상 받기 처리
  const handleClaimReward = async () => {
    try {
      const result = await AdchainSdk.claimReward(MISSION_UNIT_ID);
      console.log("Reward claimed:", result);

      if (result.success) {
        loadMissionList();
      }
    } catch (error) {
      console.error("Claim reward error:", error);
    }
  };

  // Offerwall 열기
  const handleOpenOfferwall = async () => {
    try {
      const result = await AdchainSdk.openOfferwall("test1");
      console.log("Offerwall opened:", result);
    } catch (error) {
      console.error("Offerwall error:", error);
    }
  };

  const handleRefresh = () => {
    missionCache = null; // Invalidate cache on manual refresh
    setNetworkError(false);
    setNetworkError2(false);
    loadMissionList();
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

      {/* 미션 모듈 */}
      <View style={styles.missionModuleContainer}>
        {showSkeleton ? (
          <MissionSkeleton count={3} />
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <MissionModule
              titleText={titleText}
              missionList={missionItems.slice(0, 3)}
              description={descriptionText}
              bottomText={bottomText}
              rewardIconUrl={rewardIconUrl}
              bottomIconUrl={bottomIconUrl}
              maxMissionStep={maxMissionStep}
              currentMissionStep={currentMissionStep}
              missionColor={"#FF9500"}
              ctaColor={"#046BD5"}
              networkError={networkError}
              networkError2={networkError2}
              onRefresh={handleRefresh}
              loading={loading}
              onMissionClick={handleMissionClick}
              onClaimReward={handleClaimReward}
              onOpenOfferwall={handleOpenOfferwall}
              canClaimReward={canClaimReward}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  missionModuleContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
  },
  controlsContainer: {
    backgroundColor: "#FFF",
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

export default Mission;
