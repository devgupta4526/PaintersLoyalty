import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { apiService } from '../services/api';

type TabParamList = {
  Dashboard: undefined;
  Offers: undefined;
  Earnings: undefined;
  Profile: undefined;
};

type EarningsScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Earnings'>;

interface Props {
  navigation: EarningsScreenNavigationProp;
}

interface Transaction {
  id: string;
  type: string;
  points: number;
  referenceId: string;
  month: number;
  year: number;
  createdAt: Date;
}

export default function EarningsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'summary' | 'monthly' | 'quarterly' | 'yearly' | 'transactions'>('summary');
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'summary':
          const summary = await apiService.getWalletSummary();
          setData(summary);
          break;
        case 'monthly':
          const monthly = await apiService.getMonthlyEarnings(selectedYear);
          setData(monthly);
          break;
        case 'quarterly':
          const quarterly = await apiService.getQuarterlyEarnings(selectedYear);
          setData(quarterly);
          break;
        case 'yearly':
          const yearly = await apiService.getYearlyEarnings();
          setData(yearly);
          break;
        case 'transactions':
          const txns = await apiService.getTransactions();
          setTransactions(txns);
          break;
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedYear]);

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>{data?.balance || 0}</Text>
      </View>

      <View style={styles.earningsGrid}>
        <View style={styles.earningCard}>
          <Text style={styles.earningValue}>{data?.monthlyEarnings || 0}</Text>
          <Text style={styles.earningLabel}>This Month</Text>
        </View>
        <View style={styles.earningCard}>
          <Text style={styles.earningValue}>{data?.quarterlyEarnings || 0}</Text>
          <Text style={styles.earningLabel}>This Quarter</Text>
        </View>
        <View style={styles.earningCard}>
          <Text style={styles.earningValue}>{data?.yearlyEarnings || 0}</Text>
          <Text style={styles.earningLabel}>This Year</Text>
        </View>
        <View style={styles.earningCard}>
          <Text style={styles.earningValue}>{data?.totalEarned || 0}</Text>
          <Text style={styles.earningLabel}>Total Earned</Text>
        </View>
      </View>
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.transactionsContainer}>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions found</Text>
      ) : (
        transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <Text style={styles.transactionType}>{transaction.type}</Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[
                styles.transactionPoints,
                transaction.points > 0 ? styles.positive : styles.negative
              ]}>
                {transaction.points > 0 ? '+' : ''}{transaction.points}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const tabs = [
    { key: 'summary', label: 'Summary' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'yearly', label: 'Yearly' },
    { key: 'transactions', label: 'History' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Earnings</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : activeTab === 'summary' ? (
          renderSummary()
        ) : activeTab === 'transactions' ? (
          renderTransactions()
        ) : (
          <View style={styles.dataContainer}>
            <Text style={styles.dataValue}>
              {activeTab === 'monthly' && `${data?.total || 0} points`}
              {activeTab === 'quarterly' && `${data?.total || 0} points`}
              {activeTab === 'yearly' && `${data?.total || 0} points`}
            </Text>
            <Text style={styles.dataLabel}>
              {activeTab === 'monthly' && `Earnings for ${selectedYear}`}
              {activeTab === 'quarterly' && `Earnings for ${selectedYear}`}
              {activeTab === 'yearly' && 'Total yearly earnings'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  summaryContainer: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
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
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  earningLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  dataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  dataLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  transactionsContainer: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionPoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positive: {
    color: '#28a745',
  },
  negative: {
    color: '#dc3545',
  },
});