import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService } from '../services/api';

interface Props {
  navigation: NotificationsScreenNavigationProp;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notifications'>;
type NotificationsScreenRouteProp = RouteProp<RootStackParamList, 'Notifications'>;

interface Props {
  navigation: NotificationsScreenNavigationProp;
  route: NotificationsScreenRouteProp;
}

export default function NotificationsScreen({ navigation }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getNotifications();
      setNotifications(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error: any) {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error: any) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' || !notif.isRead
  );

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      case 'info':
      default: return '#007AFF';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      case 'info':
      default: return 'ℹ';
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard
      ]}
      onPress={() => !notification.isRead && markAsRead(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <View style={[
            styles.typeIcon,
            { backgroundColor: getTypeColor(notification.type) }
          ]}>
            <Text style={styles.typeIconText}>
              {getTypeIcon(notification.type)}
            </Text>
          </View>
          <View style={styles.notificationContent}>
            <Text style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadText
            ]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationTime}>
              {new Date(notification.createdAt).toLocaleDateString()} at{' '}
              {new Date(notification.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>
        {!notification.isRead && (
          <View style={styles.unreadDot} />
        )}
      </View>

      <Text style={styles.notificationMessage}>
        {notification.message}
      </Text>

      {notification.actionUrl && (
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.activeFilterTabText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading notifications...</Text>
          </View>
        ) : filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </Text>
            <Text style={styles.emptySubtext}>
              {filter === 'unread'
                ? 'You\'re all caught up!'
                : 'Notifications will appear here when available'
              }
            </Text>
          </View>
        ) : (
          filteredNotifications.map(renderNotificationCard)
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
  markAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  markAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#007AFF',
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
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginTop: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});