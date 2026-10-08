import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';
import StaffStack from './StaffStack';
import AdminStack from './AdminStack';
import { theme } from '../core/theme/theme';

const RootStack = createNativeStackNavigator();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
  },
};

// Root navigator: nag-decide asa nga role-stack ang i-mount base sa login.
// Ang LoginScreen mo-call og navigation.replace('CustomerStack' | 'StaffStack' | 'AdminStack')
// human successful login (tan-awa sa features/auth/presentation/screens/LoginScreen.js).
export default function AppNavigator() {
  return (
    <NavigationContainer theme={appTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AuthStack" component={AuthStack} />
        <RootStack.Screen name="CustomerStack" component={CustomerStack} />
        <RootStack.Screen name="StaffStack" component={StaffStack} />
        <RootStack.Screen name="AdminStack" component={AdminStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

