import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StaffDashboardScreen from '../features/staff/presentation/screens/StaffDashboardScreen';
import TodayQueueScreen from '../features/staff/presentation/screens/TodayQueueScreen';
import ServiceHistoryScreen from '../features/staff/presentation/screens/ServiceHistoryScreen';

import { theme } from '../core/theme/theme';

const Stack = createNativeStackNavigator();

export default function StaffStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="StaffDashboard" component={StaffDashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="TodayQueue" component={TodayQueueScreen} options={{ title: "Today's Queue" }} />
      <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} options={{ title: 'History' }} />
    </Stack.Navigator>
  );
}
