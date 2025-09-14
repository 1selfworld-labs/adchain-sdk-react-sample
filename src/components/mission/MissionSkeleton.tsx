import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

interface MissionSkeletonProps {
  count?: number;
}

const MissionSkeleton = ({count = 3}: MissionSkeletonProps) => {
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
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.titleBox}>
          <View style={styles.titleWrapper}>
            <Animated.View
              style={[
                styles.skeletonTitle,
                {opacity: shimmerOpacity},
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonRefreshButton,
                {opacity: shimmerOpacity},
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.skeletonDescription,
              {opacity: shimmerOpacity},
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.skeletonRewardCoin,
            {opacity: shimmerOpacity},
          ]}
        />
      </View>

      {/* Step progress */}
      <View style={styles.stepBox}>
        {Array.from({length: 3}, (_, index) => (
          <React.Fragment key={index}>
            <Animated.View
              style={[
                styles.stepCircle,
                {opacity: shimmerOpacity},
              ]}
            />
            {index < 2 && (
              <Animated.View
                style={[
                  styles.stepLine,
                  {opacity: shimmerOpacity},
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Mission list */}
      <View style={styles.divider} />
      <View style={styles.missionListBox}>
        {Array.from({length: count}, (_, index) => (
          <View key={index} style={styles.missionItem}>
            <Animated.View
              style={[
                styles.skeletonImage,
                {opacity: shimmerOpacity},
              ]}
            />
            <View style={styles.missionContent}>
              <Animated.View
                style={[
                  styles.skeletonBrandText,
                  {opacity: shimmerOpacity},
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonTitleText,
                  {opacity: shimmerOpacity},
                ]}
              />
            </View>
            <Animated.View
              style={[
                styles.skeletonCtaButton,
                {opacity: shimmerOpacity},
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.divider} />
      {/* CTA Button */}
      <Animated.View
        style={[
          styles.skeletonCtaButtonLarge,
          {opacity: shimmerOpacity},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 20,
  },
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
    gap: 4,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skeletonTitle: {
    width: '40%',
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonRefreshButton: {
    width: 24,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
  skeletonDescription: {
    width: '60%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonRewardCoin: {
    width: 47,
    height: 70,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  stepLine: {
    height: 5,
    borderRadius: 99,
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F2F3F5',
  },
  missionListBox: {
    gap: 20,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  skeletonImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  missionContent: {
    flex: 1,
    gap: 6,
  },
  skeletonBrandText: {
    width: '30%',
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonTitleText: {
    width: '70%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonCtaButton: {
    width: 70,
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  skeletonCtaButtonLarge: {
    width: '100%',
    height: 55,
    backgroundColor: '#E0E0E0',
    borderRadius: 14,
  },
});

export default MissionSkeleton;