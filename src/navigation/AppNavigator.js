import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';
import StaffStack from './StaffStack';
import AdminStack from './AdminStack';
import { theme } from '../core/theme/theme';
import { getStoredUser } from '../core/storage/localStorage';
import { ROLES } from '../core/constants/strings';
import LoadingIndicator from '../components/LoadingIndicator';

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

// Root navigator: checks for existing session on startup
// and routes to the correct role-based stack.
export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getStoredUser();
        if (user && user.role) {
          if (user.role === ROLES.ADMIN) setInitialRoute('AdminStack');
          else if (user.role === ROLES.STAFF) setInitialRoute('StaffStack');
          else setInitialRoute('CustomerStack');
        } else {
          setInitialRoute('AuthStack');
        }
      } catch {
        setInitialRoute('AuthStack');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return <LoadingIndicator />;

  return (
    <NavigationContainer theme={appTheme}>
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="AuthStack" component={AuthStack} />
        <RootStack.Screen name="CustomerStack" component={CustomerStack} />
        <RootStack.Screen name="StaffStack" component={StaffStack} />
        <RootStack.Screen name="AdminStack" component={AdminStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
