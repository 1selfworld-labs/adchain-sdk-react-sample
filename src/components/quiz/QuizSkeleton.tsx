import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

interface QuizSkeletonProps {
  count?: number;
}

const QuizSkeleton = ({count = 2}: QuizSkeletonProps) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = () => {
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmerAnimation());
    };

    shimmerAnimation();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.skeletonTitle} />
      {Array.from({length: count}, (_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <Animated.View
            style={[
              styles.skeletonImage,
              {opacity: shimmerOpacity},
            ]}
          />
          <View style={styles.skeletonContent}>
            <Animated.View
              style={[
                styles.skeletonTitleText,
                {opacity: shimmerOpacity},
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonRewardText,
                {opacity: shimmerOpacity},
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  skeletonTitle: {
    width: '60%',
    height: 22,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonTitleText: {
    width: '80%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonRewardText: {
    width: '50%',
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});

export default QuizSkeleton;