import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import DebugScreen from '../screens/DebugScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          headerShown: true,
          title: 'Debug Tools'
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
