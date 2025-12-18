import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService } from '../services/api';

interface Props {
  navigation: TrainingsScreenNavigationProp;
}

interface Training {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  points: number;
  modules: TrainingModule[];
  isCompleted: boolean;
  progress: number; // 0-100
}

interface TrainingModule {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
}

type TrainingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Trainings'>;
type TrainingsScreenRouteProp = RouteProp<RootStackParamList, 'Trainings'>;

interface Props {
  navigation: TrainingsScreenNavigationProp;
  route: TrainingsScreenRouteProp;
}

export default function TrainingsScreen({ navigation }: Props) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const loadTrainings = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getTrainings();
      setTrainings(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load trainings');
    } finally {
      setIsLoading(false);
    }
  };

  const startTraining = async (trainingId: string) => {
    try {
      await apiService.startTraining(trainingId);
      loadTrainings(); // Refresh to update progress
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start training');
    }
  };

  const completeModule = async (trainingId: string, moduleId: string) => {
    try {
      await apiService.completeTrainingModule(trainingId, moduleId);
      loadTrainings(); // Refresh to update progress
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete module');
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const renderTrainingCard = (training: Training) => (
    <TouchableOpacity
      key={training.id}
      style={styles.trainingCard}
      onPress={() => setSelectedTraining(training)}
    >
      <View style={styles.trainingHeader}>
        <Text style={styles.trainingTitle}>{training.title}</Text>
        <Text style={styles.trainingPoints}>{training.points} points</Text>
      </View>

      <Text style={styles.trainingDescription} numberOfLines={2}>
        {training.description}
      </Text>

      <View style={styles.trainingFooter}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Progress: {training.progress}%</Text>
          {Platform.OS === 'android' ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={training.progress / 100}
              style={styles.progressBar}
            />
          ) : (
            <View style={styles.progressBarIOS}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${training.progress}%` }
                ]}
              />
            </View>
          )}
        </View>

        <Text style={styles.trainingDuration}>{training.duration} min</Text>
      </View>

      {training.isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTrainingDetail = () => {
    if (!selectedTraining) return null;

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedTraining(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{selectedTraining.title}</Text>
        </View>

        <ScrollView style={styles.modulesContainer}>
          {selectedTraining.modules.map((module, index) => (
            <View key={module.id} style={styles.moduleCard}>
              <View style={styles.moduleHeader}>
                <Text style={styles.moduleNumber}>{index + 1}</Text>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                {module.isCompleted && (
                  <View style={styles.moduleCompleted}>
                    <Text style={styles.moduleCompletedText}>✓</Text>
                  </View>
                )}
              </View>

              <Text style={styles.moduleContent}>{module.content}</Text>

              {!module.isCompleted && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeModule(selectedTraining.id, module.id)}
                >
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {!selectedTraining.isCompleted && selectedTraining.progress === 0 && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => startTraining(selectedTraining.id)}
          >
            <Text style={styles.startButtonText}>Start Training</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Programs</Text>
      </View>

      {selectedTraining ? (
        renderTrainingDetail()
      ) : (
        <ScrollView style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading trainings...</Text>
            </View>
          ) : trainings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No trainings available at the moment</Text>
            </View>
          ) : (
            trainings.map(renderTrainingCard)
          )}
        </ScrollView>
      )}
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
  trainingCard: {
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
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  trainingPoints: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  trainingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  trainingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
  },
  progressBarIOS: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  trainingDuration: {
    fontSize: 12,
    color: '#666',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
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
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modulesContainer: {
    flex: 1,
    padding: 20,
  },
  moduleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moduleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  moduleCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleCompletedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  moduleContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#28a745',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});