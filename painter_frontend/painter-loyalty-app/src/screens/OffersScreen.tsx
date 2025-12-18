import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { apiService } from '../services/api';

type TabParamList = {
  Dashboard: undefined;
  Offers: undefined;
  Earnings: undefined;
  Profile: undefined;
};

type OffersScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Offers'>;

interface Props {
  navigation: OffersScreenNavigationProp;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
  image?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participationCount: number;
  maxParticipations: number;
}

export default function OffersScreen({ navigation }: Props) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [participatingOffers, setParticipatingOffers] = useState<Set<string>>(new Set());

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getOffers();
      setOffers(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  };

  const participateInOffer = async (offerId: string) => {
    try {
      await apiService.participateInOffer(offerId);
      setParticipatingOffers(prev => new Set([...prev, offerId]));
      Alert.alert('Success', 'Successfully participated in the offer!');
      loadOffers(); // Refresh to update participation count
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to participate in offer');
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const renderOfferCard = (offer: Offer) => {
    const isParticipating = participatingOffers.has(offer.id);
    const isFull = offer.participationCount >= offer.maxParticipations;
    const isExpired = new Date(offer.endDate) < new Date();

    return (
      <View key={offer.id} style={styles.offerCard}>
        {offer.image && (
          <Image source={{ uri: offer.image }} style={styles.offerImage} />
        )}
        <View style={styles.offerContent}>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.offerDescription}>{offer.description}</Text>

          <View style={styles.offerDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Points:</Text>
              <Text style={styles.detailValue}>{offer.points}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ends:</Text>
              <Text style={styles.detailValue}>
                {new Date(offer.endDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Participants:</Text>
              <Text style={styles.detailValue}>
                {offer.participationCount}/{offer.maxParticipations}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.participateButton,
              (isParticipating || isFull || isExpired) && styles.disabledButton
            ]}
            onPress={() => participateInOffer(offer.id)}
            disabled={isParticipating || isFull || isExpired}
          >
            <Text style={[
              styles.participateButtonText,
              (isParticipating || isFull || isExpired) && styles.disabledButtonText
            ]}>
              {isParticipating ? 'Participating' :
               isFull ? 'Full' :
               isExpired ? 'Expired' : 'Participate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Offers</Text>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading offers...</Text>
          </View>
        ) : offers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No offers available at the moment</Text>
          </View>
        ) : (
          offers.map(renderOfferCard)
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  offerContent: {
    padding: 15,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  offerDetails: {
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
  participateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  participateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
});