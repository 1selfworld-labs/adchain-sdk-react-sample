import React from 'react';
import {View, Platform} from 'react-native';

// Mock SafeAreaProvider for Android to avoid build issues
export const SafeAreaProvider = ({children}: {children: React.ReactNode}) => {
  if (Platform.OS === 'android') {
    return <>{children}</>;
  }
  
  try {
    const RealSafeArea = require('react-native-safe-area-context').SafeAreaProvider;
    return <RealSafeArea>{children}</RealSafeArea>;
  } catch (e) {
    return <>{children}</>;
  }
};

export const useSafeAreaInsets = () => {
  if (Platform.OS === 'android') {
    return {top: 0, bottom: 0, left: 0, right: 0};
  }
  
  try {
    const realUseSafeAreaInsets = require('react-native-safe-area-context').useSafeAreaInsets;
    return realUseSafeAreaInsets();
  } catch (e) {
    return {top: 0, bottom: 0, left: 0, right: 0};
  }
};