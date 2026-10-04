import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StaffDashboardScreen from '../features/staff/presentation/screens/StaffDashboardScreen';
import TodayQueueScreen from '../features/staff/presentation/screens/TodayQueueScreen';
import ServiceHistoryScreen from '../features/staff/presentation/screens/ServiceHistoryScreen';

const Stack = createNativeStackNavigator();

export default function StaffStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="StaffDashboard" component={StaffDashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="TodayQueue" component={TodayQueueScreen} options={{ title: "Today's Queue" }} />
      <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} options={{ title: 'History' }} />
    </Stack.Navigator>
  );
}
