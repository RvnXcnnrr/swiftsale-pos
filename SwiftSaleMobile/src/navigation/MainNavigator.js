import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constants/theme';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import POSScreen from '../screens/pos/POSScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import SalesScreen from '../screens/sales/SalesScreen';
import SettingsScreen from '../screens/SettingsScreen';

import CustomerSelectScreen from '../screens/customers/CustomerSelectScreen';
import PaymentScreen from '../screens/pos/PaymentScreen';
import ReceiptScreen from '../screens/pos/ReceiptScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const POSStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="POSMain" 
      component={POSScreen} 
      options={{ title: 'Point of Sale' }}
    />

    <Stack.Screen 
      name="CustomerSelect" 
      component={CustomerSelectScreen} 
      options={{ title: 'Select Customer' }}
    />
    <Stack.Screen 
      name="Payment" 
      component={PaymentScreen} 
      options={{ title: 'Payment' }}
    />
    <Stack.Screen 
      name="Receipt" 
      component={ReceiptScreen} 
      options={{ title: 'Receipt' }}
    />
  </Stack.Navigator>
);

const ProductsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProductsMain" 
      component={ProductsScreen} 
      options={{ title: 'Products' }}
    />
  </Stack.Navigator>
);

const SalesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SalesMain" 
      component={SalesScreen} 
      options={{ title: 'Sales History' }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'POS':
              iconName = 'point-of-sale';
              break;
            case 'Products':
              iconName = 'inventory';
              break;
            case 'Sales':
              iconName = 'receipt';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="POS" component={POSStack} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Sales" component={SalesStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
