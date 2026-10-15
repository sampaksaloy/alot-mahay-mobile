import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../features/auth/presentation/screens/WelcomeScreen';
import CustomerLoginScreen from '../features/auth/presentation/screens/CustomerLoginScreen';
import CustomerRegisterScreen from '../features/auth/presentation/screens/CustomerRegisterScreen';
import StaffLoginScreen from '../features/auth/presentation/screens/StaffLoginScreen';
import StaffRegisterScreen from '../features/auth/presentation/screens/StaffRegisterScreen';
import AdminLoginScreen from '../features/auth/presentation/screens/AdminLoginScreen';
import AdminRegisterScreen from '../features/auth/presentation/screens/AdminRegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
      <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
      <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
      <Stack.Screen name="StaffRegister" component={StaffRegisterScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminRegister" component={AdminRegisterScreen} />

      {/* Backward-compatibility aliases */}
      <Stack.Screen name="Login" component={CustomerLoginScreen} />
      <Stack.Screen name="Register" component={CustomerRegisterScreen} />
    </Stack.Navigator>
  );
}

