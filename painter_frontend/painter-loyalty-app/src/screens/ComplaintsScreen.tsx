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
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService } from '../services/api';

interface Props {
  navigation: ComplaintsScreenNavigationProp;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  response?: string;
}

type ComplaintsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Complaints'>;
type ComplaintsScreenRouteProp = RouteProp<RootStackParamList, 'Complaints'>;

interface Props {
  navigation: ComplaintsScreenNavigationProp;
  route: ComplaintsScreenRouteProp;
}

export default function ComplaintsScreen({ navigation }: Props) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getComplaints();
      setComplaints(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const createComplaint = async () => {
    if (!newComplaint.title.trim() || !newComplaint.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await apiService.createComplaint(newComplaint);
      setShowCreateModal(false);
      setNewComplaint({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
      });
      loadComplaints();
      Alert.alert('Success', 'Complaint submitted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create complaint');
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'in_progress': return '#007AFF';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#666';
    }
  };

  const renderComplaintCard = (complaint: Complaint) => (
    <View key={complaint.id} style={styles.complaintCard}>
      <View style={styles.complaintHeader}>
        <Text style={styles.complaintTitle}>{complaint.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(complaint.status) }
        ]}>
          <Text style={styles.statusText}>{complaint.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.complaintDescription} numberOfLines={3}>
        {complaint.description}
      </Text>

      <View style={styles.complaintDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{complaint.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Priority:</Text>
          <Text style={[
            styles.detailValue,
            { color: getPriorityColor(complaint.priority) }
          ]}>
            {complaint.priority}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>
            {new Date(complaint.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {complaint.response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Response:</Text>
          <Text style={styles.responseText}>{complaint.response}</Text>
        </View>
      )}

      {complaint.images && complaint.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {complaint.images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.complaintImage}
            />
          ))}
          {complaint.images.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{complaint.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Complaint</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <TextInput
              style={styles.input}
              placeholder="Complaint Title *"
              value={newComplaint.title}
              onChangeText={(text) => setNewComplaint(prev => ({ ...prev, title: text }))}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description *"
              value={newComplaint.description}
              onChangeText={(text) => setNewComplaint(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Category (e.g., Product, Service, Payment)"
              value={newComplaint.category}
              onChangeText={(text) => setNewComplaint(prev => ({ ...prev, category: text }))}
            />

            <View style={styles.priorityContainer}>
              <Text style={styles.priorityLabel}>Priority:</Text>
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newComplaint.priority === priority && styles.priorityButtonActive
                  ]}
                  onPress={() => setNewComplaint(prev => ({ ...prev, priority }))}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    newComplaint.priority === priority && styles.priorityButtonTextActive
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={createComplaint}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Complaints</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading complaints...</Text>
          </View>
        ) : complaints.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No complaints found</Text>
            <Text style={styles.emptySubtext}>Create your first complaint to get help</Text>
          </View>
        ) : (
          complaints.map(renderComplaintCard)
        )}
      </ScrollView>

      {renderCreateModal()}
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
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  complaintCard: {
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
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  complaintDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  complaintDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  responseContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  complaintImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 8,
  },
  moreImages: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreImagesText: {
    fontSize: 14,
    color: '#666',
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
    maxHeight: '80%',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginBottom: 15,
  },
  priorityLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  priorityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  priorityButtonTextActive: {
    color: 'white',
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