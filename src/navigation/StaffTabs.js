import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import StaffDashboardScreen from '../features/staff/presentation/screens/StaffDashboardScreen';
import TodayQueueScreen from '../features/staff/presentation/screens/TodayQueueScreen';
import ServiceHistoryScreen from '../features/staff/presentation/screens/ServiceHistoryScreen';
import NotificationsScreen from '../features/notifications/presentation/screens/NotificationsScreen';
import ProfileScreen from '../features/customer/presentation/screens/ProfileScreen';
import { theme } from '../core/theme/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Queue: { active: 'time', inactive: 'time-outline' },
  History: { active: 'clipboard', inactive: 'clipboard-outline' },
  Alerts: { active: 'notifications', inactive: 'notifications-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export default function StaffTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: theme.colors.navy,
          elevation: 2,
        },
        headerTitleStyle: {
          color: theme.colors.navy,
          fontWeight: '700',
        },
        tabBarActiveTintColor: theme.colors.royalBlue,
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 74 : 84,
          paddingBottom: Platform.OS === 'android' ? 14 : 24,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, focused }) => {
          const iconPair = ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
          const iconName = focused ? iconPair.active : iconPair.inactive;
          return <Ionicons name={iconName} color={color} size={22} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={StaffDashboardScreen}
        options={{ headerShown: false, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Queue"
        component={TodayQueueScreen}
        options={{ title: "Today's Queue", tabBarLabel: 'Queue' }}
      />
      <Tab.Screen
        name="History"
        component={ServiceHistoryScreen}
        options={{ title: 'Service History', tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="Alerts"
        component={NotificationsScreen}
        options={{ title: 'Alerts', tabBarLabel: 'Alerts' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Staff Profile', tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

