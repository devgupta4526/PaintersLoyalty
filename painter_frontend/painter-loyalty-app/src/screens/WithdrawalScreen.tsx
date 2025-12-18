import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService } from '../services/api';

interface Props {
  navigation: WithdrawalScreenNavigationProp;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: Date;
  processedDate?: Date;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  notes?: string;
}

type WithdrawalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Withdrawal'>;
type WithdrawalScreenRouteProp = RouteProp<RootStackParamList, 'Withdrawal'>;

interface Props {
  navigation: WithdrawalScreenNavigationProp;
  route: WithdrawalScreenRouteProp;
}

export default function WithdrawalScreen({ navigation }: Props) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [requestData, setRequestData] = useState({
    amount: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });

  const loadWithdrawals = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getWithdrawals();
      setWithdrawals(data);
      // Get balance from wallet summary
      const walletData = await apiService.getWalletSummary();
      setBalance(walletData.balance);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const createWithdrawalRequest = async () => {
    const amount = parseFloat(requestData.amount);

    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amount > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    if (amount < 100) {
      Alert.alert('Error', 'Minimum withdrawal amount is ₹100');
      return;
    }

    if (!requestData.accountNumber || !requestData.ifscCode || !requestData.accountHolderName) {
      Alert.alert('Error', 'Please fill in all bank details');
      return;
    }

    try {
      await apiService.createWithdrawalRequest({
        amount,
        bankDetails: {
          accountNumber: requestData.accountNumber,
          ifscCode: requestData.ifscCode,
          accountHolderName: requestData.accountHolderName,
        },
      });

      setShowRequestModal(false);
      setRequestData({
        amount: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
      });
      loadWithdrawals();
      Alert.alert('Success', 'Withdrawal request submitted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create withdrawal request');
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'approved': return '#007AFF';
      case 'completed': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#666';
    }
  };

  const renderWithdrawalCard = (withdrawal: WithdrawalRequest) => (
    <View key={withdrawal.id} style={styles.withdrawalCard}>
      <View style={styles.withdrawalHeader}>
        <Text style={styles.withdrawalAmount}>₹{withdrawal.amount}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(withdrawal.status) }
        ]}>
          <Text style={styles.statusText}>{withdrawal.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.withdrawalDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account:</Text>
          <Text style={styles.detailValue}>
            ****{withdrawal.bankDetails.accountNumber.slice(-4)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IFSC:</Text>
          <Text style={styles.detailValue}>{withdrawal.bankDetails.ifscCode}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Requested:</Text>
          <Text style={styles.detailValue}>
            {new Date(withdrawal.requestDate).toLocaleDateString()}
          </Text>
        </View>
        {withdrawal.processedDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Processed:</Text>
            <Text style={styles.detailValue}>
              {new Date(withdrawal.processedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {withdrawal.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{withdrawal.notes}</Text>
        </View>
      )}
    </View>
  );

  const renderRequestModal = () => (
    <Modal
      visible={showRequestModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowRequestModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Request Withdrawal</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRequestModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>₹{balance}</Text>
              <Text style={styles.minAmount}>Minimum withdrawal: ₹100</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount (₹)"
              value={requestData.amount}
              onChangeText={(text) => setRequestData(prev => ({ ...prev, amount: text }))}
              keyboardType="numeric"
            />

            <Text style={styles.sectionTitle}>Bank Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              value={requestData.accountHolderName}
              onChangeText={(text) => setRequestData(prev => ({ ...prev, accountHolderName: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Account Number"
              value={requestData.accountNumber}
              onChangeText={(text) => setRequestData(prev => ({ ...prev, accountNumber: text }))}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              value={requestData.ifscCode}
              onChangeText={(text) => setRequestData(prev => ({ ...prev, ifscCode: text }))}
              autoCapitalize="characters"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRequestModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={createWithdrawalRequest}
            >
              <Text style={styles.submitButtonText}>Request Withdrawal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Withdrawals</Text>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => setShowRequestModal(true)}
        >
          <Text style={styles.requestButtonText}>+ Request</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceCardLabel}>Available Balance</Text>
        <Text style={styles.balanceCardAmount}>₹{balance}</Text>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading withdrawals...</Text>
          </View>
        ) : withdrawals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No withdrawal requests</Text>
            <Text style={styles.emptySubtext}>
              Your withdrawal history will appear here
            </Text>
          </View>
        ) : (
          withdrawals.map(renderWithdrawalCard)
        )}
      </ScrollView>

      {renderRequestModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  requestButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceCardLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  balanceCardAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  withdrawalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  withdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  withdrawalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  withdrawalDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  notesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  balanceInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  minAmount: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});