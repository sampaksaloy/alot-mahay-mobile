import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CustomerDashboardScreen from '../features/customer/presentation/screens/CustomerDashboardScreen';
import ServiceListScreen from '../features/services/presentation/screens/ServiceListScreen';
import QueueTrackingScreen from '../features/queue/presentation/screens/QueueTrackingScreen';
import NotificationsScreen from '../features/notifications/presentation/screens/NotificationsScreen';
import ProfileScreen from '../features/customer/presentation/screens/ProfileScreen';
import { theme } from '../core/theme/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Services: { active: 'cut', inactive: 'cut-outline' },
  MyQueue: { active: 'time', inactive: 'time-outline' },
  Notifications: { active: 'notifications', inactive: 'notifications-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.navy,
          elevation: 2,
        },
        headerTitleStyle: {
          color: theme.colors.navy,
          fontWeight: '700',
        },
        tabBarActiveTintColor: theme.colors.royalBlue,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 72,
          paddingBottom: Platform.OS === 'ios' ? 24 : 14,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, focused, size }) => {
          const iconPair = ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
          const iconName = focused ? iconPair.active : iconPair.inactive;
          return <Ionicons name={iconName} color={color} size={22} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={CustomerDashboardScreen}
        options={{ headerShown: false, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Services"
        component={ServiceListScreen}
        options={{ title: 'Services' }}
      />
      <Tab.Screen
        name="MyQueue"
        component={QueueTrackingScreen}
        options={{ title: 'My Queue' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}