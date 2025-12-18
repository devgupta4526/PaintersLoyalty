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
  Image,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

type TabParamList = {
  Dashboard: undefined;
  Offers: undefined;
  Earnings: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  experience: number;
  specialization: string[];
  kycStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: Date;
}

export default function ProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    specialization: '',
  });

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getProfile();
      setProfile(data);
      setEditData({
        name: data.name,
        phone: data.phone,
        address: data.address,
        specialization: data.specialization.join(', '),
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const updatedData = {
        ...editData,
        specialization: editData.specialization.split(',').map(s => s.trim()),
      };
      await apiService.updateProfile(updatedData);
      setShowEditModal(false);
      loadProfile();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              // Navigation will be handled by auth state change
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const renderProfileInfo = () => {
    if (!profile) return null;

    return (
      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileBasic}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <View style={[
              styles.kycBadge,
              { backgroundColor: profile.kycStatus === 'approved' ? '#28a745' : '#ffc107' }
            ]}>
              <Text style={styles.kycBadgeText}>
                KYC: {profile.kycStatus}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.addressText}>
            {profile.address.street}{'\n'}
            {profile.address.city}, {profile.address.state} {profile.address.pincode}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience:</Text>
            <Text style={styles.infoValue}>{profile.experience} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Specialization:</Text>
            <Text style={styles.infoValue}>{profile.specialization.join(', ')}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[
              styles.infoValue,
              { color: profile.isActive ? '#28a745' : '#dc3545' }
            ]}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since:</Text>
            <Text style={styles.infoValue}>
              {new Date(profile.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editData.name}
              onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={editData.phone}
              onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={editData.address.street}
              onChangeText={(text) => setEditData(prev => ({
                ...prev,
                address: { ...prev.address, street: text }
              }))}
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              value={editData.address.city}
              onChangeText={(text) => setEditData(prev => ({
                ...prev,
                address: { ...prev.address, city: text }
              }))}
            />

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="State"
                value={editData.address.state}
                onChangeText={(text) => setEditData(prev => ({
                  ...prev,
                  address: { ...prev.address, state: text }
                }))}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Pincode"
                value={editData.address.pincode}
                onChangeText={(text) => setEditData(prev => ({
                  ...prev,
                  address: { ...prev.address, pincode: text }
                }))}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Specialization (comma separated)"
              value={editData.specialization}
              onChangeText={(text) => setEditData(prev => ({ ...prev, specialization: text }))}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={updateProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading profile...</Text>
          </View>
        ) : (
          renderProfileInfo()
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {renderEditModal()}
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
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
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
  profileInfo: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  profileBasic: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  kycBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  kycBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
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
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});