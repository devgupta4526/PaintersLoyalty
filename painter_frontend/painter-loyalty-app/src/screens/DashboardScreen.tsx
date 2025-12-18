import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { DashboardData } from '../types';

type RootStackParamList = {
  Dashboard: undefined;
  ScanCoupon: undefined;
  Withdrawal: undefined;
  Trainings: undefined;
  Products: undefined;
  Complaints: undefined;
  Notifications: undefined;
};

type TabParamList = {
  Dashboard: undefined;
  Offers: undefined;
  Earnings: undefined;
  Profile: undefined;
};

type DashboardScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Dashboard'> & StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: Props) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const data = await apiService.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const navigateToScan = () => {
    navigation.navigate('ScanCoupon');
  };

  const navigateToWithdrawal = () => {
    navigation.navigate('Withdrawal');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Points</Text>
        <Text style={styles.balanceAmount}>{dashboardData?.walletBalance || 0}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={navigateToScan}>
          <Ionicons name="qr-code" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Scan Coupon</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={navigateToWithdrawal}>
          <Ionicons name="cash" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData?.monthlyEarnings || 0}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData?.quarterlyEarnings || 0}</Text>
            <Text style={styles.statLabel}>This Quarter</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData?.yearlyEarnings || 0}</Text>
            <Text style={styles.statLabel}>This Year</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offers</Text>
        <View style={styles.offersSummary}>
          <View style={styles.offerStat}>
            <Text style={styles.offerCount}>{dashboardData?.offerProgressSummary?.inProgress || 0}</Text>
            <Text style={styles.offerLabel}>In Progress</Text>
          </View>
          <View style={styles.offerStat}>
            <Text style={styles.offerCount}>{dashboardData?.offerProgressSummary?.completed || 0}</Text>
            <Text style={styles.offerLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity
          style={styles.activityItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications" size={20} color="#666" />
          <Text style={styles.activityText}>
            {dashboardData?.latestNotifications?.length || 0} unread notifications
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.activityItem}
          onPress={() => navigation.navigate('Trainings')}
        >
          <Ionicons name="school" size={20} color="#666" />
          <Text style={styles.activityText}>
            {dashboardData?.trainingHighlights?.completed || 0} trainings completed
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  kycStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
    fontWeight: '500',
  },
  statsSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  offersSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  offerStat: {
    alignItems: 'center',
  },
  offerCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  offerLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});