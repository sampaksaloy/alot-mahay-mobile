import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StaffTabs from './StaffTabs';
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
        headerTintColor: theme.colors.navy,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="StaffTabs"
        component={StaffTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="TodayQueue" component={TodayQueueScreen} options={{ title: "Today's Queue" }} />
      <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} options={{ title: 'Service History' }} />
    </Stack.Navigator>
  );
}

