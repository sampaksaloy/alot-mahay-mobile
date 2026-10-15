import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabs from './AdminTabs';
import ManageServicesScreen from '../features/admin/presentation/screens/ManageServicesScreen';
import ManageStaffScreen from '../features/admin/presentation/screens/ManageStaffScreen';
import ManageCustomersScreen from '../features/admin/presentation/screens/ManageCustomersScreen';
import ManageSchedulesScreen from '../features/admin/presentation/screens/ManageSchedulesScreen';
import MonitorQueueScreen from '../features/admin/presentation/screens/MonitorQueueScreen';
import ReportsScreen from '../features/admin/presentation/screens/ReportsScreen';
import RatingsListScreen from '../features/admin/presentation/screens/RatingsListScreen';
import NotificationsScreen from '../features/notifications/presentation/screens/NotificationsScreen';

import { theme } from '../core/theme/theme';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
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
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ManageServices" component={ManageServicesScreen} options={{ title: 'Manage Services' }} />
      <Stack.Screen name="ManageStaff" component={ManageStaffScreen} options={{ title: 'Manage Staff' }} />
      <Stack.Screen name="ManageCustomers" component={ManageCustomersScreen} options={{ title: 'Manage Customers' }} />
      <Stack.Screen name="ManageSchedules" component={ManageSchedulesScreen} options={{ title: 'Manage Schedules' }} />
      <Stack.Screen name="MonitorQueue" component={MonitorQueueScreen} options={{ title: 'Monitor Queue' }} />
      <Stack.Screen name="Ratings" component={RatingsListScreen} options={{ title: 'Ratings & Feedback' }} />
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports & Analytics' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Admin Alerts & Notifications' }} />
    </Stack.Navigator>
  );
}

