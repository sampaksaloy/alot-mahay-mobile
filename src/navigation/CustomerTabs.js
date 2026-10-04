import React from 'react';
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
  Dashboard: 'home',
  Services: 'cut',
  MyQueue: 'time',
  Notifications: 'notifications',
  Profile: 'person',
};

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={CustomerDashboardScreen}
        options={{ title: 'Dashboard' }}
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
        options={{ title: 'Notifications' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}