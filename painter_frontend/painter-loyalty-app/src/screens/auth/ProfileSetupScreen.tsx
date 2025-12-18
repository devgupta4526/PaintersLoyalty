import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { apiService } from '../../services/api';

type RootStackParamList = {
  ProfileSetup: undefined;
  Main: undefined;
};

type ProfileSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetup'>;
type ProfileSetupScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSetup'>;

interface Props {
  navigation: ProfileSetupScreenNavigationProp;
  route: ProfileSetupScreenRouteProp;
}

export default function ProfileSetupScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    region: '',
    yearsOfExperience: '',
    skills: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteProfile = async () => {
    if (!formData.name || !formData.region) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const profileData = {
        ...formData,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };

      await apiService.updateProfile(profileData);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Fill in your details to start earning points
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Region *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your region/city"
              value={formData.region}
              onChangeText={(value) => updateFormData('region', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter years of experience"
              keyboardType="number-pad"
              value={formData.yearsOfExperience}
              onChangeText={(value) => updateFormData('yearsOfExperience', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Skills (comma-separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Painting, Interior, Exterior"
              value={formData.skills}
              onChangeText={(value) => updateFormData('skills', value)}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCompleteProfile}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            * Required fields. You can update your profile later from the Profile screen.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
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
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});