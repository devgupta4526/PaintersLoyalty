import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';

type RootStackParamList = {
  ScanCoupon: undefined;
};

type ScanCouponScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ScanCoupon'>;
type ScanCouponScreenRouteProp = RouteProp<RootStackParamList, 'ScanCoupon'>;

interface Props {
  navigation: ScanCouponScreenNavigationProp;
  route: ScanCouponScreenRouteProp;
}

export default function ScanCouponScreen({ navigation }: Props) {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [couponData, setCouponData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleValidate = async () => {
    if (!couponCode.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const result = await apiService.validateCoupon(couponCode.trim());
      if (result.valid) {
        setCouponData({ code: couponCode, value: result.value });
        setShowModal(true);
      } else {
        Alert.alert('Invalid Coupon', 'This coupon is not valid');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRedeem = async () => {
    setIsRedeeming(true);
    try {
      const result = await apiService.redeemCoupon(couponCode);
      Alert.alert(
        'Success!',
        `Coupon redeemed successfully! You earned ${result.pointsEarned} points.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowModal(false);
              setCouponCode('');
              setCouponData(null);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to redeem coupon');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setCouponData(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Coupon</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code" size={80} color="#ccc" />
          <Text style={styles.qrText}>QR Scanner Coming Soon</Text>
          <Text style={styles.manualText}>Enter coupon code manually below</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Coupon Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isValidating && styles.buttonDisabled]}
          onPress={handleValidate}
          disabled={isValidating}
        >
          <Text style={styles.buttonText}>
            {isValidating ? 'Validating...' : 'Validate Coupon'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Coupon Valid!</Text>
            <View style={styles.couponDetails}>
              <Text style={styles.couponCode}>{couponData?.code}</Text>
              <Text style={styles.couponValue}>
                Value: {couponData?.value} points
              </Text>
            </View>

            <Text style={styles.confirmText}>
              Do you want to redeem this coupon?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.redeemButton, isRedeeming && styles.buttonDisabled]}
                onPress={handleRedeem}
                disabled={isRedeeming}
              >
                <Text style={styles.redeemButtonText}>
                  {isRedeeming ? 'Redeeming...' : 'Redeem'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  qrPlaceholder: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    marginBottom: 30,
  },
  qrText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  manualText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  couponDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  couponValue: {
    fontSize: 16,
    color: '#666',
  },
  confirmText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  redeemButton: {
    backgroundColor: '#007AFF',
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});