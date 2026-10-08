import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerTabs from './CustomerTabs';
import JoinQueueScreen from '../features/queue/presentation/screens/JoinQueueScreen';
import QueueHistoryScreen from '../features/queue/presentation/screens/QueueHistoryScreen';
import RateServiceScreen from '../features/ratings/presentation/screens/RateServiceScreen';

import { theme } from '../core/theme/theme';

const Stack = createNativeStackNavigator();

export default function CustomerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="CustomerTabs"
        component={CustomerTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="JoinQueue" component={JoinQueueScreen} options={{ title: 'Join Queue' }} />
      <Stack.Screen name="QueueHistory" component={QueueHistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="RateService" component={RateServiceScreen} options={{ title: 'Rate Service' }} />
    </Stack.Navigator>
  );
}