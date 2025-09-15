import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuizItem {
  id?: string;
  imageUrl: string;
  titleText: string;
  rewardsText: string;
  url: string;
  isCompleted?: boolean;
}

interface QuizModuleProps {
  titleText?: string;
  quizItems: QuizItem[];
  networkError: boolean;
  networkError2: boolean;
  onRefresh: () => void;
  loading?: boolean;
  onQuizClick?: (quiz: QuizItem) => void;
  onOpenOfferwall?: () => void;
}

const QuizModule = ({
  titleText = "데일리 1분 퀴즈",
  quizItems,
  networkError,
  networkError2,
  onRefresh,
  loading = false,
  onQuizClick,
  onOpenOfferwall,
}: QuizModuleProps) => {
  const handleQuizPress = (quiz: QuizItem) => {
    if (onQuizClick) {
      onQuizClick(quiz);
    } else {
      Linking.openURL(quiz.url);
    }
  };

  const handleRefreshPress = () => {
    onRefresh();
  };

  const isQuizListExist = quizItems.length > 0;

  const renderContent = () => {
    if (networkError) {
      return (
        <View style={styles.networkErrorContainer}>
          <Text style={styles.networkErrorText}>{"퀴즈를 불러오지 못했어요."}</Text>
          <TouchableOpacity onPress={handleRefreshPress}>
            <Image source={require("../../assets/images/img_mission_refresh.png")} style={styles.refreshButton} />
          </TouchableOpacity>
        </View>
      );
    }

    if (networkError2 || isQuizListExist === false) {
      return (
        <TouchableOpacity style={styles.emptyBanner} onPress={() => onOpenOfferwall && onOpenOfferwall()}>
          <Image source={require("../../assets/images/img_empty_quiz.png")} style={styles.emptyBannerImage} />
        </TouchableOpacity>
      );
    }

    if (isQuizListExist) {
      return quizItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.quizItem, item.isCompleted && styles.quizItemCompleted]}
          onPress={() => handleQuizPress(item)}>
          <Image
            source={{
              uri: item.imageUrl || "https://via.placeholder.com/80x80/FF8000/FFFFFF?text=Quiz",
              headers: {
                "User-Agent": "Mozilla/5.0",
                Referer: "https://www.google.com",
              },
            }}
            style={styles.image}
            onError={(e) => {
              console.log("Image load error:", item.imageUrl, e.nativeEvent.error);
            }}
            defaultSource={{ uri: "https://via.placeholder.com/80x80/FF8000/FFFFFF?text=Quiz" }}
          />
          <View style={styles.rightContent}>
            <Text style={[styles.itemTitleText, item.isCompleted && styles.completedText]}>{item.titleText}</Text>
            <Text style={[styles.itemRewardsText, item.isCompleted && styles.completedRewardsText]}>
              {item.isCompleted ? "완료됨" : item.rewardsText}
            </Text>
          </View>
        </TouchableOpacity>
      ));
    }

    return (
      <TouchableOpacity style={styles.emptyBanner} onPress={() => onOpenOfferwall && onOpenOfferwall()}>
        <Image source={require("../../assets/images/img_empty_quiz.png")} style={styles.emptyBannerImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{titleText}</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  titleText: {
    color: "#292929",
    fontFamily: "Inter-Bold",
    fontSize: 18,
    fontWeight: "bold",
  },
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  rightContent: {
    flex: 1,
    gap: 6,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  itemTitleText: {
    color: "#292929",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  itemRewardsText: {
    color: "#FF8000",
    fontFamily: "Pretendard-Bold",
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyBanner: {
    width: "100%",
    aspectRatio: 327 / 80,
  },
  emptyBannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  networkErrorContainer: {
    width: "100%",
    height: 84,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  networkErrorText: {
    color: "#292929",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  refreshButton: {
    width: 32,
    height: 32,
  },
  quizItemCompleted: {
    opacity: 0.6,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  completedRewardsText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default React.memo(QuizModule);
