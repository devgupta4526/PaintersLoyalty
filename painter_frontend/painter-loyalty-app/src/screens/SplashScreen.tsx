import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
  route: SplashScreenRouteProp;
}

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Token exists, go to main app
          navigation.replace('Main');
        } else {
          // No token, go to login
          navigation.replace('Login');
        }
      } catch (error) {
        navigation.replace('Login');
      }
    };

    // Simulate splash screen delay
    setTimeout(checkAuth, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      /> */}
      <Text style={styles.title}>Painter Loyalty</Text>
      <Text style={styles.subtitle}>Your painting journey starts here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
});