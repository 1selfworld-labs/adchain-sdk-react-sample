import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BenefitsScreen from '../screens/BenefitsScreen';
import AssetsScreen from '../screens/AssetsScreen';
import DeadlineScreen from '../screens/DeadlineScreen';
import Header from '../components/Header';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <View style={{flex: 1}}>
        <Header />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#111827',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e5e7eb',
              borderTopWidth: 1,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: -5,
            },
          }}>
          <Tab.Screen
            name="홈"
            component={HomeScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="검색"
            component={SearchScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="search" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="혜택"
            component={BenefitsScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <View>
                  <Icon name="gift" size={size} color={color} />
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      backgroundColor: '#fb923c',
                      borderRadius: 4,
                    }}
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="내자산"
            component={AssetsScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="credit-card" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="마감"
            component={DeadlineScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="clock" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default AppNavigator;