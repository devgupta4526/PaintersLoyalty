import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create them next)
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ProfileSetupScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ScanCouponScreen from '../screens/ScanCouponScreen';
import EarningsScreen from '../screens/EarningsScreen';
import OffersScreen from '../screens/OffersScreen';
import TrainingsScreen from '../screens/TrainingsScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WithdrawalScreen from '../screens/WithdrawalScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Otp: { mobile: string; email?: string };
  ProfileSetup: undefined;
  Main: undefined;
  ScanCoupon: undefined;
  Withdrawal: undefined;
  Trainings: undefined;
  Products: undefined;
  Complaints: undefined;
  Notifications: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Offers: undefined;
  Earnings: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Offers') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="ScanCoupon" component={ScanCouponScreen} />
        <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
        <Stack.Screen name="Trainings" component={TrainingsScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Complaints" component={ComplaintsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}