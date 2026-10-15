import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboardScreen from '../features/admin/presentation/screens/AdminDashboardScreen';
import MonitorQueueScreen from '../features/admin/presentation/screens/MonitorQueueScreen';
import ManageServicesScreen from '../features/admin/presentation/screens/ManageServicesScreen';
import ManageStaffScreen from '../features/admin/presentation/screens/ManageStaffScreen';
import AdminMoreScreen from '../features/admin/presentation/screens/AdminMoreScreen';
import { theme } from '../core/theme/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Queue: { active: 'time', inactive: 'time-outline' },
  Services: { active: 'cut', inactive: 'cut-outline' },
  Staff: { active: 'people', inactive: 'people-outline' },
  More: { active: 'ellipsis-horizontal-circle', inactive: 'ellipsis-horizontal-circle-outline' },
};

export default function AdminTabs() {
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
        component={AdminDashboardScreen}
        options={{ headerShown: false, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Queue"
        component={MonitorQueueScreen}
        options={{ title: 'Queue Monitor', tabBarLabel: 'Queue' }}
      />
      <Tab.Screen
        name="Services"
        component={ManageServicesScreen}
        options={{ title: 'Manage Services', tabBarLabel: 'Services' }}
      />
      <Tab.Screen
        name="Staff"
        component={ManageStaffScreen}
        options={{ title: 'Staff Roster', tabBarLabel: 'Staff' }}
      />
      <Tab.Screen
        name="More"
        component={AdminMoreScreen}
        options={{ title: 'More Menu', tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
}

