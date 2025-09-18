import React, { Fragment, useEffect, useRef } from "react";
import { Animated, Easing, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MissionItem } from "../../interface/mission";

interface MissionModuleProps {
  titleText?: string;
  description?: string;
  currentMissionStep?: number;
  maxMissionStep?: number;
  missionList?: MissionItem[];
  missionStep?: number;
  missionColor?: string;
  ctaColor?: string;
  networkError: boolean;
  networkError2?: boolean;
  onRefresh: () => void;
  loading?: boolean;
  onMissionClick?: (mission: MissionItem) => void;
  onClaimReward?: () => void;
  onOpenOfferwall: () => void;
  canClaimReward?: boolean;
}

const MissionModule = ({
  titleText = "무료 포인트 모기",
  description = "간단 광고 참여하고 100 포인트 받기",
  currentMissionStep,
  maxMissionStep,
  missionList,
  missionStep,
  missionColor = "#FF8000",
  ctaColor = "#FF8000",
  networkError,
  networkError2 = false,
  onRefresh,
  loading = false,
  onMissionClick,
  onClaimReward,
  onOpenOfferwall,
  canClaimReward = false,
}: MissionModuleProps) => {
  const floatingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const upDown = Animated.sequence([
      Animated.timing(floatingAnimation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(floatingAnimation, {
        toValue: 0,
        duration: 1200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const loopAnim = Animated.loop(upDown);
    loopAnim && loopAnim.start && loopAnim.start();

    return () => {
      loopAnim && loopAnim.stop && loopAnim.stop();
    };
  }, [floatingAnimation]);

  // Use missionItems if provided, otherwise fall back to missionList
  const missions = missionList || [];
  const currentStep = missionStep ?? currentMissionStep ?? 0;
  const maxStep = maxMissionStep || 3;

  const handleMissionPress = (mission: MissionItem | string) => {
    if (typeof mission === "string") {
      Linking.openURL(mission);
    } else if (onMissionClick) {
      if (mission.isCompleted) return;
      onMissionClick(mission);
    } else {
      Linking.openURL(mission.url);
    }
  };

  const handleRefreshPress = () => {
    onRefresh();
  };

  const isMissionListExist = missions.length > 0;
  const isCompletedMission = canClaimReward || currentStep > maxStep;

  const renderStepItem = (stepIndex: number) => {
    const isCompleted = stepIndex < currentStep;
    return (
      <React.Fragment key={stepIndex}>
        <View style={[styles.stepCircle, isCompleted ? { backgroundColor: missionColor } : styles.stepCircleInactive]}>
          <Image source={require("../../assets/images/img_mission_check.png")} style={styles.stepCheckIcon} />
        </View>
        {stepIndex < maxStep - 1 && (
          <View style={[styles.stepLine, isCompleted ? { backgroundColor: missionColor } : styles.stepLineInactive]} />
        )}
      </React.Fragment>
    );
  };

  const renderCtaButton = () => {
    if (isCompletedMission) {
      return (
        <TouchableOpacity onPress={() => (onClaimReward ? onClaimReward() : onOpenOfferwall())}>
          <View style={[styles.completedMissionCtaButton, { backgroundColor: ctaColor }]}>
            <Text style={styles.completedMissionCtaButtonText}>{"보상 받기"}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (networkError) {
      return (
        <View style={styles.offerwallButton}>
          <View style={styles.offerwallBButtonTextWrapper}>
            <Text style={styles.emptyMissionText}>{"미션을 불러오지 못했어요."}</Text>
            <TouchableOpacity onPress={handleRefreshPress}>
              <Image
                source={require("../../assets/images/img_mission_refresh.png")}
                style={[styles.refreshButton, { width: 32, height: 32, marginLeft: 16 }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (isMissionListExist === false || networkError2) {
      return (
        <TouchableOpacity onPress={() => onOpenOfferwall()}>
          <View style={styles.offerwallButton}>
            <View style={styles.offerwallBButtonTextWrapper}>
              <Image
                source={require("../../assets/images/img_offerwall_coin.png")}
                style={[styles.offerwallButtonCoinIcon, { width: 56, height: 56, marginRight: 12 }]}
              />
              <Text style={[styles.offerwallButtonText, { flex: 1 }]}>{"800만 포인트를\n지금 바로 받아보세요. "}</Text>
              <Image
                source={require("../../assets/images/img_offerwall_right_arrow.png")}
                style={styles.offerwallButtonArrowIcon}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={() => onOpenOfferwall()}>
        <View style={styles.offerwallButton}>
          <View style={styles.offerwallBButtonTextWrapper}>
            <Image source={require("../../assets/images/img_offerwall_coin.png")} style={styles.offerwallButtonCoinIcon} />
            <Text style={styles.offerwallButtonText}>{"800만 포인트 받으러 가기"}</Text>
            <Image
              source={require("../../assets/images/img_offerwall_right_arrow.png")}
              style={styles.offerwallButtonArrowIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <View style={styles.titleBox}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{titleText}</Text>
          </View>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <TouchableOpacity onPress={() => onOpenOfferwall()}>
          <View style={styles.rewardCoinBox}>
            <Image source={require("../../assets/images/img_reward_coin.png")} style={styles.rewardCoinIcon} />
            <Animated.Image
              source={require("../../assets/images/img_reward_floating_text.png")}
              style={[
                styles.rewardFloatingText,
                {
                  transform: [
                    { translateX: -19.5 },
                    {
                      translateY: floatingAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [-2, 2, -2],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.stepBox}>{Array.from({ length: maxStep }, (_, index) => renderStepItem(index))}</View>
      {isMissionListExist && !isCompletedMission && !networkError && !networkError2 && (
        <Fragment>
          <View style={styles.divider} />

          <View style={styles.missionListBox}>
            {missions.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleMissionPress(item)} disabled={item.isCompleted}>
                <View style={[styles.missionItem, item.isCompleted && styles.missionItemCompleted]}>
                  <Image
                    source={{
                      uri: item.imageUrl || "https://via.placeholder.com/52x52/FF9500/FFFFFF?text=M",
                      headers: {
                        "User-Agent": "Mozilla/5.0",
                        Referer: "https://www.google.com",
                      },
                    }}
                    style={styles.missionImage}
                    onError={(e) => {
                      console.log("Mission image error:", item.imageUrl);
                    }}
                    defaultSource={{ uri: "https://via.placeholder.com/52x52/FF9500/FFFFFF?text=M" }}
                  />
                  <View style={styles.missionContent}>
                    <Text style={styles.brandText}>{item.brandText}</Text>
                    <Text style={[styles.missionTitleText, item.isCompleted && styles.completedText]}>{item.titleText}</Text>
                  </View>
                  <View style={[styles.ctaButton, { backgroundColor: item.isCompleted ? "#CED5E0" : ctaColor }]}>
                    <Text style={[styles.ctaButtonText, { color: "#FFFFFF" }]}>
                      {item.isInprogress ? "참여 확인 중" : item.isCompleted ? "완료" : item.rewardsText}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Fragment>
      )}

      <View style={styles.divider} />
      {renderCtaButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
  },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleBox: {
    width: "100%",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  titleText: {
    color: "#26282B",
    fontFamily: "SUIT-Bold",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -0.4,
  },
  descriptionText: {
    color: "#73787E",
    fontFamily: "SUIT-Medium",
    fontSize: 14,
    fontWeight: "500",
  },
  rewardCoinBox: {
    position: "relative",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  rewardFloatingText: {
    width: 39,
    height: 25,
    position: "absolute",
    top: -23,
    left: "50%",
  },
  rewardCoinIcon: {
    width: 47,
    height: 47,
  },
  stepBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleInactive: {
    backgroundColor: "#E0E0E0",
  },
  stepCheckIcon: {
    width: 20,
    height: 14,
  },
  stepLine: {
    height: 5,
    borderRadius: 99,
    flex: 1,
  },
  stepLineInactive: {
    backgroundColor: "#E0E0E0",
  },
  missionListBox: {
    gap: 20,
  },
  missionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  missionImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  missionContent: {
    flex: 1,
    gap: 4,
  },
  brandText: {
    color: "#73787E",
    fontFamily: "SUIT-Medium",
    fontSize: 14,
    fontWeight: "500",
  },
  missionTitleText: {
    color: "#1B1D1F",
    fontFamily: "SUIT-SemiBold",
    fontSize: 14,
    fontWeight: "bold",
  },
  ctaButton: {
    minWidth: 90,
    paddingVertical: 8,
    paddingHorizontal: 9,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  ctaButtonText: {
    fontFamily: "SUIT-Bold",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F2F3F5",
  },
  offerwallButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  offerwallBButtonTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  offerwallButtonText: {
    color: "#292929",
    fontFamily: "SUIT-SemiBold",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "bold",
  },
  offerwallButtonArrowIcon: {
    width: 24,
    height: 24,
  },
  offerwallButtonCoinIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  emptyMissionText: {
    color: "#73787E",
    fontFamily: "Pretendard",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 17,
  },
  completedMissionCtaButton: {
    width: "100%",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  completedMissionCtaButtonText: {
    color: "#FFFFFF",
    fontFamily: "Pretendard",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  missionItemCompleted: {
    opacity: 0.6,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});

export default React.memo(MissionModule);
